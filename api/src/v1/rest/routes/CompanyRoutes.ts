import {Router} from 'express';
import Routes from '../../../components/routes';
import Controller from '../controllers/CompanyController';
import passport from "../../../components/security/passport";

let routes = new Routes('/companies', Controller);

routes.registerRoutes((router: Router, controller: Controller) => {
    // register the routes here
    router
        // .get('/', jwtAuth.required, controller.getCompaniesAction)
        .post('/', passport.authenticate('jwt', {session: false, optional: false}), controller.postCompanyAction);
});

module.exports = routes;
