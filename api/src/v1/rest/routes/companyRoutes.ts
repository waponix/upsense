import {Router} from 'express';
import Routes from '../../../components/routes';
import Controller from '../controllers/companyController';
import {JwtAuth} from "../../../components/security/JwtAuth";

const jwtAuth = new JwtAuth();

let routes = new Routes('/companies', Controller);

routes.registerRoutes((router: Router, controller: Controller) => {
    // register the routes here
    router
        .get('/', jwtAuth.required, controller.getCompaniesAction)
        .post('/', jwtAuth.required, controller.postCompanyAction);
});

module.exports = routes;
