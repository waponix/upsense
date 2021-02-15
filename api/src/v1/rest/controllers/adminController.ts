import {Request, Response} from 'express';
import Controller from '../../../components/controller';
import {Admin} from '../../shared/entities/Admin';
import AdminServices from '../services/adminServices';
import adminValidator from '../validators/adminValidator';
import {getRepository} from 'typeorm';
import ApiFilter from '../filters/apiFilter';
import {ApiResponse} from "../objects/ApiResponse";
import {Status} from "../../../components/types/ResponseStatusTypes";

/**
 * The auth controller
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
        let adminFilter = new ApiFilter(request);
        let adminServices = new AdminServices((<any>request).user);
        let admins = await adminServices.getList(adminFilter);
        let apiResponse = new ApiResponse();

        apiResponse.result = admins;

        return response
            .status(200)
            .json(apiResponse);
    }

    /**
     * Add admin
     *
     * @param request
     * @param response
     */
    async postAdminAction(request: Request, response: Response)
    {
        let apiResponse = new ApiResponse();
        const adminServices = new AdminServices((<any>request).user);
        const body = request.body;

        // do validation before proceed
        let validation = adminValidator(body);

        validation.checkAsync(async () => {
            // success callback
            const admin: Admin = await adminServices.create(body.admin);

            apiResponse.result = admin;

            return response
                .status(200)
                .json(apiResponse);
        }, () => {
            // fail callback
            apiResponse.status = Status.BadRequest;
            apiResponse.message = 'Operation failed, argument values incorrect';
            apiResponse.error = validation.errors.all();

            return response
                .status(400)
                .json(apiResponse);
        });
    }

    /**
     * Delete Admin
     *
     * @param request
     * @param response
     */
    async deleteAdminAction(request: Request, response: Response)
    {
        let apiResponse = new ApiResponse();
        const adminServices = new AdminServices((<any>request).user);
        const adminRepository = getRepository(Admin);
        const {id}: any = request.params;

        // get the admin to be deleted
        let admin: Admin | undefined = await adminRepository.findOne({where: id});

        if (!admin) {
            apiResponse.status = Status.NotFound;
            apiResponse.message = 'Operation failed, admin data not found';
            return response
                .status(404)
                .json(apiResponse);
        }

        await adminServices.delete(admin);

        return response
            .status(200)
            .json(apiResponse);
    }
}
