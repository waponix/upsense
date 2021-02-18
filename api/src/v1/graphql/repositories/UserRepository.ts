import {Admin} from "../../shared/entities/Admin";
import {BaseRepository, QueryOptions} from "../../shared/repositories/BaseRepository";
import {paginationConfig} from "../../../config";
import {AdminRole} from "../../../components/types/AdminRoleTypes";
import {CreateUserInput, UpdateUserInput} from "../resolverInputs/UserDataInput";

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
     * Get user list
     * @param options
     */
    async getList (options: QueryOptions = {}) {
        let parameters: any = {
            role: AdminRole.user
        };
        let whereStatements = [
            'admin.role = :role'
        ];

        const query = await this.em
            .getRepository(Admin)
            .createQueryBuilder('admin')
            .select('admin.id')
            .addSelect('admin.username')
            .addSelect('admin.firstName')
            .addSelect('admin.lastName')
            .addSelect('admin.email')
            .addSelect('admin.mobileNumber')
            .addSelect('admin.picture')
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
        return await this.em.getRepository(Admin).findOne({where: { id }});
    }

    async findOneByUsername (username: string) {
        return await this.em.getRepository(Admin).findOne({where: { username }});
    }

    async findOneByEmail (email: string) {
        return await this.em.getRepository(Admin).findOne({where: { email }});
    }

    /**
     * Create user
     * @param data
     */
    async create (data: CreateUserInput) {
        const repository = await this.em.getRepository(Admin);
        let user: Admin = new Admin();
        user.username = data.username;
        user.password = data.password;
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.email = data.email;
        user.mobileNumber = data.mobileNumber;
        user.picture = data.picture;
        user.role = AdminRole.manager;
        await repository.save(user);
        return user;
    }

    /**
     * Update user
     * @param user
     * @param data
     */
    async update (user: Admin, data: UpdateUserInput) {
        if (!!data.password) {
            user.password = data.password;
            user.hashPassword()
        }
        user.firstName = data.firstName || user.firstName;
        user.lastName = data.lastName || user.lastName;
        user.email = data.email || user.email;
        user.picture = data.picture || user.picture;
        user.mobileNumber = data.mobileNumber || user.mobileNumber;
        await this.em.getRepository(Admin).save(user);
        return true;
    }

    /**
     * Delete user
     * @param user
     */
    async delete (user: Admin) {
        await this.em.getRepository(Admin).remove(user);
        return true;
    }
}

