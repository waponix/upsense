import {Resolver, Query, Mutation, Authorized, Arg, Args} from 'type-graphql';
import { Admin } from '../../entities/Admin';
import {AdminFilterInput, CreateAdminInput, UpdateAdminInput} from '../resolverInputs/AdminDataInput';
import {AdminRepository} from "../repositories/AdminRepository";
import {QueryArgs} from "../resolverArgs/QueryArgs";
import {SortType} from "../../../components/types/SortOrderTypes";
import {AdminResponse, SingleAdminResponse} from "../response/AdminResponse";
import {Status} from "../../../components/types/ResponseStatusTypes";
import {getConnection} from "typeorm";

@Resolver()
export class AdminResolver
{
    private repo: AdminRepository;

    constructor() {
        this.repo = new AdminRepository();
        this.repo.init(getConnection());
    }

    @Authorized('ROLE_ADMIN')
    @Query(() => AdminResponse)
    async getAdmins(
        // @Arg('sort') sort: SortType,
        @Args() {id, pageOffset, find}: QueryArgs,
        @Arg('filters', { nullable: true }) filters?: AdminFilterInput
    ) {
        let response = new AdminResponse();

        response.result = await this.repo.getList({filters, page: pageOffset, find});

        return response;
    }

    @Authorized('ROLE_ADMIN')
    @Query(() => SingleAdminResponse)
    async getAdmin(@Arg("id") id: number) {
        let response: SingleAdminResponse = new SingleAdminResponse();

        try {
            let admin: Admin | undefined = await this.repo.findOneById(id);

            if (admin === undefined) {
                response.status = Status.NotFound;
                response.message = 'Operation failed, admin not found';
            }

            response.result = admin;
        } catch {
            response.status = Status.InternalError;
            response.message = 'Operation failed, something went wrong please try again later';
        }

        return response;
    }

    @Authorized('ROLE_ADMIN')
    @Mutation(() => SingleAdminResponse)
    async createAdmin(@Arg("data") data: CreateAdminInput) {
        let response: SingleAdminResponse = new SingleAdminResponse();
        let admin: Admin | undefined = await this.repo.findOneByUsername(data.username);

        if (admin !== undefined) {
            response.status = Status.Error;
            response.message = 'Operation failed, username already in use';

            return response;
        }

        admin = await this.repo.findOneByEmail(data.email);
        if (admin !== undefined) {
            response.status = Status.Error;
            response.message = 'Operation failed, a user with this email already exist';

            return response;
        }

        await this.repo.queryRunner.startTransaction();
        try {
            let admin: Admin = await this.repo.create(data);
            response.result = admin;
            await this.repo.queryRunner.commitTransaction();
        } catch {
            await this.repo.queryRunner.rollbackTransaction();
            response.status = Status.Error;
            response.message = 'Operation failed, unable to save admin data';
        }

        return response;
    }

    @Authorized('ROLE_ADMIN')
    @Mutation(() => SingleAdminResponse)
    async updateAdmin(@Arg("id") id: number, @Arg("data") data: UpdateAdminInput) {
        let response: SingleAdminResponse = new SingleAdminResponse();

        await this.repo.queryRunner.startTransaction();
        try {
            let admin: Admin | undefined = await this.repo.findOneById( id );

            if (admin === undefined) {
                response.status = Status.NotFound;
                response.message = 'Operation failed, admin data not found';

                return response;
            }

            await this.repo.update(admin, data);

            response.result = admin;
            await this.repo.queryRunner.commitTransaction();
        } catch {
            await this.repo.queryRunner.rollbackTransaction();
            response.status = Status.Error;
            response.message = 'Operation failed, unable to update admin data';
        }

        return response;
    }

    @Authorized('ROLE_ADMIN')
    @Mutation(() => SingleAdminResponse)
    async removeAdmin(@Arg("id") id: number) {
        let response: SingleAdminResponse = new SingleAdminResponse();

        await this.repo.queryRunner.startTransaction();
        try {
            let admin: Admin | undefined = await this.repo.findOneById( id );

            if (admin === undefined) {
                response.status = Status.NotFound;
                response.message = 'Operation failed, admin data not found';

                return response;
            }

            await this.repo.delete(admin);
            await this.repo.queryRunner.commitTransaction();
        } catch {
            await this.repo.queryRunner.rollbackTransaction();
            response.status = Status.Error;
            response.message = 'Operation failed, unable to delete admin data';
        }

        return response;
    }
}
