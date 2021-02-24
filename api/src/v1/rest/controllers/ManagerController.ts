import {Request, Response} from 'express';
import Controller from '../../../components/Controller';
//@ts-ignore
import ManagerServices from "../services/ManagerServices";
import {ReturnableResponse} from "../objects/ReturnableResponse";

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
}
