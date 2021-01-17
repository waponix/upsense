import { Arg, Query, Mutation, Resolver } from 'type-graphql';
import { getRepository } from 'typeorm';
import { Admin } from '../entities/Admin';
import { jwtConfig } from '../../config';
import { Token } from '../objects/Token';

const jwt = require('jsonwebtoken');

@Resolver()
export class AuthResolver
{
    @Query(() => String)
    help() {
        return 'Use the login mutation for requesting token'
    }

    @Mutation(() => Token)
    async login (
        @Arg('username', {nullable: false}) username : string,
        @Arg('password', {nullable: false}) password : string
    ) {
        const repo = getRepository(Admin)
        // validate credential
        let admin: Admin | undefined = await repo.findOne({ username });
        let token = new Token();

        if (admin && admin.validatePassword(password)) {
            let payload = {
                user: {
                    picture: admin.picture,
                    username: admin.username,
                    id: admin.id,
                    role: admin.role,
                }
            };

            let accessToken = jwt.sign(
                payload,
                jwtConfig.secret,
                {
                    issuer: jwtConfig.issuer,
                    algorithm: jwtConfig.algorithm,
                    expiresIn: jwtConfig.expiry
                });

            let refreshToken = jwt.sign(
                {},
                jwtConfig.refreshSecret,
                {
                    issuer: jwtConfig.issuer,
                    algorithm: jwtConfig.algorithm,
                    expiresIn: jwtConfig.expiry
                });

            token.accessToken = accessToken;
            token.refreshToken = refreshToken;
            token.message = 'Login success';
            token.resultCode = 0;
        }

        return token;
    }
}
