import Controller from "../../../components/Controller";
import {Request, Response} from "express";
import {ReturnableResponse} from "../objects/ReturnableResponse";
import HubServices from "../services/HubServices";

export default class HubController extends Controller
{
    async getHubsAction(request: Request, response: Response)
    {
        const hubServices: HubServices = new HubServices((<any>request).user);
        const data: ReturnableResponse = await hubServices.getList(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }

    async getHubAction(request: Request, response: Response)
    {
        const hubServices: HubServices = new HubServices((<any>request).user);
        const data: ReturnableResponse = await hubServices.getOne(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }

    async postHubAction(request: Request, response: Response)
    {
        const hubServices: HubServices = new HubServices((<any>request).user);
        const data: ReturnableResponse = await hubServices.create(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }

    async putHubAction(request: Request, response: Response)
    {
        const hubServices: HubServices = new HubServices((<any>request).user);
        const data: ReturnableResponse = await hubServices.update(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }
}
