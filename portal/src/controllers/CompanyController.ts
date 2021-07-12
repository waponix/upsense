import {NextFunction, Request, Response} from "express";
import {Api} from "../components/api";
import moment from "moment";
import CompanyServices from "../services/CompanyServices";
import {GetTableSorting, PrepareQuery} from "../components/helpers";

class CompanyController
{
    public async indexView(request: Request, response: Response)
    {
        let viewData: any = {
            title: 'Upsense Portal | Manage Company'
        };
        return response.render('company/index.html.twig', viewData);
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
            const apiResponse: any = await Api(request, response).get(`/companies?${query}`);

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

    public async detailView(request: Request, response: Response)
    {
        if (request.xhr) {
            const details = await CompanyServices.getCompanyDetails(request, response);
            return response.json(details);
        }

        let viewData: any = {
            title: 'Upsense Portal | Company Details',
            companyId: request.params.id
        };
        return response.render('company/detail.html.twig', viewData);
    }

    public async createView(request: Request, response: Response)
    {
        let viewData: any = {
            title: 'Upsense Portal | Create Company'
        };

        return response.render('company/add.html.twig', viewData);
    }

    public async createAction(request: Request, response: Response)
    {
        try {
            const apiResponse = await Api(request, response).post('/companies', {
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
            const details = await CompanyServices.getCompanyDetails(request, response);
            return response.json(details);
        }

        return response.render('company/edit.html.twig');
    }

    public async editAction(request: Request, response: Response)
    {
        try {
            const apiResponse = await Api(request, response).put(`/companies/${request.params.id}`, {
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

export default new CompanyController();
