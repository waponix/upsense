import {BaseRepository, QueryOptions} from "../../shared/repositories/BaseRepository";
import {NotificationLog} from "../../shared/entities/NotificationLog";
import {User} from "../../shared/entities/User";
import {UserRole} from "../../../components/types/UserRoleTypes";
import {paginationConfig} from "../../../config";

export class NotificationLogRepository extends BaseRepository
{
    private searchableFields: string[] = [
        'name',
        'minTemp',
        'maxTemp',
        'recordedTemp',
        'message',
        'seen'
    ];

    async getList(options: QueryOptions = {}, user: User | null = null): Promise<any>
    {
        let parameters: any = {};
        let whereStatements: any = [];

        const offset = options.page ? paginationConfig.limit * (options.page - 1) : 0;

        const query = await this
            .createQueryBuilder('nl')
            .leftJoinAndSelect('nl.sensor', 's')
            .leftJoin('s.hub', 'h')
            .leftJoin('h.zone', 'z')
            .leftJoinAndSelect('z.company', 'c')
            .select([
                'nl.id as id',
                's.name as sensor',
                'z.name as zone',
                'c.name as company',
                'nl.minTemp as minTemp',
                'nl.maxTemp as maxTemp',
                'nl.recordedTemp as recordedTemp',
                'nl.message as message',
                'nl.seen as seen',
                'nl.createdAt as createdAt'
            ]);

        if (user && user.role !== UserRole.admin) {
            query.innerJoin('z.users', 'u');

            whereStatements.push('u.id = :userId');
            parameters.userId = user.id;
        }

        // create filters if provided
        if (options.filters !== undefined) {
            for (const [field, value] of Object.entries(options.filters)) {
                whereStatements.push(`s.${field} = :${field}`);
                parameters[field] = value;
            }
        }

        // add sort and
        if (options.sort !== undefined) {
            for (const [field, value] of Object.entries(options.sort)) {
                query.addOrderBy(`nl.${field}`, value)
            }
        } else {
            query.addOrderBy('nl.createdAt', 'DESC');
        }

        // create search statement if find is provided
        if (options.find !== undefined) {
            parameters.find = `%${options.find}%`;
            let searchStatement = [];

            for (const field of this.searchableFields) {
                searchStatement.push(`s.${field} LIKE :find`);
            }

            whereStatements.push(`(${searchStatement.join(' OR ')})`);
        }

        const count = await this.getCount(query);

        query
            .offset(offset)
            .limit(paginationConfig.limit);

        if (whereStatements.length > 0) {
            query
                .where(whereStatements.join(' AND '))
                .setParameters(parameters);
        }

        return {
            count: count,
            data: await query.getRawMany()
        };
    }

    async getLatestRecords(user: User | null = null, limit: number = 10): Promise<NotificationLog[]>
    {
        const query = this
            .createQueryBuilder('nl')
            .leftJoin('nl.sensor', 's')
            .leftJoin('s.hub', 'h')
            .leftJoin('h.zone', 'z')
            .leftJoin('z.company', 'c')
            .select([
                'nl.message AS message',
                'nl.maxTemp AS maxTemp',
                'nl.minTemp AS minTemp',
                'nl.recordedTemp AS recordedTemp',
                's.name AS sensor',
                'z.name AS zone',
                'c.name AS company',
                'nl.createdAt AS createdAt'])
            .orderBy('nl.createdAt', 'DESC')
            .limit(limit);

        if (user && user.role !== UserRole.admin) {
            query
                .innerJoin('z.users', 'u')
                .andWhere('u.id = :userId')
                .setParameter('userId', user.id);
        }

        return await query.getRawMany();
    }

    async create(data: Partial<NotificationLog>): Promise<NotificationLog>
    {
        let log: NotificationLog = new NotificationLog();

        log.sensor = data.sensor!;
        log.message = data.message!;
        log.maxTemp = data.maxTemp!;
        log.minTemp = data.minTemp!;
        log.recordedTemp = data.recordedTemp!;

        await this.repository.save(log);

        return log;
    }

    async save(notificationLog: NotificationLog)
    {
        await this.repository.save(notificationLog);
    }

    async updateSeen(ids: any[], user: User | null = null)
    {
        const query = this.createQueryBuilder('nl');

        await query
            .update(NotificationLog)
            .set({seen: 1})
            .where('id IN (:ids)', {ids})
            .execute();
    }

    async getUnseenCount(user: User | null = null): Promise<number>
    {
        const query = await this
            .createQueryBuilder('nl')
            .leftJoinAndSelect('nl.sensor', 's')
            .leftJoin('s.hub', 'h')
            .leftJoin('h.zone', 'z')
            .leftJoinAndSelect('z.company', 'c')
            .select(['nl.id as id'])
            .where('nl.seen = 0');

        if (user && user.role !== UserRole.admin) {
            query
                .innerJoin('z.users', 'u')
                .andWhere('u.id = :userId')
                .setParameter('userId', user.id);
        }

        return await query.getCount();
    }

    private async getCount(query: any): Promise<number>
    {
        let queryClone = Object.create(query);

        return await queryClone.getCount();
    }
}
