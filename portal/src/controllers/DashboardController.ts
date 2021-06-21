import {Request, Response} from "express";
import {Api} from "../components/api";

class DashboardController
{
    public async indexView(request: Request, response: Response)
    {
        if (request.xhr) {
            try {
               const apiResponse = await Api(request, response).get('/statistics/dashboard');

               return response.json({
                   status: 'success',
                   data: apiResponse.data.result
               });
            } catch (error) {
                return response.json({status: 'error', error: error.description.error});
            }
        }

        let viewData: any = {
            title: 'Upsense Portal | Dashboard',
        };
        return response.render('dashboard/index.html.twig', viewData);
    }
}

export default new DashboardController();
