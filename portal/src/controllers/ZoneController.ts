import {Request, Response} from "express";
import {Api} from "../components/api";
import moment from "moment";
import CompanyServices from "../services/ZoneServices";

class ZoneController
{
    public async indexAction(request: Request, response: Response)
    {
        try {
            const apiResponse = await Api(request, response).get(`/companies/${request.params.companyId}/zones`);

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
            title: 'Upsense Portal | Create Zone',
            companyId: request.params.companyId
        };

        return response.render('zone/add.html.twig', viewData);
    }

    public async createAction(request: Request, response: Response)
    {
        try {
            const apiResponse = await Api(request, response).post(`/companies/${request.params.companyId}/zones`, {
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

    public async editView(request: Request, response: Response)
    {
        if (request.xhr) {
            const details = await CompanyServices.getCompanyDetails(request, response);
            return response.json(details);
        }

        let viewData: any = {
            title: 'Upsense Portal | Edit Zone',
            companyId: request.params.companyId,
            zoneId: request.params.id
        };

        return response.render('zone/edit.html.twig', viewData);
    }

    public async editAction(request: Request, response: Response)
    {
        try {
            const apiResponse = await Api(request, response).put(`/companies/${request.params.companyId}/zones/${request.params.id}`, {
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

export default new ZoneController();
