import {Router} from 'express';
import Routes from '../../../components/Routes';
import Controller from '../controllers/ManagerController';
import passport from "../../../components/security/Passport";
import {authorize} from "../../../components/security/Authorization";

let routes = new Routes('/managers', Controller);

routes.registerRoutes((router: Router, controller: Controller) => {
    // register the routes here
    router
        // get manager list
        .get('/', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin']), controller.getManagersAction)
        // get one manager
        .get('/:id', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin', "manager"]), controller.getManagerAction)
        // get manager's company
        .get('/:managerId/company', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin', "manager"]), controller.getCompanyAction)
        // add manager
        .post('/', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin']), controller.postManagerAction)
        // update manager
        .put('/:id', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin', 'manager']), controller.putManagerAction)
        // delete manager
        .delete('/:id', passport.authenticate('jwt', {session: false, optional: false}, authorize(['admin'])), controller.deleteManagerAction);
});

module.exports = routes;
