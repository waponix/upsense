import {BaseRepository, QueryOptions} from "../../shared/repositories/BaseRepository";
import {paginationConfig} from "../../../config";
import {NotificationSetting} from "../../shared/entities/NotificationSetting";

export class NotificationSettingRepository extends BaseRepository
{
    private searchFields: string[] = [
        'id',
        'type',
        'triggerTime',
        'lastName',
        'email',
        'mobile'
    ];

    /**
     * Get user list
     * @param options
     */
    async getList(options: QueryOptions = {}): Promise<NotificationSetting[]> {
        let parameters: any = {};
        let whereStatements = [];

        const offset = options.page ? paginationConfig.limit * (options.page - 1) : 0;

        const query = await this
            .createQueryBuilder('ns')
            .select([
                'ns.type',
                'ns.triggerTime',
                'ns.repeatTime',
                'ns.maxRepeat',
            ])
            .offset(offset)
            .limit(paginationConfig.limit);

        // create filters if provided
        if (options.filters !== undefined) {
            for (const [field, value] of Object.entries(options.filters)) {
                whereStatements.push(`ns.${field} = :${field}`);
                parameters[field] = value;
            }
        }

        // add sort and
        if (options.sort !== undefined) {
            for (const [field, value] of Object.entries(options.sort)) {
                query.addOrderBy(`ns.${field}`, value)
            }
        }

        // create search statement if find is provided
        if (options.find !== undefined) {
            parameters.find = `%${options.find}%`;
            let searchStatement = [];

            for (const field of this.searchFields) {
                searchStatement.push(`ns.${field} LIKE :find`);
            }

            whereStatements.push(`(${searchStatement.join(' OR ')})`);
        }

        do {
            if (options.relations === undefined) {
                break;
            }

            if (options.relations.indexOf('zone') > -1) {
                query.leftJoinAndSelect('ns.zone', 'z');
            }

            break;
        } while (true);

        query
            .where(whereStatements.join(' AND '))
            .setParameters(parameters);

        return await query.getMany();
    }

    /**
     * Get single user by id
     * @param id
     */
    async findOneById(id: number): Promise<NotificationSetting | undefined> {
        return await this.repository.findOne({where: { id }, relations: ['zone']});
    }

    /**
     * Create notification setting
     * @param data
     */
    async create(data: any): Promise<NotificationSetting> {
        let notificationSetting: NotificationSetting = new NotificationSetting();
        notificationSetting.type = data.type;
        notificationSetting.triggerTime = data.triggerTime;
        notificationSetting.repeatTime = data.repeatTime;
        notificationSetting.maxRepeat = data.maxRepeat;

        if (data.zone) {
            // assign the zones to the notificationSetting
            notificationSetting.zone = data.zone;
        }

        await this.repository.save(notificationSetting);
        return notificationSetting;
    }

    /**
     * Update notification setting
     * @param notificationSetting
     * @param data
     */
    async update(notificationSetting: NotificationSetting, data: Partial<NotificationSetting>): Promise<boolean> {
        notificationSetting.type = data.type || notificationSetting.type;
        notificationSetting.triggerTime = data.triggerTime || notificationSetting.triggerTime;
        notificationSetting.repeatTime = data.repeatTime || notificationSetting.repeatTime;
        notificationSetting.maxRepeat = data.maxRepeat || notificationSetting.maxRepeat;

        await this.repository.save(notificationSetting);

        // const relationQueryBuilder = this.repository
        //     .createQueryBuilder()
        //     .relation(User, 'zones');

        // //@ts-ignore
        // if (data.removeZone) {
        //     //@ts-ignore
        //     await relationQueryBuilder.of(notificationSetting).remove(data.removeZones);
        // }
        //
        // //@ts-ignore
        // if (data.addZones) {
        //     //@ts-ignore
        //     await relationQueryBuilder.of(notificationSetting).add(data.addZones);
        // }

        return true;
    }

    /**
     * Delete notification setting
     * @param notificationSetting
     */
    async delete(notificationSetting: NotificationSetting): Promise<boolean> {
        await this.repository.remove(notificationSetting);
        return true;
    }
}

