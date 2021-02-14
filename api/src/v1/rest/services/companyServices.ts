import {Company} from '../../shared/entities/Company';
import {getRepository} from 'typeorm';

export default class companyServices
{
    private user: any;
    private companyRepository: any;

    constructor(user: any) {
        this.user = user;
        this.companyRepository = getRepository(Company);
    }

    async getCompanyResourceList()
    {
        return await this.companyRepository.find({}, {take: 20});
    }

    async createCompanyResource(data: any)
    {
        let company: Company = new Company();

        company.name = data.name;

        await this.companyRepository.save(company);

        return company;
    }
}
