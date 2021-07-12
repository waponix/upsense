import {Request, Response} from "express";
import {Api} from "../components/api";
import {GetQuery, GetTableSorting, PrepareQuery} from "../components/helpers";

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
            const query = PrepareQuery({
                find: request.body.sSearch,
                page: (parseInt(request.body.iDisplayStart) / parseInt(request.body.iDisplayLength)) + 1,
                sort: GetTableSorting(request)
            });

            let endpoint = `/notification-logs?${query}`;

            const apiResponse = await Api(request, response).get(endpoint);

            const dataTableResponse = {
                iTotalRecords: apiResponse.data.result.count,
                iTotalDisplayRecords: apiResponse.data.result.totalCount,
                sEcho: request.body.sEcho,
                aaData: apiResponse.data.result.data
            }

            return response.json(dataTableResponse);
        } catch (error) {
            return response.json({});
        }
    }
}

export default new NotificationController();
