import {BaseRepository, QueryOptions} from "../../shared/repositories/BaseRepository";
import {Company} from "../../shared/entities/Company";
import {Repository} from "typeorm";
import {Branch} from "../../shared/entities/Branch";
import {paginationConfig} from "../../../config";

const defaultName: string = "Main";

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
    async getList (options: QueryOptions = {}): Promise<Company[]> {
        let parameters: any = {};
        let whereStatements: any = [];

        const offset = options.page ? paginationConfig.limit * (options.page - 1) : 0;

        const query = await this.em
            .getRepository(Company)
            .createQueryBuilder('company')
            .select('company.id')
            .addSelect('company.name')
            .offset(offset)
            .limit(paginationConfig.limit);

        // create filters if provided
        if (options.filters !== undefined) {
            for (const [field, value] of Object.entries(options.filters)) {
                whereStatements.push(`company.${field} = :${field}`);
                parameters[field] = value;
            }
        }

        // add sort and
        if (options.sort !== undefined) {
            for (const [field, value] of Object.entries(options.sort)) {
                query.addOrderBy(`company.${field}`, value)
            }
        }

        // create search statement if find is provided
        if (options.find !== undefined) {
            parameters.find = `%${options.find}%`;
            let searchStatement = [];

            for (const field of this.searchableFields) {
                searchStatement.push(`company.${field} LIKE :find`);
            }

            whereStatements.push(`(${searchStatement.join(' OR ')})`);
        }

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
    async findOneById (id: number): Promise<Company | undefined>
    {
        return await this.em.getRepository(Company).findOne({where: { id }});
    }

    /**
     *
     * @param data
     */
    async create(data: any): Promise<Company>
    {
        const companyRepository: Repository<Company> = await this.em.getRepository(Company);
        const branchRepository: Repository<Branch> = await this.em.getRepository(Branch);

        let company: Company = new Company();
        let branch: Branch = new Branch();

        branch.name = defaultName;
        await branchRepository.save(branch);

        company.name = data.name;
        company.branch = branch;
        branch.company = company;

        await companyRepository.save(company);
        await branchRepository.save(branch);

        return company;
    }

    /**
     *
     * @param company
     * @param data
     */
    async update(company: Company, data: Partial<Company>): Promise<boolean>
    {
        const companyRepository = await this.em.getRepository(Company);

        company.name = data.name || company.name;

        await companyRepository.save(company);

        return true;
    }

    async delete(company: Company): Promise<boolean>
    {
        const companyRepository = await this.em.getRepository(Company);
        companyRepository.remove(company);
        return true;
    }
}
