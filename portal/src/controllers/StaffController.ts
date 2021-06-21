import {Request, Response} from "express";
import {Api} from "../components/api";
import {GetQuery} from "../components/helpers";

class StaffController
{
    public async indexView(request: Request, response: Response)
    {
        let viewData: any = {
            title: 'Upsense Portal | Manage Accounts | Staffs'
        };
        return response.render('staff/index.html.twig', viewData);
    }

    public async indexAction(request: Request, response: Response)
    {
        try {
            let endpoint = `/users?${GetQuery(request)}`;

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
            title: 'Upsense Portal | Create Staff'
        };

        return response.render('staff/add.html.twig', viewData);
    }

    public async createAction(request: Request, response: Response)
    {
        try {
            const apiResponse = await Api(request, response).post('/users', {
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
                const apiResponse = await Api(request, response).get(`/users/${request.query.id}`, {
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
            title: 'Upsense Portal | Edit Staff',
            staffId: request.params.id
        };

        return response.render('staff/edit.html.twig', viewData);
    }

    public async editAction(request: Request, response: Response)
    {
        try {
            const apiResponse = await Api(request, response).put(`/users/${request.body.id}`, {
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

export default new StaffController();
