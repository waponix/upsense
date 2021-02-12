import {Request, Response} from 'express';
import Controller from '../../../components/controller';
import companyValidator from '../validators/companyValidator';
import CompanyServices from '../services/companyServices';
import {ApiResponse} from "../objects/ApiResponse";
import {Status} from "../../../components/types/ResponseStatusTypes";


export default class CompanyController extends Controller
{
    async getCompaniesAction(request: Request, response: Response)
    {
        let apiResponse = new ApiResponse();
        let companyServices = new CompanyServices((<any>request).user);
        let companies = await companyServices.getCompanyResourceList();

        apiResponse.result = companies;

        response
            .status(200)
            .json(apiResponse);
    }

    async postCompanyAction(request: Request, response: Response)
    {
        let apiResponse = new ApiResponse()
        let companyServices = new CompanyServices((<any>request).user);
        let body = request.body

        // do validation before proceed
        let validation = companyValidator(body);

        validation.checkAsync(async () => {
            // success callback
            const company = await companyServices.createCompanyResource(body.company);

            apiResponse.result = company;

            response
                .status(200)
                .json(apiResponse);
        }, () => {
            // fail callback
            apiResponse.status = Status.BadRequest;
            apiResponse.message = 'Operation failed, argument values incorrect';
            apiResponse.error = validation.errors.all();

            response
                .status(400)
                .json(apiResponse);
        });
    }
}
