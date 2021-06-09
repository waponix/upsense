import { Arg, Query, Mutation, Resolver } from 'type-graphql';
import {getRepository, Repository} from 'typeorm';
import { User } from '../../shared/entities/User';
import { Token } from '../objects/Token';
import { RefreshToken } from '../../shared/entities/RefreshToken';
import {TokenProviderServices} from "../../shared/services/TokenProviderServices";
import {Status} from "../../../components/types/ResponseStatusTypes";
import {AuthResponse} from "../response/AuthResponse";

@Resolver()
export class AuthResolver
{
    adminRepo: Repository<User>;
    tokenRepo: Repository<RefreshToken>;
    tokenService: TokenProviderServices;

    constructor() {
        // dependency injection
        this.tokenRepo = getRepository(RefreshToken);
        this.adminRepo = getRepository(User);
        this.tokenService = new TokenProviderServices();
    }

    @Query(() => String)
    help() {
        return 'Use the auth mutation for requesting token'
    }

    @Mutation(() => AuthResponse)
    async login (
        @Arg('username', {nullable: false}) username : string,
        @Arg('password', {nullable: false}) password : string
    ) {
        // validate credential
        let admin: User | undefined = await this.adminRepo.findOne({ where: {username}, relations: ['refreshToken'] });
        let token = new Token();
        let response = new AuthResponse();

        if (admin && admin.validatePassword(password)) {
            const accessToken = this.tokenService.generateAccessToken(admin);
            const refreshToken = await this.tokenService.generateRefreshToken(admin);

            token.accessToken = accessToken;
            token.refreshToken = refreshToken;
        } else {
            response.status = Status.AuthenticationError;
            response.message = "Operation failed, invalid credentials";
        }

        response.result = token;

        return response;
    }

    @Mutation(() => AuthResponse)
    async refresh (@Arg('auth') auth : string) {
        let token: Token = new Token();
        let response: AuthResponse = new AuthResponse();

        response.message = 'Operation failed, invalid refresh token';
        response.status = Status.Error;

        let refreshToken: RefreshToken | undefined = await this.tokenRepo.findOne({where: {token: auth}, relations: ['admin']});

        let decoded = null;
        let error = '';

        if (! await this.tokenService.verifyRefreshToken(auth, decoded, error)) {
            // delete the token in the database
            if (refreshToken) await this.tokenRepo.remove(refreshToken);
            response.message = error;
            response.status = Status.Error
            // return empty token
            return token;
        }

        if (!refreshToken) {
            // if refresh token don't exist
            response.message = 'Operation failed, token not found'
            response.status = Status.NotFound
            return token;
        }

        // generate a new refresh token
        token.refreshToken = await this.tokenService.generateRefreshToken(refreshToken.user);
        token.accessToken = this.tokenService.generateAccessToken(refreshToken.user);
        response.result = token;

        return token;
    }

    @Mutation(() => AuthResponse)
    async logout(@Arg('auth') auth : string) {
        let response: AuthResponse = new AuthResponse();
        const refreshToken: RefreshToken | undefined = await this.tokenRepo.findOne({token: auth});

        if (refreshToken) {
            await this.tokenRepo.remove(refreshToken);
        }

        // will always return operation complete
        return response;
    }
}
