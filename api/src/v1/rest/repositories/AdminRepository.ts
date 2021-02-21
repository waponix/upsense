import {Admin} from "../../shared/entities/Admin";
import {BaseRepository, QueryOptions} from "../../shared/repositories/BaseRepository";
import {paginationConfig} from "../../../config";
import {AdminRole} from "../../../components/types/AdminRoleTypes";

export class AdminRepository extends BaseRepository
{
    private searchableFields: string[] = [
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
    async getList (options: QueryOptions = {}): Promise<Admin[]> {
        let parameters: any = {
            role: AdminRole.admin
        };
        let whereStatements = [
            'admin.role = :role'
        ];

        const offset = options.page ? paginationConfig.limit * (options.page - 1) : 0;

        const query = await this
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
            .offset(offset)
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

            for (const field of this.searchableFields) {
                searchStatement.push(`admin.${field} LIKE :find`);
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
        return await this.repository.findOne({where: { id }});
    }

    async findOneByUsername (username: string): Promise<Admin | undefined> {
        return await this.repository.findOne({where: { username }});
    }

    async findOneByEmail (email: string): Promise<Admin | undefined> {
        return await this.repository.findOne({where: { email }});
    }

    /**
     * Create admin
     * @param data
     */
    async create (data: any): Promise<Admin> {
        let admin: Admin = new Admin();
        admin.username = data.username;
        admin.password = data.password;
        admin.firstName = data.firstName;
        admin.lastName = data.lastName;
        admin.email = data.email;
        admin.mobileNumber = data.mobileNumber;
        admin.picture = data.picture;
        admin.role = AdminRole.admin;
        await this.repository.save(admin);
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
        await this.repository.save(admin);
        return true;
    }

    /**
     * Delete admin
     * @param admin
     */
    async delete (admin: Admin): Promise<boolean> {
        await this.repository.remove(admin);
        return true;
    }
}

