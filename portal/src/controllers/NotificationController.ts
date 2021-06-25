import {Request, Response} from "express";
import {Api} from "../components/api";
import {GetQuery} from "../components/helpers";

class NotificationController
{
    public async indexView(request: Request, response: Response)
    {
        let viewData: any = {
            title: 'Upsense Portal | Notifications',
        };
        return response.render('notification/index.html.twig', viewData);
    }

    public async indexAction(request: Request, response: Response)
    {
        if (request.body.action && request.body.action === 'updateseen') {
            try {
                let endpoint = `/notification-logs`;
                let ids = request.body.ids;

                const apiResponse = await Api(request, response).put(endpoint, {data: {ids}});

                return response.json({
                    status: 'success',
                    data: apiResponse.data.result
                });
            } catch (error) {
                return response.json({status: 'error'});
            }
        }

        try {
            let endpoint = `/notification-logs`;

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

export default new NotificationController();
