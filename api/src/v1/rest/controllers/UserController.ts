import {Request, Response} from 'express';
import Controller from '../../../components/Controller';
//@ts-ignore
import UserServices from "../services/UserServices";
import {ReturnableResponse} from "../objects/ReturnableResponse";
import CompanyServices from "../services/CompanyServices";
import NotificationSettingServices from "../services/NotificationSettingServices";

/**
 * The user controller
 *
 * @param request
 * @param response
 */
export default class UserController extends Controller
{
    /**
     * Get users
     *
     * @param request
     * @param response
     */
    async getUsersAction(request: Request, response: Response)
    {
        const userServices: UserServices = new UserServices((<any>request).user);
        const data: ReturnableResponse = await userServices.getList(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }

    /**
     * Get users
     *
     * @param request
     * @param response
     */
    async getUserAction(request: Request, response: Response)
    {
        const userServices: UserServices = new UserServices((<any>request).user);
        const data: ReturnableResponse = await userServices.getOne(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }

    /**
     * Add user
     *
     * @param request
     * @param response
     */
    async postUserAction(request: Request, response: Response)
    {
        const userServices: UserServices = new UserServices((<any>request).user);
        const data: ReturnableResponse = await userServices.create(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }

    /**
     * Add user
     *
     * @param request
     * @param response
     */
    async putUserAction(request: Request, response: Response)
    {
        const userServices: UserServices = new UserServices((<any>request).user);
        const data: ReturnableResponse = await userServices.update(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }

    /**
     * Delete User
     *
     * @param request
     * @param response
     */
    async deleteUserAction(request: Request, response: Response)
    {
        const userServices: UserServices = new UserServices((<any>request).user);
        const data: ReturnableResponse = await userServices.delete(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }

    async getCompanyAction(request: Request, response: Response)
    {
        const companyServices: CompanyServices = new CompanyServices((<any>request).user);
        const data: ReturnableResponse = await companyServices.getOneByUser(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }

    // Notification Setting endpoints
    async getNotificationSettingsAction(request: Request, response: Response)
    {
        const notificationSettingServices: NotificationSettingServices = new NotificationSettingServices((<any>request).user);
        const data: ReturnableResponse = await notificationSettingServices.getList(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }

    async getNotificationSettingAction(request: Request, response: Response)
    {
        const notificationSettingServices: NotificationSettingServices = new NotificationSettingServices((<any>request).user);
        const data: ReturnableResponse = await notificationSettingServices.getOne(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }

    /*async postNotificationSettingAction(request: Request, response: Response)
    {
        const notificationSettingServices: NotificationSettingServices = new NotificationSettingServices((<any>request).user);
        const data: ReturnableResponse = await notificationSettingServices.create(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }*/

    async putNotificationSettingAction(request: Request, response: Response)
    {
        const notificationSettingServices: NotificationSettingServices = new NotificationSettingServices((<any>request).user);
        const data: ReturnableResponse = await notificationSettingServices.update(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }

    /*async deleteNotificationSettingAction(request: Request, response: Response)
    {
        const notificationSettingServices: NotificationSettingServices = new NotificationSettingServices((<any>request).user);
        const data: ReturnableResponse = await notificationSettingServices.delete(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }*/
}
