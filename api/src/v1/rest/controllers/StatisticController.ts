import Controller from "../../../components/Controller";
import {Request, Response} from "express";
import StatisticServices from "../services/StatisticServices";
import {ReturnableResponse} from "../objects/ReturnableResponse";

export default class StatisticController extends Controller
{
    async getDashboardData(request: Request, response: Response)
    {
        const statisticServices = new StatisticServices((<any>request).user);
        const data: ReturnableResponse = await statisticServices.getDashboardData(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }

    async getUnseenNotificationsCount(request: Request, response: Response)
    {
        const statisticServices = new StatisticServices((<any>request).user);
        const data: ReturnableResponse = await statisticServices.getUnseenNotificationCount(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }
}
