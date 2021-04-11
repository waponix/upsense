import {Router} from 'express';
import Routes from '../../../components/Routes';
import Controller from '../controllers/CompanyController';
import passport from "../../../components/security/Passport";
import {authorize} from "../../../components/security/Authorization";

let routes = new Routes('/companies', Controller);

routes.registerRoutes((router: Router, controller: Controller) => {
// register the routes here
    router
        // get company list
        .get('/', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin']), controller.getCompaniesAction)
        // get one company
        .get('/:id', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin', 'manager']), controller.getCompanyAction)
        // add company
        .post('/', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin']), controller.postCompanyAction)
        // update company
        .put('/:id', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin']), controller.putCompanyAction)
        // delete company
        .delete('/:id', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin']), controller.deleteCompanyAction)
        // add company zone
        .post('/:companyId/zones', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin']), controller.postZoneAction);
});

module.exports = routes;
