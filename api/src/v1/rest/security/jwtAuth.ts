import {Request} from 'express';
import parameter from '../../components/helpers/parameter';
const jwt = require('express-jwt');

const KEY: string = 'Token';

class JwtAuth
{
    required: any;
    optional: any;

    // TODO: include expiration validation

    constructor()
    {
        const jwtParameter = parameter.get('jwt');

        this.required = jwt({
            algorithms: [jwtParameter.algorithm],
            secret: jwtParameter.secret,
            issuer: jwtParameter.issuer,
            getToken: this.getTokenFromHeaders(),
        });

        this.optional = jwt({
            algorithms: [jwtParameter.algorithm],
            secret: jwtParameter.secret,
            issuer: jwtParameter.issuer,
            getToken: this.getTokenFromHeaders(),
            credentialsRequired: false
        });
    }

    getTokenFromHeaders = () => {
        return function (request: Request) {
            const {headers: {authorization}}: any = request;

            // get the token from Bearer Token
            if (authorization && authorization.split(' ')[0] === 'Bearer') {
                return authorization.split(' ')[1];
            }

            return null;
        }
    };
}

export default new JwtAuth();
