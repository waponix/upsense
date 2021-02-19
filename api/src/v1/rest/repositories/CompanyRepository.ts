import {BaseRepository} from "../../shared/repositories/BaseRepository";
import {Company} from "../../shared/entities/Company";
import {Repository} from "typeorm";
import {Branch} from "../../shared/entities/Branch";

const defaultName: string = "Main";

export class CompanyRepository extends BaseRepository
{
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
}
