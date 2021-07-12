import {NextFunction, Request, Response} from "express";
import {Api} from "../components/api";
import {GetTableSorting, PrepareQuery} from "../components/helpers";

class AdminController
{
    public async indexView(request: Request, response: Response)
    {
        let viewData: any = {
            title: 'Upsense Portal | Manage Accounts | Admins'
        };
        return response.render('admin/index.html.twig', viewData);
    }

    public async indexAction(request: Request, response: Response)
    {
        const query = PrepareQuery({
            find: request.body.sSearch,
            page: (parseInt(request.body.iDisplayStart) / parseInt(request.body.iDisplayLength)) + 1,
            sort: GetTableSorting(request)
        });

        try {
            const apiResponse = await Api(request, response).get(`/admins?${query}`);

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
            title: 'Upsense Portal | Create Admin'
        };

        return response.render('admin/add.html.twig', viewData);
    }

    public async createAction(request: Request, response: Response)
    {
        try {
            const apiResponse = await Api(request, response).post('/admins', {
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

    public async editView(request: Request, response: Response, next: NextFunction)
    {
        if (!request.xhr) {
            next();
        }
        if (!request.query.resource || request.query.resource !== 'form') {
            try {
                const apiResponse = await Api(request, response).get(`/admins/${request.params.id}`, {
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
            title: 'Upsense Portal | Edit Admin',
            adminId: request.params.id
        };

        return response.render('admin/edit.html.twig', viewData);
    }

    public async editAction(request: Request, response: Response)
    {
        try {
            const apiResponse = await Api(request, response).put(`/admins/${request.params.id}`, {
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

export default new AdminController();
