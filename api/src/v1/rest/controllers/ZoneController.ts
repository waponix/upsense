import Controller from "../../../components/Controller";
import {Request, Response} from "express";
import ZoneServices from "../services/ZoneServices";
import {ReturnableResponse} from "../objects/ReturnableResponse";

export default class ZoneController extends Controller
{
    async postZoneAction(request: Request, response: Response)
    {
        const zoneServices: ZoneServices = new ZoneServices((<any>request).user);
        const data: ReturnableResponse = zoneServices.create(request);
    }
}
