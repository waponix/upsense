import {User} from "../../shared/entities/User";
import {BaseRepository, QueryOptions} from "../../shared/repositories/BaseRepository";
import {paginationConfig} from "../../../config";
import {UserRole} from "../../../components/types/UserRoleTypes";
import {NotificationSetting} from "../../shared/entities/NotificationSetting";

export class UserRepository extends BaseRepository
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
     * Get user list
     * @param options
     */
    async getList(options: QueryOptions = {}): Promise<User[]> {
        let parameters: any = {
            role: UserRole.user
        };
        let whereStatements = [
            'u.role = :role'
        ];

        const offset = options.page ? paginationConfig.limit * (options.page - 1) : 0;

        const query = await this
            .createQueryBuilder('u')
            .select([
                'u.id',
                'u.username',
                'u.firstName',
                'u.lastName',
                'u.email',
                'u.mobile',
                'u.image',
                'u.createdAt',
                'u.updatedAt'
            ])
            .offset(offset)
            .limit(paginationConfig.limit);

        // create filters if provided
        if (options.filters !== undefined) {
            for (const [field, value] of Object.entries(options.filters)) {
                whereStatements.push(`u.${field} = :${field}`);
                parameters[field] = value;
            }
        }

        // add sort and
        if (options.sort !== undefined) {
            for (const [field, value] of Object.entries(options.sort)) {
                query.addOrderBy(`u.${field}`, value)
            }
        }

        // create search statement if find is provided
        if (options.find !== undefined) {
            parameters.find = `%${options.find}%`;
            let searchStatement = [];

            for (const field of this.searchFields) {
                searchStatement.push(`u.${field} LIKE :find`);
            }

            whereStatements.push(`(${searchStatement.join(' OR ')})`);
        }

        do {
            if (options.relations === undefined) {
                break;
            }

            if (options.relations.indexOf('company') > -1) {
                query
                    .leftJoinAndSelect('u.company', 'c');
            }

            if (options.relations.indexOf('zones') > -1) {
                query.leftJoinAndSelect('u.zones', 'z');
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
     * @param relation
     */
    async findOneById(id: number, relation: any = []): Promise<User | undefined> {
        return await this.repository.findOne({where: { id, role: UserRole.user }, relations: ['company', 'zones']});
    }

    async findOneByUsername(username: string): Promise<User | undefined> {
        return await this.repository.findOne({where: { username, role: UserRole.user }});
    }

    async findOneBy(options: any, relations: any = null): Promise<User | undefined>
    {
        options = {where: options};
        if (relations !== null) {
            options.relations = relations;
        }
        return await this.repository.findOne(options);
    }

    async findOneByEmail(email: string): Promise<User | undefined> {
        return await this.repository.findOne({where: { email, role: UserRole.user }});
    }

    /**
     * Create user
     * @param data
     */
    async create(data: any): Promise<User> {
        let user: User = new User();
        user.username = data.username;
        user.password = data.password;
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.email = data.email;
        user.mobile = data.mobile;
        user.image = data.image;
        user.role = UserRole.user;
        user.company = data.company;

        if (data.zones) {
            // assign the zones to the user
            user.zones = data.zones;
        }

        let notificationSetting: NotificationSetting = new NotificationSetting();
        notificationSetting.user = user;

        user.notificationSetting = notificationSetting;

        await this.repository.save(user);

        await this.em.getRepository(NotificationSetting).save(notificationSetting);
        return user;
    }

    /**
     * Update user
     * @param user
     * @param data
     */
    async update(user: User, data: Partial<User>): Promise<boolean> {
        if (!!data.password) {
            user.password = data.password;
            user.hashPassword()
        }
        user.firstName = data.firstName || user.firstName;
        user.lastName = data.lastName || user.lastName;
        user.email = data.email || user.email;
        user.image = data.image || user.image;
        user.mobile = data.mobile || user.mobile;

        await this.repository.save(user);

        const relationQueryBuilder = this.repository
            .createQueryBuilder()
            .relation(User, 'zones');

        //@ts-ignore
        if (data.removeZones) {
            //@ts-ignore
            await relationQueryBuilder.of(user).remove(data.removeZones);
        }

        //@ts-ignore
        if (data.addZones) {
            //@ts-ignore
            await relationQueryBuilder.of(user).add(data.addZones);
        }

        return true;
    }

    /**
     * Delete user
     * @param user
     */
    async delete(user: User): Promise<boolean> {
        await this.repository.remove(user);
        return true;
    }
}

