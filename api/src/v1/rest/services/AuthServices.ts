import {ReturnableResponse} from "../objects/ReturnableResponse";
import {TokenProviderServices} from "../../shared/services/TokenProviderServices";
import {getRepository, Repository} from "typeorm";
import {User} from "../../shared/entities/User";
import {AuthMessages, CommonMessages} from "../../../messages/messages";
import {Status} from "../../../components/types/ResponseStatusTypes";
import {ApiResponse} from "../objects/ApiResponse";
import {RefreshToken} from "../../shared/entities/RefreshToken";

export default class AuthServices
{
    private user: any;
    private tokenProviderServices: TokenProviderServices;
    private userRepository: Repository<User>;
    private tokenRepository: Repository<RefreshToken>;

    public constructor(user: any)
    {
        this.user = user;
        this.tokenProviderServices = new TokenProviderServices();
        this.userRepository = getRepository(User);
        this.tokenRepository = getRepository(RefreshToken);
    }

    public async login(): Promise<ReturnableResponse>
    {
        let apiResponse = new ApiResponse();
        let statusCode = 200;

        let user: User | undefined = await this.userRepository.findOne({ where: {id: this.user.id}, relations: ['refreshToken'] });

        if (user === undefined) {
            apiResponse.message = AuthMessages.InvalidCredentials;
            apiResponse.status = Status.Unauthorized;
            statusCode = 401;
            return new ReturnableResponse(statusCode, apiResponse);
        }

        try {
            const accessToken = this.tokenProviderServices.generateAccessToken(user);
            const refreshToken = await this.tokenProviderServices.generateRefreshToken(user);

            apiResponse.result = {
                accessToken,
                refreshToken
            }

        } catch {
            apiResponse.status = Status.Error;
            apiResponse.message = CommonMessages.SomethingWentWrong;
            statusCode = 500;
        }

        return new ReturnableResponse(statusCode, apiResponse);
    }

    public async refreshToken(): Promise<ReturnableResponse>
    {
        let apiResponse = new ApiResponse();
        let statusCode = 200;

        let user: User | undefined = await this.userRepository.findOne({ where: {id: this.user.id}, relations: ['refreshToken'] });

        if (user === undefined) {
            apiResponse.message = AuthMessages.InvalidCredentials;
            apiResponse.status = Status.Unauthorized;
            statusCode = 401;

            return new ReturnableResponse(statusCode, apiResponse);
        }

        try {
            const accessToken = this.tokenProviderServices.generateAccessToken(user);
            const refreshToken = await this.tokenProviderServices.generateRefreshToken(user);
            apiResponse.result = {
                accessToken,
                refreshToken
            };
        } catch {
            apiResponse.status = Status.Error;
            apiResponse.message = CommonMessages.SomethingWentWrong;
            statusCode = 500;
        }

        return new ReturnableResponse(statusCode, apiResponse);
    }

    public async logout(): Promise<ReturnableResponse>
    {
        let apiResponse = new ApiResponse();
        let statusCode = 200;

        let user: User | undefined = await this.userRepository.findOne({ where: {id: this.user.id}, relations: ['refreshToken'] });

        if (user !== undefined) {
            try {
                await this.tokenRepository.remove(user.refreshToken);
            } catch (e) {
                apiResponse.status = Status.Error;
                apiResponse.message = CommonMessages.SomethingWentWrong;
                statusCode = 500;
            }
        }

        return new ReturnableResponse(statusCode, apiResponse);
    }
}
