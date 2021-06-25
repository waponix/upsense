import {BaseRepository, QueryOptions} from "../../shared/repositories/BaseRepository";
import {Company} from "../../shared/entities/Company";
import {miscConfig, paginationConfig} from "../../../config";
import {User, User as Manager} from "../../shared/entities/User";
import {Zone} from "../../shared/entities/Zone";

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

            if (options.relations.indexOf('users') > -1) {
                query.leftJoinAndSelect('c.users', 'u');
            }

            if (options.relations.indexOf('zones') > -1) {
                query.leftJoinAndSelect('c.zones', 'z');
                whereStatements.push('z.name != :defaultZone');
                parameters.defaultZone = miscConfig.defaultZone;
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
        return await this.em.getRepository(Company).findOne({where: { id }, relations: ['users', 'zones']});
    }

    async findOneBy(options: any, relations: any = []): Promise<Company | undefined>
    {
        // options = {where: options};
        // if (relations !== null) {
        //     options.relations = relations;
        // }
        // return await this.repository.findOne(options);

        const query = this.createQueryBuilder('c');
        let whereStatements: any = [];
        let parameters: any = {};

        for (const field in options) {
            whereStatements.push(`c.${field} = :${field}`);
            parameters[field] = options[field];
        }

        if (relations.indexOf('zones') > -1) {
            query.leftJoinAndSelect('c.zones', 'z', `z.company_id = c.id AND z.name != '${miscConfig.defaultZone}'`);
        }

        if (relations.indexOf('users') > -1) {
            query.leftJoinAndSelect('c.users', 'u');
        }

        if (whereStatements.length > 0) {
            query
                .where(whereStatements.join(' AND '))
                .setParameters(parameters);
        }

        return await query.getOne();
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
        await this.em.getRepository(Zone).remove(company.zones);
        await this.em.getRepository(User).remove(company.users);
        await this.repository.delete(company.id);
        return true;
    }
}
