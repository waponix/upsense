import {Request, Response} from 'express';
import Controller from '../../../components/Controller';
import {TokenProviderService} from "../../shared/services/TokenProviderService";
import {User} from "../../shared/entities/User";
import {getRepository, Repository} from "typeorm";
import {ApiResponse} from "../objects/ApiResponse";
import {Status} from "../../../components/types/ResponseStatusTypes";
import {RefreshToken} from "../../shared/entities/RefreshToken";
import {CommonMessages} from "../../../messages/messages";

/**
 * The auth controller
 *
 * @param request
 * @param response
 */
export default class AuthController extends Controller
{
    async requestAuthTokenAction(request: Request, response: Response)
    {
        let apiResponse = new ApiResponse();
        const tokenProviderService = new TokenProviderService();

        const {user} = (<any>request);

        const adminRepo: Repository<User> = getRepository(User);
        let admin: User | undefined = await adminRepo.findOne({ where: {id: user.id}, relations: ['refreshToken'] });

        if (admin === undefined) {
            apiResponse.message = CommonMessages.SomethingWentWrong;
            apiResponse.status = Status.Error;
            response.status(401);
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

    async refreshAuthTokenAction(request: Request, response: Response)
    {
        let apiResponse = new ApiResponse();

        const {user} = (<any>request);
        const tokenProviderService = new TokenProviderService();

        const adminRepo: Repository<User> = getRepository(User);
        let admin: User | undefined = await adminRepo.findOne({ where: {id: user.id}, relations: ['refreshToken'] });

        if (admin === undefined) {
            apiResponse.message = CommonMessages.SomethingWentWrong;
            apiResponse.status = Status.Error;
            response.status(401);
            return response.json(apiResponse);
        }

        try {
            const token = tokenProviderService.generateAccessToken(user);
            const refreshToken = await tokenProviderService.generateRefreshToken(admin);
            apiResponse.result = {
                accessToken: token,
                refreshToken
            };

            return response.json(apiResponse);
        } catch {
            apiResponse.status = Status.Error;
            apiResponse.message = CommonMessages.SomethingWentWrong;
        }
    }

    async invalidateAuthTokenAction(request: Request, response: Response)
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
