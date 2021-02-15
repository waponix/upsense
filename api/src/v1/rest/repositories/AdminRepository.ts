import {Admin} from "../../shared/entities/Admin";
import {BaseRepository, ListOptions} from "../../shared/repositories/BaseRepository";
import {paginationConfig} from "../../../config";
import {AdminRole} from "../../../components/types/AdminRoleTypes";

export class AdminRepository extends BaseRepository
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
     * Get admin list
     * @param options
     */
    async getList (options: ListOptions = {}): Promise<Admin[]> {
        let parameters: any = {
            role: AdminRole.admin
        };
        let whereStatements = [
            'admin.role = :role'
        ];

        const query = await this.manager
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

        // create search statement if find is provided
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
     * Get single admin by id
     * @param id
     */
    async findOneById (id: number): Promise<Admin | undefined> {
        return await this.manager.getRepository(Admin).findOne({where: { id }});
    }

    async findOneByUsername (username: string): Promise<Admin | undefined> {
        return await this.manager.getRepository(Admin).findOne({where: { username }});
    }

    async findOneByEmail (email: string): Promise<Admin | undefined> {
        return await this.manager.getRepository(Admin).findOne({where: { email }});
    }

    /**
     * Create admin
     * @param data
     */
    async create (data: any): Promise<Admin> {
        const repository = await this.manager.getRepository(Admin);
        let admin: Admin = new Admin();
        admin.username = data.username;
        admin.password = data.password;
        admin.firstName = data.firstName;
        admin.lastName = data.lastName;
        admin.email = data.email;
        admin.mobileNumber = data.mobileNumber;
        admin.picture = data.picture;
        admin.role = AdminRole.admin;
        await repository.save(admin);
        return admin;
    }

    /**
     * Update admin
     * @param admin
     * @param data
     */
    async update (admin: Admin, data: Partial<Admin>): Promise<boolean> {
        if (!!data.password) {
            admin.password = data.password;
            admin.hashPassword()
        }
        admin.firstName = data.firstName || admin.firstName;
        admin.lastName = data.lastName || admin.lastName;
        admin.email = data.email || admin.email;
        admin.picture = data.picture || admin.picture;
        admin.mobileNumber = data.mobileNumber || admin.mobileNumber;
        await this.manager.getRepository(Admin).save(admin);
        return true;
    }

    /**
     * Delete admin
     * @param admin
     */
    async delete (admin: Admin): Promise<boolean> {
        await this.manager.getRepository(Admin).remove(admin);
        return true;
    }
}

