import {Request, Response} from 'express';
import Controller from '../../components/controller';
import connection from '../../components/connection';
import Admin from '../entities/admin';
import parameter from '../../components/helpers/parameter';
import TokenProviderServices from '../services/tokenProviderServices'

/**
 * The auth controller
 *
 * @param request
 * @param response
 */
export default class AuthController extends Controller
{
    async requestJwtTokenAction(request: Request, response: Response)
    {
        const tokenProviderServices = new TokenProviderServices();

        // send the generated token to the client
        response
            .status(200)
            .json({
                accessToken: tokenProviderServices.generateAccessToken((<any>request).user),
                refreshToken: tokenProviderServices.generateRefreshToken((<any>request).user)
            });
    }

    async invalidateJwtTokenAction(request: Request, response: Response)
    {
        return response.json(['Operation successful']);
    }
}
