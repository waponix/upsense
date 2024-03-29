import {Router} from 'express';
import Routes from '../../../components/Routes';
import Controller from '../controllers/AuthController';
import passport from '../../../components/security/Passport';
import {JwtAuth} from "../../../components/security/JwtAuth";

let routes = new Routes('/auth', Controller);
const jwtAuth = new JwtAuth();

routes.registerRoutes((router: Router, controller: Controller) => {
    // register the routes here
    router.post('/login', jwtAuth.optional, passport.authenticate('basic', { session: false }), controller.requestAuthTokenAction);
    router.post('/refresh', jwtAuth.optional, passport.authenticate('jwt', { session: false, optional: false }), controller.refreshAuthTokenAction);
    router.post('/logout', jwtAuth.optional, passport.authenticate('jwt', { session: false, optional: false }), controller.invalidateAuthTokenAction);
});

module.exports = routes;
