import {User as Admin} from "../../shared/entities/User";
import {BaseRepository, QueryOptions} from "../../shared/repositories/BaseRepository";
import {paginationConfig} from "../../../config";
import {UserRole} from "../../../components/types/UserRoleTypes";

export class AdminRepository extends BaseRepository
{
    private searchableFields: string[] = [
        'id',
        'username',
        'firstName',
        'lastName',
        'email',
        'mobile'
    ];

    /**
     * Get admin list
     * @param options
     */
    async getList (options: QueryOptions = {}): Promise<any> {
        let parameters: any = {
            role: UserRole.admin,
        };
        let whereStatements = [
            'a.role = :role',
            'a.id != 1'
        ];

        const offset = options.page ? paginationConfig.limit * (options.page - 1) : 0;

        const query = await this
            .createQueryBuilder('a')
            .select([
                'a.id',
                'a.username',
                'a.firstName',
                'a.lastName',
                'a.email',
                'a.mobile',
                'a.image',
                'a.createdAt',
                'a.updatedAt'
            ]);

        // create filters if provided
        if (!!options.filters) {
            for (const [field, value] of Object.entries(options.filters)) {
                whereStatements.push(`a.${field} = :${field}`);
                parameters[field] = value;
            }
        }

        // add sort and
        if (!!options.sort) {
            for (const [field, value] of Object.entries(options.sort)) {
                query.addOrderBy(`a.${field}`, value)
            }
        }

        // create search statement if find is provided
        if (!!options.find) {
            parameters.find = `%${options.find}%`;
            let searchStatement = [];

            for (const field of this.searchableFields) {
                searchStatement.push(`a.${field} LIKE :find`);
            }

            whereStatements.push(`(${searchStatement.join(' OR ')})`);
        }

        query
            .where(whereStatements.join(' AND '))
            .setParameters(parameters);

        const totalCount: number = await this.getCount(query);

        query
            .offset(offset)
            .limit(paginationConfig.limit);

        const data = await query.getMany();

        return {
            totalCount: totalCount,
            count: data.length,
            data: data
        };
    }

    /**
     * Get single admin by id
     * @param id
     */
    async findOneById (id: number): Promise<Admin | undefined> {
        return await this.repository.findOne({where: { id, role: UserRole.admin }});
    }

    async findOneByUsername (username: string): Promise<Admin | undefined> {
        return await this.repository.findOne({where: { username, role: UserRole.admin }});
    }

    async findOneByEmail (email: string): Promise<Admin | undefined> {
        return await this.repository.findOne({where: { email, role: UserRole.admin }});
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
        admin.mobile = data.mobile;
        admin.image = data.image;
        admin.role = UserRole.admin;
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
        admin.image = data.image || admin.image;
        admin.mobile = data.mobile || admin.mobile;
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

    private async getCount(query: any): Promise<number>
    {
        let queryClone = Object.create(query);

        return await queryClone.getCount();
    }
}

