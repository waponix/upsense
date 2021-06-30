import {BaseRepository, QueryOptions} from "../../shared/repositories/BaseRepository";
import {Hub} from "../../shared/entities/Hub";
import {paginationConfig} from "../../../config";

export class HubRepository extends BaseRepository
{
    private searchableFields: string[] = [
        'name',
        'serial',
        'lastSeen',
    ];
    async getList(options: QueryOptions = {}): Promise<Hub[]> {
        let parameters: any = {};
        let whereStatements: any = [];

        const offset = options.page ? paginationConfig.limit * (options.page - 1) : 0;

        const query = await this
            .createQueryBuilder('h')
            .select([
                'h.id',
                'h.name',
                'h.serial',
                'h.lastSeen',
                'h.isConnected',
                'h.createdAt',
                'h.updatedAt'
            ])
            .offset(offset)
            .limit(paginationConfig.limit);

        // create filters if provided
        if (options.filters !== undefined) {
            for (const [field, value] of Object.entries(options.filters)) {
                whereStatements.push(`h.${field} = :${field}`);
                parameters[field] = value;
            }
        }

        // add sort and
        if (options.sort !== undefined) {
            for (const [field, value] of Object.entries(options.sort)) {
                query.addOrderBy(`h.${field}`, value)
            }
        }

        // create search statement if find is provided
        if (options.find !== undefined) {
            parameters.find = `%${options.find}%`;
            let searchStatement = [];

            for (const field of this.searchableFields) {
                searchStatement.push(`h.${field} LIKE :find`);
            }

            whereStatements.push(`(${searchStatement.join(' OR ')})`);
        }

        do {
            if (options.relations === undefined) {
                break;
            }

            if (options.relations.indexOf('sensors') > -1) {
                query
                    .leftJoinAndSelect('h.sensors', 's');
            }

            if (options.relations.indexOf('zone') > -1) {
                query
                    .leftJoinAndSelect('h.zone', 'z');
            }

            break;
        } while (true);

        if (whereStatements.length > 0) {
            query
                .where(whereStatements.join(' AND '))
                .setParameters(parameters);
        }

        return await query.getMany();
    }

    async update(hub: Hub, data: Partial<Hub>): Promise<boolean> {
        hub.name = data.name!;

        await this.repository.save(hub);

        const relationQueryBuilder = this.repository
            .createQueryBuilder()
            .relation(Hub, 'zone');

        //@ts-ignore
        if (data.zone && data.zone.id) {
            //@ts-ignore
            await relationQueryBuilder.of(hub).set(data.zone);
        }

        return true;
    }

    async create(data: Partial<Hub>):Promise<Hub> {
        let hub: Hub = new Hub();

        hub.name = data.name!;
        hub.serial = data.serial!;

        if (data.zone) {
            hub.zone = data.zone;
        }

        await this.repository.save(hub);

        return hub;
    }

    async findOneById(id: number): Promise<Hub | undefined>
    {
        return await this.repository.findOne({where: { id }});
    }

    async findOneBy(options: any, relations: any = null): Promise<Hub | undefined> {
        options = {where: options};

        if (relations !== null) {
            options.relations = relations;
        }
        return await this.repository.findOne(options);
    }

    async save(hub: Hub) {
        await this.repository.save(hub);
    }

    async findUserEmailsForNotification(hub: Hub): Promise<string[]>
    {
        return this
            .createQueryBuilder('h')
            .innerJoin('h.zone', 'z')
            .innerJoin('z.users', 'u')
            .innerJoin('u.notificationSetting', 'ns')
            .select('u.email as email')
            .where('ns.sendEmail = 1')
            .andWhere('h.id = :hubId')
            .setParameter('hubId', hub.id)
            .getRawMany();
    }
}
