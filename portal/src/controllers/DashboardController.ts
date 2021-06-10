import {Request, Response} from "express";

class DashboardController
{
    public async indexView(request: Request, response: Response)
    {
        let viewData: any = {
            title: 'Upsense Portal | Dashboard',
        };
        return response.render('dashboard/index.html.twig', viewData);
    }
}

export default new DashboardController();
