import {getConnection, Repository} from "typeorm";
import {Admin} from "../entities/Admin";
import {AdminFilterInput} from "../resolverInputs/AdminDataInput";
import {BaseRepository, ListOptions} from "./BaseRepository";
import {paginationConfig} from "../../config";

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

    getAdminList = async (options: ListOptions = {}) =>  {
        let parameters: any = {};
        let whereStatements = [];

        const query = await getConnection()
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
            .limit(paginationConfig.limit);

        // create filters if provided
        if (options.filters !== undefined) {
            for (const [field, value] of Object.entries(options.filters)) {
                whereStatements.push(`admin.${field} = :${field}`);
                parameters[field] = value;
            }

            query.where(whereStatements.join(' AND '));
        }

        // add sort and
        if (options.sort !== undefined) {
            for (const [field, value] of Object.entries(options.sort)) {
                query.addOrderBy(`admin.${field}`, value)
            }
        }

        // create search statment if query is provided
        if (options.query !== undefined) {
            parameters.query = `%${options.query}%`;
            let searchStatement = [];

            for (const field of this.searchFields) {
                searchStatement.push(`a.${field} LIKE :query`);
            }

            whereStatements.push(`(${searchStatement.join(' OR ')})`);
        }

        query.setParameters(parameters);

        return await query.getMany();
    }
}

