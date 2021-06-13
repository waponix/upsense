import {Request, Response} from "express";
import {Api} from "../components/api";
import {GetQuery} from "../components/helpers";

class ManagerController
{
    public async indexView(request: Request, response: Response)
    {
        let viewData: any = {
            title: 'Upsense Portal | Manage Accounts | Managers',
        };
        return response.render('manager/index.html.twig', viewData);
    }

    public async indexAction(request: Request, response: Response)
    {
        try {
            let endpoint = `/managers?${GetQuery(request)}`;

            const apiResponse = await Api(request, response).get(endpoint);

            return response.json({
                status: 'success',
                data: apiResponse.data.result
            });
        } catch (error) {
            return response.json({status: 'error'});
        }
    }

    public async createView(request: Request, response: Response)
    {
        let viewData: any = {
            title: 'Upsense Portal | Create Manager',
        };

        return response.render('manager/add.html.twig', viewData);
    }

    public async createAction(request: Request, response: Response)
    {
        try {
            const apiResponse = await Api(request, response).post('/managers', {
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
                const apiResponse = await Api(request, response).get(`/managers/${request.query.id}`, {
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

        let viewData: any = {
            title: 'Upsense Portal | Edit Manager',
            managerId: request.params.id
        };

        return response.render('manager/edit.html.twig', viewData);
    }

    public async editAction(request: Request, response: Response)
    {
        try {
            console.log(request.body.data);
            const apiResponse = await Api(request, response).put(`/managers/${request.body.id}`, {
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

export default new ManagerController();
