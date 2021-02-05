import { Resolver, Query, Mutation, Args, Arg, Ctx } from 'type-graphql';
import {getRepository, Repository} from 'typeorm';
import { Company } from '../entities/Company';
import { QueryArgs } from '../resolverArgs/QueryArgs';
import { CreateCompanyInput } from '../resolverInputs/CompanyDataInput';
import { Context } from '../objects/Context';

@Resolver()
export class CompanyResolver
{
    private repo: Repository<Company>;
    constructor()
    {
        this.repo = getRepository(Company);
    }

    @Query(() => [Company])
    async companies(
        @Args() {id, page, search}: QueryArgs,
    ) {
        let companies = null;

        if (!!id) {
            companies = await this.repo.findByIds([id]);
        } else {
            companies = await this.repo.find();
        }

        return companies;
    }

    @Mutation(() => Company)
    async createCompany(@Arg('data') data: CreateCompanyInput) {
        let company = new Company();

        company.name = data.name;

        await this.repo.save(company);

        return company;
    }
}
