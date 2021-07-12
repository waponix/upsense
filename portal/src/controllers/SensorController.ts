import {Request, Response} from "express";
import {Api} from "../components/api";
import {GetQuery, GetTableSorting, PrepareQuery} from "../components/helpers";
import HubServices from "../services/HubServices";

class SensorController
{
    public async indexView(request: Request, response: Response)
    {
        let viewData: any = {
            title: 'Upsense Portal | Manage Sensor'
        };
        return response.render('sensor/index.html.twig', viewData);
    }

    public async indexAction(request: Request, response: Response)
    {
        const query = PrepareQuery({
            find: request.body.sSearch,
            page: (parseInt(request.body.iDisplayStart) / parseInt(request.body.iDisplayLength)) + 1,
            sort: GetTableSorting(request),
            relations: ['hub']
        });

        try {
            const endpoint = `sensors?${query}`;
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
            title: 'Upsense Portal | Create Sensor',
        };

        return response.render('sensor/add.html.twig', viewData);
    }

    public async createAction(request: Request, response: Response)
    {
        try {
            const apiResponse = await Api(request, response).post('/sensors', {
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
            try {
                const apiResponse =  await Api(request, response).get(`/sensors/${request.params.id}`);

                return response.json({
                    status: 'success',
                    data: apiResponse.data.result
                });
            } catch (error) {
                // @ts-ignore
                return response.json({status: 'error', error: error.description.error});
            }
        }

        let viewData: any = {
            title: 'Upsense Portal | Edit Sensor',
            sensorId: request.params.id
        };

        return response.render('sensor/edit.html.twig', viewData);
    }

    public async editAction(request: Request, response: Response)
    {
        try {
            const apiResponse = await Api(request, response).put(`/sensors/${request.params.id}`, {
                data: request.body.data || {}
            });

            return response.json({
                status: 'success',
                data: apiResponse.data.result
            });
        } catch (error) {
            // @ts-ignore
            return response.json({status: 'error', error: error.description.error});
        }
    }
}

export default new SensorController();
