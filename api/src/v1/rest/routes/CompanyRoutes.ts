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
        .get('/:id', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin']), controller.getCompanyAction)
        // add company
        .post('/', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin']), controller.postCompaniesAction)
        // update company
        .put('/:id', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin']), controller.putCompaniesAction)
        // delete company
        .delete('/:id', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin']), controller.deleteCompanyAction)
        // get company zone list
        .get('/:companyId/zones', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin']), controller.getZonesAction)
        // get one company zone
        .get('/:companyId/zones/:id', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin']), controller.getZoneAction)
        // add company zone
        .post('/:companyId/zones', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin', 'manager']), controller.postZonesAction)
        // update company zone
        .put('/:companyId/zones/:id', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin', 'manager']), controller.putZonesAction)
        // delete company zone
        .delete('/:companyId/zones/:id', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin', 'manager']), controller.deleteZonesAction);
});

module.exports = routes;
