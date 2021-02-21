import {Resolver, Query, Mutation, Authorized, Arg, Args} from 'type-graphql';
import { Admin } from '../../shared/entities/Admin';
import {ManagerFilterInput, CreateManagerInput, UpdateManagerInput} from '../resolverInputs/ManagerDataInput';
import {QueryArgs} from "../resolverArgs/QueryArgs";
import {SortType} from "../../../components/types/SortOrderTypes";
import {ManagerResponse, SingleManagerResponse} from "../response/ManagerResponse";
import {Status} from "../../../components/types/ResponseStatusTypes";
import {ManagerRepository} from "../repositories/MangerRepository";

@Resolver()
export class ManagerResolver
{
    private repo: ManagerRepository;

    constructor() {
        this.repo = new ManagerRepository(Admin);
        this.repo.init();
    }

    @Authorized(['ROLE_ADMIN'])
    @Query(() => ManagerResponse)
    async getManagers(
        // @Arg('sort') sort: SortType,
        @Args() {id, pageOffset, find}: QueryArgs,
        @Arg('filters', { nullable: true }) filters?: ManagerFilterInput
    ) {
        let response = new ManagerResponse();

        response.result = await this.repo.getList({filters, page: pageOffset, find});

        return response;
    }

    @Authorized(['ROLE_ADMIN', 'ROLE_MANAGER'])
    @Query(() => SingleManagerResponse)
    async getManager(@Arg("id") id: number) {
        let response: SingleManagerResponse = new SingleManagerResponse();

        try {
            let manager: Admin | undefined = await this.repo.findOneById(id);

            if (manager === undefined) {
                response.status = Status.NotFound;
                response.message = 'Operation failed, manager not found';
            }

            response.result = manager;
        } catch {
            response.status = Status.InternalError;
            response.message = 'Operation failed, something went wrong';
        }

        return response;
    }

    @Authorized(['ROLE_ADMIN'])
    @Mutation(() => SingleManagerResponse)
    async createManager(@Arg("data") data: CreateManagerInput) {
        let response: SingleManagerResponse = new SingleManagerResponse();
        let manager: Admin | undefined = await this.repo.findOneByUsername(data.username);

        if (manager !== undefined) {
            response.status = Status.Error;
            response.message = 'Operation failed, username already in use';

            return response;
        }

        manager = await this.repo.findOneByEmail(data.email);
        if (manager !== undefined) {
            response.status = Status.Error;
            response.message = 'Operation failed, a user with this email already exist';

            return response;
        }

        await this.repo.queryRunner.startTransaction();
        try {
            let manager: Admin = await this.repo.create(data);
            response.result = manager;
            await this.repo.queryRunner.commitTransaction();
        } catch {
            await this.repo.queryRunner.rollbackTransaction();
            response.status = Status.Error;
            response.message = 'Operation failed, unable to save manager data';
        }

        return response;
    }

    @Authorized(['ROLE_ADMIN', 'ROLE_MANAGER'])
    @Mutation(() => SingleManagerResponse)
    async updateManager(@Arg("id") id: number, @Arg("data") data: UpdateManagerInput) {
        let response: SingleManagerResponse = new SingleManagerResponse();

        await this.repo.queryRunner.startTransaction();
        try {
            let manager: Admin | undefined = await this.repo.findOneById( id );

            if (manager === undefined) {
                response.status = Status.NotFound;
                response.message = 'Operation failed, manager data not found';

                return response;
            }

            await this.repo.update(manager, data);

            response.result = manager;
            await this.repo.queryRunner.commitTransaction();
        } catch {
            await this.repo.queryRunner.rollbackTransaction();
            response.status = Status.Error;
            response.message = 'Operation failed, unable to update manager data';
        }

        return response;
    }

    @Authorized(['ROLE_ADMIN'])
    @Mutation(() => SingleManagerResponse)
    async removeManager(@Arg("id") id: number) {
        let response: SingleManagerResponse = new SingleManagerResponse();

        await this.repo.queryRunner.startTransaction();
        try {
            let manager: Admin | undefined = await this.repo.findOneById( id );

            if (manager === undefined) {
                response.status = Status.NotFound;
                response.message = 'Operation failed, manager data not found';

                return response;
            }

            await this.repo.delete(manager);
            await this.repo.queryRunner.commitTransaction();
        } catch {
            await this.repo.queryRunner.rollbackTransaction();
            response.status = Status.Error;
            response.message = 'Operation failed, unable to delete manager data';
        }

        return response;
    }
}
