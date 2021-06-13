import {Request, Response} from "express";
import {Api} from "../components/api";

class HubController {
    public async indexView(request: Request, response: Response)
    {
        let viewData: any = {
            title: 'Upsense Portal | Manage Hub'
        };
        return response.render('hub/index.html.twig', viewData);
    }

    public async indexAction(request: Request, response: Response)
    {
        try {
            const apiResponse = await Api(request, response).get('/hubs');

            return response.json({
                status: 'success',
                data: apiResponse.data.result
            });
        } catch (error) {
            return response.json({status: 'error'});
        }
    }
}

export default new HubController();
