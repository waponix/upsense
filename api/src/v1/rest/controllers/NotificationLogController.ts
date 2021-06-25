import {Request, Response} from 'express';
import Controller from '../../../components/Controller';
import {ReturnableResponse} from "../objects/ReturnableResponse";
import NotificationLogServices from "../services/NotificationLogServices";

/**
 * The admin controller
 *
 * @param request
 * @param response
 */
export default class NotificationLogController extends Controller
{
    /**
     * Get admins
     *
     * @param request
     * @param response
     */
    async getNotificationLogsAction(request: Request, response: Response)
    {
        const notificationLogServices = new NotificationLogServices((<any>request).user);
        const data: ReturnableResponse = await notificationLogServices.getList(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }

    async putNotificationLogsAction(request: Request, response: Response)
    {
        const notificationLogServices = new NotificationLogServices((<any>request).user);
        const data: ReturnableResponse = await notificationLogServices.updateMany(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }

    /*/!**
     * Get admins
     *
     * @param request
     * @param response
     *!/
    async getAdminAction(request: Request, response: Response)
    {
        const adminServices = new AdminServices((<any>request).user);
        const data: ReturnableResponse = await adminServices.getOne(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }

    /!**
     * Add admin
     *
     * @param request
     * @param response
     *!/
    async postAdminAction(request: Request, response: Response)
    {
        const adminServices = new AdminServices((<any>request).user);
        const data: ReturnableResponse = await adminServices.create(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }

    /!**
     * Add admin
     *
     * @param request
     * @param response
     *!/
    async putAdminAction(request: Request, response: Response)
    {
        const adminServices = new AdminServices((<any>request).user);
        const data: ReturnableResponse = await adminServices.update(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }

    /!**
     * Delete User
     *
     * @param request
     * @param response
     *!/
    async deleteAdminAction(request: Request, response: Response)
    {
        const adminServices = new AdminServices((<any>request).user);
        const data: ReturnableResponse = await adminServices.delete(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }*/
}
