import {Admin as Manager} from "../../shared/entities/Admin";
import {BaseRepository, QueryOptions} from "../../shared/repositories/BaseRepository";
import {paginationConfig} from "../../../config";
import {AdminRole} from "../../../components/types/AdminRoleTypes";

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
    async getList (options: QueryOptions = {}): Promise<Manager[]> {
        let parameters: any = {
            role: AdminRole.manager
        };
        let whereStatements = [
            'manager.role = :role'
        ];

        const offset = options.page ? paginationConfig.limit * (options.page - 1) : 0;

        const query = await this.em
            .getRepository(Manager)
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
                whereStatements.push(`manager.${field} = :${field}`);
                parameters[field] = value;
            }
        }

        // add sort and
        if (options.sort !== undefined) {
            for (const [field, value] of Object.entries(options.sort)) {
                query.addOrderBy(`manager.${field}`, value)
            }
        }

        // create search statement if find is provided
        if (options.find !== undefined) {
            parameters.find = `%${options.find}%`;
            let searchStatement = [];

            for (const field of this.searchFields) {
                searchStatement.push(`manager.${field} LIKE :find`);
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
    async findOneById (id: number): Promise<Manager | undefined> {
        return await this.em.getRepository(Manager).findOne({where: { id }});
    }

    async findOneByUsername (username: string): Promise<Manager | undefined> {
        return await this.em.getRepository(Manager).findOne({where: { username }});
    }

    async findOneByEmail (email: string): Promise<Manager | undefined> {
        return await this.em.getRepository(Manager).findOne({where: { email }});
    }

    /**
     * Create manager
     * @param data
     */
    async create (data: any): Promise<Manager> {
        const repository = await this.em.getRepository(Manager);
        let manager: Manager = new Manager();
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
    async update (manager: Manager, data: Partial<Manager>): Promise<boolean> {
        if (!!data.password) {
            manager.password = data.password;
            manager.hashPassword()
        }
        manager.firstName = data.firstName || manager.firstName;
        manager.lastName = data.lastName || manager.lastName;
        manager.email = data.email || manager.email;
        manager.picture = data.picture || manager.picture;
        manager.mobileNumber = data.mobileNumber || manager.mobileNumber;
        await this.em.getRepository(Manager).save(manager);
        return true;
    }

    /**
     * Delete manager
     * @param manager
     */
    async delete (manager: Manager): Promise<boolean> {
        await this.em.getRepository(Manager).remove(manager);
        return true;
    }
}

