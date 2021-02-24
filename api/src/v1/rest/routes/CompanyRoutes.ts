import {Router} from 'express';
import Routes from '../../../components/Routes';
import Controller from '../controllers/CompanyController';
import passport from "../../../components/security/Passport";

let routes = new Routes('/companies', Controller);

routes.registerRoutes((router: Router, controller: Controller) => {
    // register the routes here
    router
        .get('/', passport.authenticate('jwt', {session: false, optional: false}), controller.getCompaniesAction)
        .get('/:id', passport.authenticate('jwt', {session: false, optional: false}), controller.getCompanyAction)
        .post('/', passport.authenticate('jwt', {session: false, optional: false}), controller.postCompanyAction)
        .put('/:id', passport.authenticate('jwt', {session: false, optional: false}), controller.putCompanyAction)
        .delete('/:id', passport.authenticate('jwt', {session: false, optional: false}), controller.deleteCompanyAction);
});

module.exports = routes;
