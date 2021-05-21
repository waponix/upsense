import {Request, Response} from 'express';
import Controller from '../../../components/Controller';
//@ts-ignore
import ManagerServices from "../services/ManagerServices";
import {ReturnableResponse} from "../objects/ReturnableResponse";
import CompanyServices from "../services/CompanyServices";
import NotificationSettingServices from "../services/NotificationSettingServices";

/**
 * The manager controller
 *
 * @param request
 * @param response
 */
export default class ManagerController extends Controller
{
    /**
     * Get managers
     *
     * @param request
     * @param response
     */
    async getManagersAction(request: Request, response: Response)
    {
        const managerServices = new ManagerServices((<any>request).user);
        const data: ReturnableResponse = await managerServices.getList(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }

    /**
     * Get managers
     *
     * @param request
     * @param response
     */
    async getManagerAction(request: Request, response: Response)
    {
        const managerServices = new ManagerServices((<any>request).user);
        const data: ReturnableResponse = await managerServices.getOne(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }

    /**
     * Add manager
     *
     * @param request
     * @param response
     */
    async postManagerAction(request: Request, response: Response)
    {
        const managerServices = new ManagerServices((<any>request).user);
        const data: ReturnableResponse = await managerServices.create(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }

    /**
     * Add manager
     *
     * @param request
     * @param response
     */
    async putManagerAction(request: Request, response: Response)
    {
        const managerServices = new ManagerServices((<any>request).user);
        const data: ReturnableResponse = await managerServices.update(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }

    /**
     * Delete Manager
     *
     * @param request
     * @param response
     */
    async deleteManagerAction(request: Request, response: Response)
    {
        const managerServices = new ManagerServices((<any>request).user);
        const data: ReturnableResponse = await managerServices.delete(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }

    async getCompanyAction(request: Request, response: Response)
    {
        const companyServices: CompanyServices = new CompanyServices((<any>request).user);
        const data: ReturnableResponse = await companyServices.getOneByManager(request);

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

    async postNotificationSettingAction(request: Request, response: Response)
    {
        const notificationSettingServices: NotificationSettingServices = new NotificationSettingServices((<any>request).user);
        const data: ReturnableResponse = await notificationSettingServices.create(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }

    async putNotificationSettingAction(request: Request, response: Response)
    {
        const notificationSettingServices: NotificationSettingServices = new NotificationSettingServices((<any>request).user);
        const data: ReturnableResponse = await notificationSettingServices.update(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }

    async deleteNotificationSettingAction(request: Request, response: Response)
    {
        const notificationSettingServices: NotificationSettingServices = new NotificationSettingServices((<any>request).user);
        const data: ReturnableResponse = await notificationSettingServices.delete(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }
}
