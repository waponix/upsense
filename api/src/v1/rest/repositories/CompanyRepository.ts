import {BaseRepository, QueryOptions} from "../../shared/repositories/BaseRepository";
import {Company} from "../../shared/entities/Company";
import {paginationConfig} from "../../../config";
import {User, User as Manager} from "../../shared/entities/User";

export class CompanyRepository extends BaseRepository
{
    private searchableFields: string[] = [
        'id',
        'name'
    ];

    /**
     *
     * @param options
     */
    async getList(options: QueryOptions = {}): Promise<Company[]> {
        let parameters: any = {};
        let whereStatements: any = [];

        const offset = options.page ? paginationConfig.limit * (options.page - 1) : 0;

        const query = await this
            .createQueryBuilder('c')
            .select([
                'c.id',
                'c.name',
                'c.updatedAt',
                'c.createdAt'
            ])
            .offset(offset)
            .limit(paginationConfig.limit);

        // create filters if provided
        if (options.filters !== undefined) {
            for (const [field, value] of Object.entries(options.filters)) {
                whereStatements.push(`c.${field} = :${field}`);
                parameters[field] = value;
            }
        }

        // add sort and
        if (options.sort !== undefined) {
            for (const [field, value] of Object.entries(options.sort)) {
                query.addOrderBy(`c.${field}`, value)
            }
        }

        // create search statement if find is provided
        if (options.find !== undefined) {
            parameters.find = `%${options.find}%`;
            let searchStatement = [];

            for (const field of this.searchableFields) {
                searchStatement.push(`c.${field} LIKE :find`);
            }

            whereStatements.push(`(${searchStatement.join(' OR ')})`);
        }

        do {
            if (options.relations === undefined) {
                break;
            }

            if (options.relations.indexOf('zones') > -1) {
                query.leftJoinAndSelect('c.zones', 'z');
            }

            break;
        } while (true);

        if (whereStatements.length > 0) {
            query
                .where(whereStatements.join(' AND '))
                .setParameters(parameters);
        }

        return await query.getMany();
    }

    /**
     *
     * @param id
     */
    async findOneById(id: number): Promise<Company | undefined>
    {
        return await this.em.getRepository(Company).findOne({where: { id }});
    }

    /**
     *
     * @param user
     */
    async findOneByUser(user: User): Promise<Company | undefined>
    {
        return this.createQueryBuilder('c')
            .leftJoin('c.users', 'u')
            .where('u.id = :userId')
            .andWhere('u.role = :role')
            .setParameters({
                userId: user.id,
                role: user.role
            })
            .getOne();
    }

    async findOneByManager(manager: Manager): Promise<Company | undefined>
    {
        return this.createQueryBuilder('c')
            .leftJoin('c.users', 'm')
            .where('m.id = :managerId')
            .andWhere('m.role = :role')
            .setParameters({
                managerId: manager.id,
                role: manager.role
            })
            .getOne();
    }

    async findIfCompanyBelongsToUser(companyId: number, userId: number): Promise<Company | undefined>
    {
        return this.createQueryBuilder('c')
            .leftJoin('c.users', 'u')
            .where('c.id = :companyId')
            .andWhere('u.id = :userId')
            .setParameters({
                companyId,
                userId
            })
            .getOne();
    }

    /**
     *
     * @param data
     */
    async create(data: any): Promise<Company>
    {
        let company: Company = new Company();

        company.name = data.name;

        await this.repository.save(company);

        return company;
    }

    /**
     *
     * @param company
     * @param data
     */
    async update(company: Company, data: Partial<Company>): Promise<boolean>
    {
        company.name = data.name || company.name;

        await this.repository.save(company);

        return true;
    }

    async delete(company: Company): Promise<boolean>
    {
        await this.repository.remove(company);
        return true;
    }
}
