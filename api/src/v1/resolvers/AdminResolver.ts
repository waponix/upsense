import {Resolver, Query, Mutation, Authorized, Arg, Args} from 'type-graphql';
import { Admin } from '../entities/Admin';
import {getRepository} from 'typeorm';
import {AdminFilterInput, CreateAdminInput, UpdateAdminInput} from '../resolverInputs/AdminDataInput';
import {AdminRepository} from "../repositories/AdminRepository";
import {QueryArgs} from "../resolverArgs/QueryArgs";

@Resolver()
export class AdminResolver
{
    private adminRepo: AdminRepository;

    constructor() {
        this.adminRepo = new AdminRepository(getRepository(Admin));
    }

    @Authorized('ROLE_ADMIN')
    @Query(() => [Admin])
    async getAdmins(
        @Args() {id, page, search}: QueryArgs,
        @Arg('filters') filters: AdminFilterInput
    ) {
        return this.adminRepo.getAdminList({});
    }

    @Authorized('ROLE_ADMIN')
    @Query(() => [Admin])
    async getAdmin(@Arg("id") id: number) {
        return this.adminRepo.repo.findOne({ where: { id }});
    }

    @Authorized('ROLE_ADMIN')
    @Mutation(() => Admin)
    async createAdmin(@Arg("data") data: CreateAdminInput) {
        let admin = this.adminRepo.repo.create(data);
        admin.role = 'ROLE_ADMIN';
        await admin.save();
        return admin;
    }

    @Authorized('ROLE_ADMIN')
    @Mutation(() => Admin)
    async updateAdmin(@Arg("id") id: number, @Arg("data") data: UpdateAdminInput) {
        const admin = await this.adminRepo.repo.findOne({ where: { id }});

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
            await this.adminRepo.repo.delete(id);
            return true;
        } catch {
            return false;
        }
    }
}
