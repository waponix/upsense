import {Resolver, Query, Mutation, Authorized, Arg} from 'type-graphql';
import { Admin } from '../entities/Admin';
import { getRepository, Repository } from 'typeorm';
import {CreateAdminInput, UpdateAdminInput} from '../resolverInputs/AdminDataInput';

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

    @Authorized('ROLE_ADMIN')
    @Query(() => [Admin])
    getAdmin(@Arg("id") id: number) {
        return this.repo.findOne({ where: { id }});
    }

    @Authorized('ROLE_ADMIN')
    @Mutation(() => Admin)
    async createAdmin(@Arg("data") data: CreateAdminInput) {
        let admin = this.repo.create(data);
        admin.role = 'ROLE_ADMIN';
        await admin.save();
        return admin;
    }

    @Authorized('ROLE_ADMIN')
    @Mutation(() => Admin)
    async updateAdmin(@Arg("id") id: number, @Arg("data") data: UpdateAdminInput) {
        const admin = await this.repo.findOne({ where: { id }});

        if (!admin) {
            throw new Error(`The admin with id: ${id} does not exist!`);
        }

        Object.assign(admin, data);
        await admin.save();

        return admin;
    }

    @Authorized('ROLE_ADMIN')
    @Mutation(() => Boolean)
    async removeAdmin(@Arg("id") id: number) {
        try {
            await this.repo.delete(id);
            return true;
        } catch {
            return false;
        }
    }
}
