import {Request, Response} from 'express';
import Controller from '../../../components/controller';
import {Admin} from '../../entities/Admin';
import AdminServices from '../services/adminServices';
import adminValidator from '../validators/adminValidator';
import {getRepository} from 'typeorm';
import ApiFilter from '../filters/apiFilter';

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
        let admins = await adminServices.getAdminResourceList(adminFilter);

        response
            .status(200)
            .json(admins);
    }

    /**
     * Add admin
     *
     * @param request
     * @param response
     */
    async postAdminAction(request: Request, response: Response)
    {
        let adminServices = new AdminServices((<any>request).user);
        let body = request.body;

        // do validation before proceed
        let validation = adminValidator(body);

        validation.checkAsync(async () => {
            // success callback
            await adminServices.createAdminResource(body.admin)

            response
                .status(200)
                .json({ message: 'Operation successful' });
        }, () => {
            // fail callback
            response
                .status(400)
                .json({
                    message: 'Operation failed',
                    errorMessage: validation.errors.all()
                });
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
        let adminServices = new AdminServices((<any>request).user);
        let adminRepository = getRepository(Admin);
        let id: any = request.params.id;

        // get the admin to be deleted
        let admins: Admin[] = await adminRepository.find({id});

        if (admins.length <= 0) {
            response
                .status(404)
                .json({ message: 'User not found' });
        }

        await adminServices.deleteAdminResource(admins);

        response
            .status(200)
            .json({ message: 'Operation successful' });
    }
}
