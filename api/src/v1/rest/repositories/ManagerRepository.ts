import {User as Manager} from "../../shared/entities/User";
import {BaseRepository, QueryOptions} from "../../shared/repositories/BaseRepository";
import {miscConfig, paginationConfig} from "../../../config";
import {UserRole} from "../../../components/types/UserRoleTypes";
import {NotificationSetting} from "../../shared/entities/NotificationSetting";

export class ManagerRepository extends BaseRepository
{
    private searchFields: string[] = [
        'id',
        'username',
        'firstName',
        'lastName',
        'email',
        'mobile'
    ];

    /**
     * Get manager list
     * @param options
     */
    async getList (options: QueryOptions = {}): Promise<any> {
        let parameters: any = {
            role: UserRole.manager
        };
        let whereStatements = [
            'm.role = :role'
        ];

        const offset = options.page ? paginationConfig.limit * (options.page - 1) : 0;

        const query = await this
            .createQueryBuilder('m')
            .select([
                'm.id',
                'm.username',
                'm.firstName',
                'm.lastName',
                'm.email',
                'm.mobile',
                'm.image',
                'm.createdAt',
                'm.updatedAt'
            ]);

        // create filters if provided
        if (!!options.filters) {
            for (const [field, value] of Object.entries(options.filters)) {
                whereStatements.push(`m.${field} = :${field}`);
                parameters[field] = value;
            }
        }

        // add sort and
        if (!!options.sort) {
            for (const [field, value] of Object.entries(options.sort)) {
                query.addOrderBy(`m.${field}`, value)
            }
        }

        // create search statement if find is provided
        if (!!options.find) {
            parameters.find = `%${options.find}%`;
            let searchStatement = [];

            for (const field of this.searchFields) {
                searchStatement.push(`m.${field} LIKE :find`);
            }

            whereStatements.push(`(${searchStatement.join(' OR ')})`);
        }

        do {
            if (options.relations === undefined) {
                break;
            }

            if (options.relations.indexOf('company') > -1) {
                query
                    .leftJoinAndSelect('m.company', 'c');
            }

            if (options.relations.indexOf('zones') > -1) {
                query.leftJoinAndSelect('m.zones', 'z');
                whereStatements.push('z.name != :defaultZone');
                parameters.defaultZone = miscConfig.defaultZone;
            }

            break;
        } while (true);

        query
            .where(whereStatements.join(' AND '))
            .setParameters(parameters);

        const totalCount = await this.getCount(query);

        query
            .offset(offset)
            .limit(paginationConfig.limit)

        const data =  await query.getManyAndCount();

        return {
            totalCount: totalCount,
            count: data[1],
            data: data[0]
        }
    }

    /**
     * Get single manager by id
     * @param id
     */
    async findOneById (id: number): Promise<Manager | undefined> {
        return await this.repository.findOne({where: { id, role: UserRole.manager }, relations: ['company', 'zones']});
    }

    async findOneBy(options: any, relations: any = null): Promise<Manager | undefined>
    {
        options = {where: options};
        if (relations !== null) {
            options.relations = relations;
        }
        return await this.repository.findOne(options);
    }

    async findOneByUsername (username: string): Promise<Manager | undefined> {
        return await this.repository.findOne({where: { username, role: UserRole.manager }});
    }

    async findOneByEmail (email: string): Promise<Manager | undefined> {
        return await this.repository.findOne({where: { email, role: UserRole.manager }});
    }

    /**
     * Create manager
     * @param data
     */
    async create (data: any): Promise<Manager> {
        const repository = await this.repository;
        let manager: Manager = new Manager();
        manager.username = data.username;
        manager.password = data.password;
        manager.firstName = data.firstName;
        manager.lastName = data.lastName;
        manager.email = data.email;
        manager.mobile = data.mobile;
        manager.image = data.image;
        manager.role = UserRole.manager;
        manager.company = data.company;

        if (data.zones) {
            // assign the zones to the user
            manager.zones = data.zones;
        }

        let notificationSetting: NotificationSetting = new NotificationSetting();
        notificationSetting.user = manager;

        manager.notificationSetting = notificationSetting;

        await this.repository.save(manager);

        await this.em.getRepository(NotificationSetting).save(notificationSetting);

        return manager;
    }

    /**
     * Update manager
     * @param manager
     * @param data
     */
    async update (manager: Manager, data: Partial<Manager>): Promise<boolean> {
        if (!!data.password) {
            manager.password = data.password;
            manager.hashPassword()
        }
        manager.firstName = data.firstName || manager.firstName;
        manager.lastName = data.lastName || manager.lastName;
        manager.email = data.email || manager.email;
        manager.image = data.image || manager.image;
        manager.mobile = data.mobile || manager.mobile;

        await this.repository.save(manager);

        const relationQueryBuilder = this.repository
            .createQueryBuilder()
            .relation(Manager, 'zones');

        console.log(data);

        //@ts-ignore
        if (data.removeZones) {
            //@ts-ignore
            await relationQueryBuilder.of(manager).remove(data.removeZones);
        }

        //@ts-ignore
        if (data.addZones) {
            //@ts-ignore
            await relationQueryBuilder.of(manager).add(data.addZones);
        }

        return true;
    }

    /**
     * Delete manager
     * @param manager
     */
    async delete (manager: Manager): Promise<boolean> {
        await this.repository.remove(manager);
        return true;
    }

    private async getCount(query: any): Promise<number>
    {
        let queryClone = Object.create(query);

        return await queryClone.getCount();
    }
}
