import {User} from "../../shared/entities/User";
import {BaseRepository, QueryOptions} from "../../shared/repositories/BaseRepository";
import {paginationConfig} from "../../../config";
import {UserRole} from "../../../components/types/UserRoleTypes";
import {CreateUserInput, UpdateUserInput} from "../resolverInputs/UserDataInput";

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
    async getList (options: QueryOptions = {}) {
        let parameters: any = {
            role: UserRole.user
        };
        let whereStatements = [
            'admin.role = :role'
        ];

        const query = await this.em
            .getRepository(User)
            .createQueryBuilder('admin')
            .select('admin.id')
            .addSelect('admin.username')
            .addSelect('admin.firstName')
            .addSelect('admin.lastName')
            .addSelect('admin.email')
            .addSelect('admin.mobile')
            .addSelect('admin.image')
            .addSelect('admin.createdAt')
            .addSelect('admin.updatedAt')
            .offset(options.page)
            .limit(paginationConfig.limit);

        // create filters if provided
        if (options.filters !== undefined) {
            for (const [field, value] of Object.entries(options.filters)) {
                whereStatements.push(`admin.${field} = :${field}`);
                parameters[field] = value;
            }
        }

        // add sort and
        if (options.sort !== undefined) {
            for (const [field, value] of Object.entries(options.sort)) {
                query.addOrderBy(`admin.${field}`, value)
            }
        }

        // create search statment if find is provided
        if (options.find !== undefined) {
            parameters.find = `%${options.find}%`;
            let searchStatement = [];

            for (const field of this.searchFields) {
                searchStatement.push(`a.${field} LIKE :find`);
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
    async findOneById (id: number) {
        return await this.em.getRepository(User).findOne({where: { id }});
    }

    async findOneByUsername (username: string) {
        return await this.em.getRepository(User).findOne({where: { username }});
    }

    async findOneByEmail (email: string) {
        return await this.em.getRepository(User).findOne({where: { email }});
    }

    /**
     * Create user
     * @param data
     */
    async create (data: CreateUserInput) {
        const repository = await this.em.getRepository(User);
        let user: User = new User();
        user.username = data.username;
        user.password = data.password;
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.email = data.email;
        user.mobile = data.mobile;
        user.image = data.image;
        user.role = UserRole.manager;
        await repository.save(user);
        return user;
    }

    /**
     * Update user
     * @param user
     * @param data
     */
    async update (user: User, data: UpdateUserInput) {
        if (!!data.password) {
            user.password = data.password;
            user.hashPassword()
        }
        user.firstName = data.firstName || user.firstName;
        user.lastName = data.lastName || user.lastName;
        user.email = data.email || user.email;
        user.image = data.image || user.image;
        user.mobile = data.mobile || user.mobile;
        await this.em.getRepository(User).save(user);
        return true;
    }

    /**
     * Delete user
     * @param user
     */
    async delete (user: User) {
        await this.em.getRepository(User).remove(user);
        return true;
    }
}

