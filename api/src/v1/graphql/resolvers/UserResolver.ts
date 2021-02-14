import {Resolver, Query, Mutation, Authorized, Arg, Args} from 'type-graphql';
import { Admin } from '../../shared/entities/Admin';
import {AdminFilterInput, CreateAdminInput, UpdateAdminInput} from '../resolverInputs/AdminDataInput';
import {QueryArgs} from "../resolverArgs/QueryArgs";
import {SortType} from "../../../components/types/SortOrderTypes";
import {Status} from "../../../components/types/ResponseStatusTypes";
import {getConnection} from "typeorm";
import {UserRepository} from "../repositories/UserRepository";
import {SingleUserResponse, UserResponse} from "../response/UserResponse";
import {CreateUserInput, UpdateUserInput, UserFilterInput} from "../resolverInputs/UserDataInput";

@Resolver()
export class UserResolver
{
    private repo: UserRepository;

    constructor() {
        this.repo = new UserRepository();
        this.repo.init(getConnection());
    }

    @Authorized(['ROLE_ADMIN', 'ROLE_MANAGER'])
    @Query(() => UserResponse)
    async getUsers(
        // @Arg('sort') sort: SortType,
        @Args() {id, pageOffset, find}: QueryArgs,
        @Arg('filters', { nullable: true }) filters?: UserFilterInput
    ) {
        let response = new UserResponse();

        response.result = await this.repo.getList({filters, page: pageOffset, find});

        return response;
    }

    @Authorized(['ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_USER'])
    @Query(() => SingleUserResponse)
    async getUser(@Arg("id") id: number) {
        let response: SingleUserResponse = new SingleUserResponse();

        try {
            let user: Admin | undefined = await this.repo.findOneById(id);

            if (user === undefined) {
                response.status = Status.NotFound;
                response.message = 'Operation failed, user not found';
            }

            response.result = user;
        } catch {
            response.status = Status.InternalError;
            response.message = 'Operation failed, something went wrong please try again later';
        }

        return response;
    }

    @Authorized(['ROLE_ADMIN', 'ROLE_MANAGER'])
    @Mutation(() => SingleUserResponse)
    async createUser(@Arg("data") data: CreateUserInput) {
        let response: SingleUserResponse = new SingleUserResponse();
        let user: Admin | undefined = await this.repo.findOneByUsername(data.username);

        if (user !== undefined) {
            response.status = Status.Error;
            response.message = 'Operation failed, username already in use';

            return response;
        }

        user = await this.repo.findOneByEmail(data.email);
        if (user !== undefined) {
            response.status = Status.Error;
            response.message = 'Operation failed, a user with this email already exist';

            return response;
        }

        await this.repo.queryRunner.startTransaction();
        try {
            let user: Admin = await this.repo.create(data);
            response.result = user;
            await this.repo.queryRunner.commitTransaction();
        } catch {
            await this.repo.queryRunner.rollbackTransaction();
            response.status = Status.Error;
            response.message = 'Operation failed, unable to save user data';
        }

        return response;
    }

    @Authorized(['ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_USER'])
    @Mutation(() => SingleUserResponse)
    async updateUser(@Arg("id") id: number, @Arg("data") data: UpdateUserInput) {
        let response: SingleUserResponse = new SingleUserResponse();

        await this.repo.queryRunner.startTransaction();
        try {
            let user: Admin | undefined = await this.repo.findOneById( id );

            if (user === undefined) {
                response.status = Status.NotFound;
                response.message = 'Operation failed, user data not found';

                return response;
            }

            await this.repo.update(user, data);

            response.result = user;
            await this.repo.queryRunner.commitTransaction();
        } catch {
            await this.repo.queryRunner.rollbackTransaction();
            response.status = Status.Error;
            response.message = 'Operation failed, unable to update user data';
        }

        return response;
    }

    @Authorized(['ROLE_ADMIN', 'ROLE_MANAGER'])
    @Mutation(() => SingleUserResponse)
    async removeUser(@Arg("id") id: number) {
        let response: SingleUserResponse = new SingleUserResponse();

        await this.repo.queryRunner.startTransaction();
        try {
            let user: Admin | undefined = await this.repo.findOneById( id );

            if (user === undefined) {
                response.status = Status.NotFound;
                response.message = 'Operation failed, user data not found';

                return response;
            }

            await this.repo.delete(user);
            await this.repo.queryRunner.commitTransaction();
        } catch {
            await this.repo.queryRunner.rollbackTransaction();
            response.status = Status.Error;
            response.message = 'Operation failed, unable to delete user data';
        }

        return response;
    }
}
