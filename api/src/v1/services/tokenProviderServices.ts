import parameter from '../../components/helpers/parameter';
const jwt = require('jsonwebtoken');

export default class TokenProviderServices
{
    private params: any;

    constructor() {
        this.params = parameter.get('jwt');
    }

    generateAccessToken(user: any)
    {
        // create and sign the access token
        return jwt.sign(
            this.createUserPayload(user),
            this.params.secret,
            {
                issuer: this.params.issuer,
                algorithm: this.params.algorithm,
                expiresIn: this.params.expiration
            });
    }

    generateRefreshToken(user: any)
    {
        //create and sign the refresh token
        return jwt.sign(
            this.createUserPayload(user),
            this.params.refreshSecret,
            {
                issuer: this.params.issuer,
                algorithm: this.params.algorithm,
                expiresIn: this.params.expiration
            });
    }

    private createUserPayload(user: any)
    {
        return {
            photo: user.photo,
            uuid: user.uuid,
            role: user.role
        }
    }
}
