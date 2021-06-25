import {Request, Response} from "express";
import {Api} from "../components/api";

class SensorController
{
    public async notificationCountAction(request: Request, response: Response)
    {
        try {
            const apiResponse = await Api(request, response).get('/statistics/unseen-notifications/count');

            return response.json({
                status: 'success',
                data: apiResponse.data.result
            });
        } catch (error) {
            return response.json({status: 'error'});
        }
    }
}

export default new SensorController();
