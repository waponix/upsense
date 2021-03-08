import {User} from "../../shared/entities/User";
import {BaseRepository, QueryOptions} from "../../shared/repositories/BaseRepository";
import {paginationConfig} from "../../../config";
import {AdminRole} from "../../../components/types/AdminRoleTypes";
import {CreateManagerInput, UpdateManagerInput} from "../resolverInputs/ManagerDataInput";

export class ManagerRepository extends BaseRepository
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
    async getList (options: QueryOptions = {}) {
        let parameters: any = {
            role: AdminRole.manager
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
     * Get single manager by id
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
     * Create manager
     * @param data
     */
    async create (data: CreateManagerInput) {
        const repository = await this.em.getRepository(User);
        let manager: User = new User();
        manager.username = data.username;
        manager.password = data.password;
        manager.firstName = data.firstName;
        manager.lastName = data.lastName;
        manager.email = data.email;
        manager.mobileNumber = data.mobileNumber;
        manager.picture = data.picture;
        manager.role = AdminRole.manager;
        await repository.save(manager);
        return manager;
    }

    /**
     * Update manager
     * @param manager
     * @param data
     */
    async update (manager: User, data: UpdateManagerInput) {
        if (!!data.password) {
            manager.password = data.password;
            manager.hashPassword()
        }
        manager.firstName = data.firstName || manager.firstName;
        manager.lastName = data.lastName || manager.lastName;
        manager.email = data.email || manager.email;
        manager.picture = data.picture || manager.picture;
        manager.mobileNumber = data.mobileNumber || manager.mobileNumber;
        await this.em.getRepository(User).save(manager);
        return true;
    }

    /**
     * Delete manager
     * @param manager
     */
    async delete (manager: User) {
        await this.em.getRepository(User).remove(manager);
        return true;
    }
}

