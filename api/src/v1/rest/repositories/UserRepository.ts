import {User} from "../../shared/entities/User";
import {BaseRepository, QueryOptions} from "../../shared/repositories/BaseRepository";
import {paginationConfig} from "../../../config";
import {UserRole} from "../../../components/types/UserRoleTypes";
import {NotificationSetting} from "../../shared/entities/NotificationSetting";
import {Company} from "../../shared/entities/Company";
import {CompanyRepository} from "./CompanyRepository";
import {Repository} from "typeorm";

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
     * @param user
     */
    async getList(options: QueryOptions = {}, apiUser: any): Promise<User[]> {
        let parameters: any = {
            role: UserRole.user
        };
        let whereStatements = [
            'u.role = :role'
        ];

        const offset = options.page ? paginationConfig.limit * (options.page - 1) : 0;

        const mainQuery = await this
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

        if (apiUser.role && apiUser.role === UserRole.manager) {
            const companyRepository: Repository<Company> = this.em.getRepository(Company);
            const company: Company | undefined = await companyRepository
                .createQueryBuilder('c')
                .innerJoin('c.users', 'u')
                .where('u.id = :userId')
                .setParameter('userId', apiUser.id)
                .getOne();

            mainQuery.innerJoin('u.company', 'cmp');

            whereStatements.push('cmp.id = :companyId');
            parameters.companyId = company?.id;
        }

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
                mainQuery.addOrderBy(`u.${field}`, value)
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
                mainQuery
                    .leftJoinAndSelect('u.company', 'c');
            }

            if (options.relations.indexOf('zones') > -1) {
                mainQuery.leftJoinAndSelect('u.zones', 'z');
            }

            break;
        } while (true);

        mainQuery
            .where(whereStatements.join(' AND '))
            .setParameters(parameters);

        return await mainQuery.getMany();
    }

    /**
     * Get single user by id
     * @param id
     * @param relation
     */
    async findOneById(id: number, relation: any = []): Promise<User | undefined> {
        return await this.repository.findOne({where: { id, role: UserRole.user }, relations: ['company', 'zones']});
    }

    async findOneByUser(id: number, apiUser: any): Promise<User | undefined> {
        let parameters: any = {id};

        const query = this
            .createQueryBuilder('u')
            .innerJoinAndSelect('u.company', 'c')
            .leftJoinAndSelect('u.zones', 'z')
            .where('u.id = :id');

        if (apiUser.role !== UserRole.admin) {
            const companyRepository: Repository<Company> = this.em.getRepository(Company);
            const company: Company | undefined = await companyRepository
                .createQueryBuilder('c')
                .innerJoin('c.users', 'u')
                .where('u.id = :userId')
                .setParameter('userId', apiUser.id)
                .getOne();

            query.andWhere('c.id = :companyId');

            parameters.companyId = company?.id;
        }

        query.setParameters(parameters);

        return query.getOne();
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

        // await this.repository
        //     .createQueryBuilder()
        //     .relation(Company, 'users')
        //     .of(user.company).add(user);
        //
        // await user.company.save();

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

