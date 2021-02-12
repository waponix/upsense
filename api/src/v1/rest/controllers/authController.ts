import {Request, Response} from 'express';
import Controller from '../../../components/controller';
import {TokenProviderService} from "../../services/TokenProviderService";
import {Admin} from "../../entities/Admin";
import {getRepository, Repository} from "typeorm";

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
        const tokenProviderService = new TokenProviderService();

        const {user} = (<any>request);

        const adminRepo: Repository<Admin> = getRepository(Admin);
        let admin: Admin | undefined = await adminRepo.findOne({ where: {id: user.id}, relations: ['refreshToken'] });

        if (admin === undefined) {
            return response.json({});
        }

        const accessToken = tokenProviderService.generateAccessToken(admin);
        const refreshToken = await tokenProviderService.generateRefreshToken(admin);

        // send the generated token to the client
        return response
            .status(200)
            .json({
                accessToken,
                refreshToken
            });
    }

    async refreshJwtToken(request: Request, response: Response)
    {
        return response.json({});
    }

    async invalidateJwtTokenAction(request: Request, response: Response)
    {
        return response.json(['Operation successful']);
    }
}
