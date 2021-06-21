import {BaseRepository} from "../../shared/repositories/BaseRepository";
import {NotificationLog} from "../../shared/entities/NotificationLog";
import {User} from "../../shared/entities/User";
import {UserRole} from "../../../components/types/UserRoleTypes";

export class NotificationLogRepository extends BaseRepository
{
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
                .where('u.id = :userId')
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

    async save(notificationLog: NotificationLog) {
        await this.repository.save(notificationLog);
    }
}
