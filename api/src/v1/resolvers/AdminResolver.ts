import {Resolver, Query, Mutation, Authorized, Arg} from 'type-graphql';
import { Admin } from '../entities/Admin';
import { getRepository, Repository } from 'typeorm';
import {CreateAdmin, UpdateAdmin} from '../resolverInputs/AdminDataInput';

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
    async createAdmin(@Arg("data") data: CreateAdmin) {
        const admin = this.repo.create(data);
        await admin.save();
        return admin;
    }

    @Authorized('ROLE_ADMIN')
    @Mutation(() => Admin)
    async updateAdmin(@Arg("id") id: number, @Arg("data") data: UpdateAdmin) {
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
