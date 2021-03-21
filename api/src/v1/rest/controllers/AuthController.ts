import {Request, Response} from 'express';
import Controller from '../../../components/Controller';
import AuthServices from "../services/AuthServices";
import {ReturnableResponse} from "../objects/ReturnableResponse";

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
        const authServices: AuthServices = new AuthServices((<any>request).user);
        const data: ReturnableResponse = await authServices.login();

        return response
            .status(data.statusCode)
            .json(data.body);
    }

    async refreshAuthTokenAction(request: Request, response: Response)
    {
        const authServices: AuthServices = new AuthServices((<any>request).user);
        const data: ReturnableResponse = await authServices.refreshToken();

        return response
            .status(data.statusCode)
            .json(data.body);
    }

    async invalidateAuthTokenAction(request: Request, response: Response)
    {
        const authServices: AuthServices = new AuthServices((<any>request).user);
        const data: ReturnableResponse = await authServices.logout();

        return response
            .status(data.statusCode)
            .json(data.body);
    }
}
