import {Request, Response} from "express";
import {Api} from "../components/api";
import {GetQuery, GetTableSorting, PrepareQuery} from "../components/helpers";
import HubServices from "../services/HubServices";

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
        let query: any = '';
        if (request.body.data && request.body.data === 'raw') {

        } else {
            query = PrepareQuery({
                find: request.body.sSearch,
                page: (parseInt(request.body.iDisplayStart) / parseInt(request.body.iDisplayLength)) + 1,
                sort: GetTableSorting(request)
            });
        }

        try {
            const endpoint = `/hubs?${query}`;
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

    public async createView(request: Request, response: Response)
    {
        let viewData: any = {
            title: 'Upsense Portal | Create Hub',
        };

        return response.render('hub/add.html.twig', viewData);
    }

    public async createAction(request: Request, response: Response)
    {
        try {
            const apiResponse = await Api(request, response).post('/hubs', {
                data: request.body.data || {}
            });

            return response.json({
                status: 'success',
                data: apiResponse.data
            });
        } catch (error) {
            // @ts-ignore
            console.log(error);
            return response.json({status: 'error', error: error.description.error});
        }
    }

    public async editView(request: Request, response: Response)
    {
        if (request.xhr) {
            let details = await HubServices.getHubDetails(request, response);

            if (details.data.result) {
                try {
                    const apiResponse = await Api(request, response).get(`/zones/${details.data.result.zone.id}`);
                    details.data.result.companyId = apiResponse.data.result.company.id;
                } catch {
                    console.log('failed to call /zones/:id');
                }
            }

            return response.json(details);
        }

        let viewData: any = {
            title: 'Upsense Portal | Edit Hub',
            hubId: request.params.id
        };

        return response.render('hub/edit.html.twig', viewData);
    }

    public async editAction(request: Request, response: Response)
    {
        try {
            let data: any = request.body.data;

            if (!data.zone) data.zone = null;

            const apiResponse = await Api(request, response).put(`/hubs/${request.params.id}`, {
                data: request.body.data || {}
            });

            return response.json({
                status: 'success',
                data: apiResponse.data
            });
        } catch (error) {
            // @ts-ignore
            return response.json({status: 'error', error: error.description.error});
        }
    }
}

export default new HubController();
