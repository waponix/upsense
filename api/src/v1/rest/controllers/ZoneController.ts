import Controller from "../../../components/Controller";
import {Request, Response} from "express";
import ZoneServices from "../services/ZoneServices";
import {ReturnableResponse} from "../objects/ReturnableResponse";

export default class ZoneController extends Controller
{
    async getZoneAction(request: Request, response: Response)
    {
        const zoneServices: ZoneServices = new ZoneServices((<any>request).user);
        const data: ReturnableResponse = await zoneServices.getOne(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }
}
