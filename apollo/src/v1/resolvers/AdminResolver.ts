import { Resolver, Query, Authorized } from 'type-graphql';
import { Admin } from '../entities/Admin';
import { getRepository, Repository } from 'typeorm';

@Resolver()
export class AdminResolver
{
    private repo: Repository<Admin>;
    constructor()
    {
        this.repo = getRepository(Admin);
    }
    @Authorized('ROLE_ADMIN')
    @Query(() => [Admin])
    async admins() {
        return this.repo.find();
    }

}
