import {BaseRepository, QueryOptions} from "../../shared/repositories/BaseRepository";
import {Sensor} from "../../shared/entities/Sensor";
import {paginationConfig} from "../../../config";
import {Hub} from "../../shared/entities/Hub";
import {User} from "../../shared/entities/User";
import {UserRole} from "../../../components/types/UserRoleTypes";
import {SensorStatus, SensorStatusType} from "../../../components/types/SensorStatus";
import moment from 'moment';
export class SensorRepository extends BaseRepository
{
    private searchableFields: string[] = [
        'name',
        'serial',
        'lastSeen',
    ];

    async getList(options: QueryOptions = {}, user: User | null = null): Promise<any>
    {
        let parameters: any = {};
        let whereStatements: any = [];

        const offset = options.page ? paginationConfig.limit * (options.page - 1) : 0;

        const query = await this
            .createQueryBuilder('s')
            .select([
                's.id',
                's.name',
                's.deviceName',
                's.serial',
                's.currentTemp',
                's.batteryStatus',
                's.isConnected',
                's.lastSeen',
                's.minTemp',
                's.maxTemp',
                's.createdAt',
                's.updatedAt'
            ])
            .leftJoin('s.hub', 'h');

        if (user && user.role !== UserRole.admin) {
            query
                .innerJoin('h.zone', 'z')
                .innerJoin('z.users', 'u')

            whereStatements.push('u.id = :userId');
            parameters.userId = user.id;
        }

        // create filters if provided
        if (!!options.filters) {
            for (const [field, value] of Object.entries(options.filters)) {
                if (field === 'hub') {
                    switch (value) {
                        case null: whereStatements.push('s.hub IS NULL'); break;
                        default:
                            whereStatements.push('s.hub = :hubId');
                            parameters.hubId = value;
                    }
                } else {
                    whereStatements.push(`s.${field} = :${field}`);
                    parameters[field] = value;
                }
            }
        }

        // add sort and
        if (!!options.sort) {
            for (const [field, value] of Object.entries(options.sort)) {
                query.addOrderBy(`s.${field}`, value)
            }
        }

        // create search statement if find is provided
        if (!!options.find) {
            parameters.find = `%${options.find}%`;
            let searchStatement = [];

            for (const field of this.searchableFields) {
                searchStatement.push(`s.${field} LIKE :find`);
            }

            whereStatements.push(`(${searchStatement.join(' OR ')})`);
        }

        do {
            if (options.relations === undefined) {
                break;
            }

            if (options.relations.indexOf('hub') > -1) {
                query.addSelect('h');
            }

            break;
        } while (true);

        if (whereStatements.length > 0) {
            query
                .where(whereStatements.join(' AND '))
                .setParameters(parameters);
        }

        const totalCount = await this.getCount(query);

        query
            .offset(offset)
            .limit(paginationConfig.limit)

        const data = await query.getMany();

        return {
            totalCount: totalCount,
            count: data.length,
            data: data
        }
    }

    async update(sensor: Sensor, data: Partial<Sensor>): Promise<boolean>
    {
        sensor.name = data.name!;
        //@ts-ignore
        sensor.maxTemp = parseInt(data.maxTemp) || sensor.maxTemp;
        //@ts-ignore
        sensor.minTemp = parseInt(data.minTemp) || sensor.minTemp;

        if (data.hub) {
            sensor.hub = data.hub;
        }

        await this.repository.save(sensor);

        return true;
    }

    async create(data: Partial<Sensor>):Promise<Sensor>
    {
        let sensor: Sensor = new Sensor();

        sensor.name = data.name!;
        sensor.serial = data.serial!;
        sensor.maxTemp = data.maxTemp!;
        sensor.minTemp = data.minTemp!;

        if (data.hub) {
            sensor.hub = data.hub;
        }

        await this.repository.save(sensor);

        return sensor;
    }

    async findOneBy(options: any, relations: any = null): Promise<Sensor | undefined>
    {
        options = {where: options};
        if (relations !== null) {
            options.relations = relations;
        }
        return await this.repository.findOne(options);
    }

    async save(sensor: Sensor) {
        await this.repository.save(sensor);
    }

    async getSensorCountByStatus(status: SensorStatusType, user: User | null = null)
    {
        let parameters: any = { status }

        const query = await this
            .createQueryBuilder('s')
            .select('s.id')
            .where('s.status = :status');

        if (user !== null && user.role !== UserRole.admin) {
            query
                .innerJoin('s.hub', 'h')
                .innerJoin('h.zone', 'z')
                .innerJoin('z.users', 'u')
                .andWhere('u.id = :userId')

            parameters.userId = user.id;
        }

        query.setParameters(parameters);

        return await query.getCount();
    }

    async getSensorCount(user: User | null = null)
    {
        const query = await this
            .createQueryBuilder('s')
            .select('s.id');

        if (user !== null && user.role !== UserRole.admin) {
            query
                .innerJoin('s.hub', 'h')
                .innerJoin('h.zone', 'z')
                .innerJoin('z.users', 'u')
                .andWhere('u.id = :userId')

            query.setParameter('userId', user.id);
        }

        return await query.getCount();
    }

    async getSensorsLastSeenLongerThan(duration: number)
    {
        const maxIdleTime = moment().unix() - duration;
        const query = this
            .createQueryBuilder('s')
            .select('s.id')
            .where('s.lastSeen <= :maxIdleTime', {maxIdleTime});

        return await query.getMany();
    }

    private async getCount(query: any): Promise<number>
    {
        let queryClone = Object.create(query);

        return await queryClone.getCount();
    }
}
