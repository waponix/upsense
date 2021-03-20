import {User as Manager} from "../../shared/entities/User";
import {BaseRepository, QueryOptions} from "../../shared/repositories/BaseRepository";
import {paginationConfig} from "../../../config";
import {UserRole} from "../../../components/types/UserRoleTypes";

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
    async getList (options: QueryOptions = {}): Promise<Manager[]> {
        let parameters: any = {
            role: UserRole.manager
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
            .addSelect('manager.mobile')
            .addSelect('manager.image')
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
        return await this.repository.findOne({where: { id, role: UserRole.manager }});
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
        manager.image = data.image || manager.image;
        manager.mobile = data.mobile || manager.mobile;
        await this.repository.save(manager);
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
}

