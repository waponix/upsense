import { Arg, Query, Mutation, Resolver } from 'type-graphql';
import {getRepository, Repository} from 'typeorm';
import { Admin } from '../entities/Admin';
import { Token } from '../objects/Token';
import { RefreshToken } from '../entities/RefreshToken';
import { TokenProviderService } from "../services/TokenProviderService";

@Resolver()
export class AuthResolver
{
    adminRepo: Repository<Admin>;
    tokenRepo: Repository<RefreshToken>;
    tokenService: TokenProviderService;

    constructor() {
        // dependency injection
        this.tokenRepo = getRepository(RefreshToken);
        this.adminRepo = getRepository(Admin);
        this.tokenService = new TokenProviderService();
    }

    @Query(() => String)
    help() {
        return 'Use the login mutation for requesting token'
    }

    @Mutation(() => Token)
    async login (
        @Arg('username', {nullable: false}) username : string,
        @Arg('password', {nullable: false}) password : string
    ) {
        // validate credential
        let admin: Admin | undefined = await this.adminRepo.findOne({ where: {username}, relations: ['refreshToken'] });
        let token = new Token();

        if (admin && admin.validatePassword(password)) {
            const accessToken = this.tokenService.generateAccessToken(admin);
            const refreshToken = await this.tokenService.generateRefreshToken(admin);

            token.accessToken = accessToken;
            token.refreshToken = refreshToken;
            token.message = 'Operation success';
            token.resultCode = 0;
        }

        return token;
    }

    @Mutation(() => Token)
    async refresh (@Arg('auth') auth : string) {
        let token: Token = new Token();

        token.message = 'Invalid refresh token';
        token.resultCode = 3;

        let refreshToken: RefreshToken | undefined = await this.tokenRepo.findOne({where: {token: auth}, relations: ['admin']});

        let decoded = null;
        let error = '';

        if (! await this.tokenService.verifyRefreshToken(auth, decoded, error)) {
            // delete the token in the database
            if (refreshToken) await this.tokenRepo.remove(refreshToken);
            token.message = error;
            // return empty token
            return token;
        }

        if (!refreshToken) {
            // if refresh don't token exist
            return token;
        }

        // generate a new refresh token
        token.refreshToken = await this.tokenService.generateRefreshToken(refreshToken.admin);
        token.accessToken = this.tokenService.generateAccessToken(refreshToken.admin);
        token.resultCode = 0;
        token.message = 'Operation success';

        return token;
    }

    @Mutation(() => String)
    async logout(@Arg('auth') auth : string) {
        const refreshToken: RefreshToken | undefined = await this.tokenRepo.findOne({token: auth});

        if (refreshToken) {
            await this.tokenRepo.remove(refreshToken);
        }

        // will always return operation complete
        return 'Operation successful';
    }
}
