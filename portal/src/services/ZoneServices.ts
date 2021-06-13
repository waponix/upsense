import {Request, Response} from "express";
import {Api} from "../components/api";

class ZoneServices
{
    public async getCompanyDetails(request: Request, response: Response)
    {
        try {
            const apiResponse =  await Api(request, response).get(`/companies/${request.params.companyId}/zones/${request.params.id}`);

            return {
                status: 'success',
                data: apiResponse.data
            };
        } catch (error) {
            // @ts-ignore
            return {status: 'error', error: error.description.error};
        }
    }
}

export default new ZoneServices();
