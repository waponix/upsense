import {Request, Response} from 'express';
import Controller from '../../../components/controller';
import AdminServices from "../services/AdminServices";
import {ReturnableResponse} from "../objects/ReturnableResponse";

/**
 * The admin controller
 *
 * @param request
 * @param response
 */
export default class AdminController extends Controller
{
    /**
     * Get admins
     *
     * @param request
     * @param response
     */
    async getAdminsAction(request: Request, response: Response)
    {
        const adminServices = new AdminServices((<any>request).user);
        const data: ReturnableResponse = await adminServices.getList(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }

    /**
     * Get admins
     *
     * @param request
     * @param response
     */
    async getAdminAction(request: Request, response: Response)
    {
        const adminServices = new AdminServices((<any>request).user);
        const data: ReturnableResponse = await adminServices.getOne(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }

    /**
     * Add admin
     *
     * @param request
     * @param response
     */
    async postAdminAction(request: Request, response: Response)
    {
        const adminServices = new AdminServices((<any>request).user);
        const data: ReturnableResponse = await adminServices.create(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }

    /**
     * Add admin
     *
     * @param request
     * @param response
     */
    async putAdminAction(request: Request, response: Response)
    {
        const adminServices = new AdminServices((<any>request).user);
        const data: ReturnableResponse = await adminServices.update(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }

    /**
     * Delete Admin
     *
     * @param request
     * @param response
     */
    async deleteAdminAction(request: Request, response: Response)
    {``
        const adminServices = new AdminServices((<any>request).user);
        const data: ReturnableResponse = await adminServices.delete(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }
}
