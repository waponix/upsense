import {Request, Response} from 'express';
import Controller from '../../../components/controller';
import CompanyServices from '../services/CompanyServices';
import {ApiResponse} from "../objects/ApiResponse";
import {Status} from "../../../components/types/ResponseStatusTypes";
import {ReturnableResponse} from "../objects/ReturnableResponse";


export default class CompanyController extends Controller
{
    /*async getCompaniesAction(request: Request, response: Response)
    {
        let apiResponse = new ApiResponse();
        let companyServices = new CompanyServices((<any>request).user);
        let companies = await companyServices.getCompanyResourceList();

        apiResponse.result = companies;

        response
            .status(200)
            .json(apiResponse);
    }*/

    async postCompanyAction(request: Request, response: Response)
    {
        const companyServices: CompanyServices = new CompanyServices((<any>request).user);
        const data: ReturnableResponse = await companyServices.create(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }
}
