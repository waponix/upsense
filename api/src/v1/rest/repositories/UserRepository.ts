import {User as User} from "../../shared/entities/User";
import {BaseRepository, QueryOptions} from "../../shared/repositories/BaseRepository";
import {paginationConfig} from "../../../config";
import {AdminRole} from "../../../components/types/AdminRoleTypes";

export class UserRepository extends BaseRepository
{
    private searchFields: string[] = [
        'id',
        'username',
        'firstName',
        'lastName',
        'email',
        'mobileNumber'
    ];

    /**
     * Get manager list
     * @param options
     */
    async getList (options: QueryOptions = {}): Promise<User[]> {
        let parameters: any = {
            role: AdminRole.manager
        };
        let whereStatements = [
            'manager.role = :role'
        ];

        const offset = options.page ? paginationConfig.limit * (options.page - 1) : 0;

        const query = await this
            .createQueryBuilder('manager')
            .select('manager.id')
            .addSelect('manager.username')
            .addSelect('manager.firstName')
            .addSelect('manager.lastName')
            .addSelect('manager.email')
            .addSelect('manager.mobileNumber')
            .addSelect('manager.picture')
            .addSelect('manager.createdAt')
            .addSelect('manager.updatedAt')
            .offset(offset)
            .limit(paginationConfig.limit);

        // create filters if provided
        if (options.filters !== undefined) {
            for (const [field, value] of Object.entries(options.filters)) {
                whereStatements.push(`user.${field} = :${field}`);
                parameters[field] = value;
            }
        }

        // add sort and
        if (options.sort !== undefined) {
            for (const [field, value] of Object.entries(options.sort)) {
                query.addOrderBy(`user.${field}`, value)
            }
        }

        // create search statement if find is provided
        if (options.find !== undefined) {
            parameters.find = `%${options.find}%`;
            let searchStatement = [];

            for (const field of this.searchFields) {
                searchStatement.push(`user.${field} LIKE :find`);
            }

            whereStatements.push(`(${searchStatement.join(' OR ')})`);
        }

        query
            .where(whereStatements.join(' AND '))
            .setParameters(parameters);

        return await query.getMany();
    }

    /**
     * Get single user by id
     * @param id
     */
    async findOneById (id: number): Promise<User | undefined> {
        return await this.repository.findOne({where: { id }});
    }

    async findOneByUsername (username: string): Promise<User | undefined> {
        return await this.repository.findOne({where: { username }});
    }

    async findOneByEmail (email: string): Promise<User | undefined> {
        return await this.repository.findOne({where: { email }});
    }

    /**
     * Create user
     * @param data
     */
    async create (data: any): Promise<User> {
        const repository = await this.repository;
        let user: User = new User();
        user.username = data.username;
        user.password = data.password;
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.email = data.email;
        user.mobileNumber = data.mobileNumber;
        user.picture = data.picture;
        user.role = AdminRole.user;
        await repository.save(user);
        return user;
    }

    /**
     * Update user
     * @param user
     * @param data
     */
    async update (user: User, data: Partial<User>): Promise<boolean> {
        if (!!data.password) {
            user.password = data.password;
            user.hashPassword()
        }
        user.firstName = data.firstName || user.firstName;
        user.lastName = data.lastName || user.lastName;
        user.email = data.email || user.email;
        user.picture = data.picture || user.picture;
        user.mobileNumber = data.mobileNumber || user.mobileNumber;
        await this.repository.save(user);
        return true;
    }

    /**
     * Delete user
     * @param user
     */
    async delete (user: User): Promise<boolean> {
        await this.repository.remove(user);
        return true;
    }
}

