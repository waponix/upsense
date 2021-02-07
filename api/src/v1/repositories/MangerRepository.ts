import {Admin} from "../entities/Admin";
import {BaseRepository, ListOptions} from "./BaseRepository";
import {paginationConfig} from "../../config";
import {AdminRole} from "../../components/types/AdminRoleTypes";
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
     * Get the admin list
     * @param options
     */
    async getList (options: ListOptions = {}) {
        let parameters: any = {
            role: AdminRole.manager
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
     * Get single admin by id
     * @param id
     */
    async findOneById (id: number) {
        return await this.manager.getRepository(Admin).findOne({where: { id }});
    }

    async findOneByUsername (username: string) {
        return await this.manager.getRepository(Admin).findOne({where: { username }});
    }

    async findOneByEmail (email: string) {
        return await this.manager.getRepository(Admin).findOne({where: { email }});
    }

    async create (data: CreateManagerInput) {
        const repository = await this.manager.getRepository(Admin);
        let admin: Admin = new Admin();
        admin.username = data.username;
        admin.password = data.password;
        admin.firstName = data.firstName;
        admin.lastName = data.lastName;
        admin.email = data.email;
        admin.mobileNumber = data.mobileNumber;
        admin.picture = data.picture;
        admin.role = AdminRole.manager;
        await repository.save(admin);
        return admin;
    }

    /**
     * Update the admin
     * @param admin
     * @param data
     */
    async update (admin: Admin, data: UpdateManagerInput) {
        admin.firstName = data.firstName || admin.firstName;
        admin.lastName = data.lastName || admin.lastName;
        admin.email = data.email || admin.email;
        admin.picture = data.picture || admin.picture;
        admin.mobileNumber = data.mobileNumber || admin.mobileNumber;
        await this.manager.getRepository(Admin).save(admin);
        return true;
    }

    async delete (admin: Admin) {
        await this.manager.getRepository(Admin).remove(admin);
        return true;
    }
}

