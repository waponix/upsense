import {Request, Response} from "express";
import {Api} from "../components/api";
import {GetQuery} from "../components/helpers";

class SensorController {
    public async indexView(request: Request, response: Response)
    {
        let viewData: any = {
            title: 'Upsense Portal | Manage Sensor'
        };
        return response.render('sensor/index.html.twig', viewData);
    }

    public async indexAction(request: Request, response: Response)
    {
        try {
            const endpoint = `sensors?${GetQuery(request)}`;
            const apiResponse = await Api(request, response).get(endpoint);

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
