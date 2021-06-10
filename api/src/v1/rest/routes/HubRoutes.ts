import {Router} from 'express';
import Routes from '../../../components/Routes';
import Controller from '../controllers/HubController';
import passport from "../../../components/security/Passport";
import {authorize} from "../../../components/security/Authorization";

let routes = new Routes('/hubs', Controller);

routes.registerRoutes((router: Router, controller: Controller) => {
    // register the routes here
    router
        // get hub list
        .get('/', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin']), controller.getHubsAction)
        // get one hub
        .get('/:id(\\d+)', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin']), controller.getHubAction)
        // update hub
        .put('/:id(\\d+)', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin']), controller.putHubAction);
});

module.exports = routes;
