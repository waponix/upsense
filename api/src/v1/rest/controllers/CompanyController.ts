import {Request, Response} from 'express';
import Controller from '../../../components/Controller';
import CompanyServices from '../services/CompanyServices';
import ZoneServices from "../services/ZoneServices";
import {ReturnableResponse} from "../objects/ReturnableResponse";
import {Zone} from "../../shared/entities/Zone";


export default class CompanyController extends Controller
{
    async getCompaniesAction (request: Request, response: Response)
    {
        const companyServices = new CompanyServices((<any>request).user);
        const data: ReturnableResponse = await companyServices.getList(request);

        response
            .status(data.statusCode)
            .json(data.body);
    }

    async getCompanyAction (request: Request, response: Response)
    {
        const companyServices = new CompanyServices((<any>request).user);
        const data: ReturnableResponse = await companyServices.getOne(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }

    async postCompanyAction (request: Request, response: Response)
    {
        const companyServices: CompanyServices = new CompanyServices((<any>request).user);
        const data: ReturnableResponse = await companyServices.create(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }

    async putCompanyAction (request: Request, response: Response)
    {
        const companyServices: CompanyServices = new CompanyServices((<any>request).user);
        const data: ReturnableResponse = await companyServices.update(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }

    async deleteCompanyAction (request: Request, response: Response)
    {
        const companyServices: CompanyServices = new CompanyServices((<any>request).user);
        const data: ReturnableResponse = await companyServices.delete(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }

    // async getZonesAction (request: Request, response: Response)
    // {
    //     const zoneServices: ZoneServices = new ZoneServices((<any>request).user);
    //     const data: ReturnableResponse = await zoneServices.getList(request);
    //
    //     return response
    //         .status(data.statusCode)
    //         .json(data.body);
    // }

    async postZonesAction (request: Request, response: Response)
    {
        const zoneServices: ZoneServices = new ZoneServices((<any>request).user);
        const data: ReturnableResponse = await zoneServices.create(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }
}
