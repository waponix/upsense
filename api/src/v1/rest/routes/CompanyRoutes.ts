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
        .get('/:id(\\d+)', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin']), controller.getCompanyAction)
        // add company
        .post('/', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin']), controller.postCompaniesAction)
        // update company
        .put('/:id(\\d+)', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin']), controller.putCompaniesAction)
        // delete company
        .delete('/:id(\\d+)', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin']), controller.deleteCompanyAction)
        // get company zone list
        .get('/:companyId(\\d+)/zones', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin']), controller.getZonesAction)
        // get one company zone
        .get('/:companyId(\\d+)/zones/:id(\\d+)', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin']), controller.getZoneAction)
        // add company zone
        .post('/:companyId(\\d+)/zones', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin']), controller.postZonesAction)
        // update company zone
        .put('/:companyId(\\d+)/zones/:id(\\d+)', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin']), controller.putZonesAction)
        // delete company zone
        .delete('/:companyId/zones/:id(\\d+)', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin']), controller.deleteZonesAction);
});

module.exports = routes;
