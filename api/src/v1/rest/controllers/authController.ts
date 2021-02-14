import {Request, Response} from 'express';
import Controller from '../../../components/controller';
import {TokenProviderService} from "../../shared/services/TokenProviderService";
import {Admin} from "../../shared/entities/Admin";
import {getRepository, Repository} from "typeorm";
import {ApiResponse} from "../objects/ApiResponse";
import {Status} from "../../../components/types/ResponseStatusTypes";
import {RefreshToken} from "../../shared/entities/RefreshToken";

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
        let apiResponse = new ApiResponse();
        const tokenProviderService = new TokenProviderService();

        const {user} = (<any>request);

        const adminRepo: Repository<Admin> = getRepository(Admin);
        let admin: Admin | undefined = await adminRepo.findOne({ where: {id: user.id}, relations: ['refreshToken'] });

        if (admin === undefined) {
            apiResponse.message = 'Operation failed, something went wrong, try again later'
            apiResponse.status = Status.Error;
            response.status(400);
            return response.json(apiResponse);
        }

        const accessToken = tokenProviderService.generateAccessToken(admin);
        const refreshToken = await tokenProviderService.generateRefreshToken(admin);

        apiResponse.result = {
            accessToken,
            refreshToken
        };

        // send the generated token to the client
        return response
            .status(200)
            .json(apiResponse);
    }

    async refreshJwtTokenAction(request: Request, response: Response)
    {
        let apiResponse = new ApiResponse();
        const tokenRepo: Repository<RefreshToken> = getRepository(RefreshToken);
        const {auth} = request.body || {auth: null};

        const refreshToken: RefreshToken | undefined = await tokenRepo.findOne({token: auth});

        if (refreshToken) {
            await tokenRepo.remove(refreshToken);
        }
        return response.json(apiResponse);
    }

    async invalidateJwtTokenAction(request: Request, response: Response)
    {
        let apiResponse = new ApiResponse();
        const tokenRepo: Repository<RefreshToken> = getRepository(RefreshToken);
        const {auth} = request.body || {auth: null};

        const refreshToken: RefreshToken | undefined = await tokenRepo.findOne({token: auth});

        if (refreshToken) {
            await tokenRepo.remove(refreshToken);
        }
        return response.json(apiResponse);
    }
}
