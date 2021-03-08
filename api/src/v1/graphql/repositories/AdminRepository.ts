import {User} from "../../shared/entities/User";
import {BaseRepository, QueryOptions} from "../../shared/repositories/BaseRepository";
import {paginationConfig} from "../../../config";
import {AdminRole} from "../../../components/types/AdminRoleTypes";
import {CreateAdminInput, UpdateAdminInput} from "../resolverInputs/AdminDataInput";

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
    async getList (options: QueryOptions = {}) {
        let parameters: any = {
            role: AdminRole.admin
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
     * Get single admin by id
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
     * Create admin
     * @param data
     */
    async create (data: CreateAdminInput) {
        const repository = await this.em.getRepository(User);
        let admin: User = new User();
        admin.username = data.username;
        admin.password = data.password;
        admin.firstName = data.firstName;
        admin.lastName = data.lastName;
        admin.email = data.email;
        admin.mobileNumber = data.mobileNumber;
        admin.picture = data.picture;
        admin.role = AdminRole.admin
        await repository.save(admin);
        return admin;
    }

    /**
     * Update admin
     * @param admin
     * @param data
     */
    async update (admin: User, data: UpdateAdminInput) {
        if (!!data.password) {
            admin.password = data.password;
            admin.hashPassword()
        }
        admin.firstName = data.firstName || admin.firstName;
        admin.lastName = data.lastName || admin.lastName;
        admin.email = data.email || admin.email;
        admin.picture = data.picture || admin.picture;
        admin.mobileNumber = data.mobileNumber || admin.mobileNumber;
        await this.em.getRepository(User).save(admin);
        return true;
    }

    /**
     * Delete admin
     * @param admin
     */
    async delete (admin: User) {
        await this.em.getRepository(User).remove(admin);
        return true;
    }
}

