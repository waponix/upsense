import Controller from "../../../components/Controller";
import {Request, Response} from "express";
import {ReturnableResponse} from "../objects/ReturnableResponse";
import SensorServices from "../services/SensorServices";

export default class SensorController extends Controller
{
    async getSensorsAction(request: Request, response: Response)
    {
        const sensorServices: SensorServices = new SensorServices((<any>request).user);
        const data: ReturnableResponse = await sensorServices.getList(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }

    async putSensorAction(request: Request, response: Response)
    {
        const sensorServices: SensorServices = new SensorServices((<any>request).user);
        const data: ReturnableResponse = await sensorServices.update(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }
}
