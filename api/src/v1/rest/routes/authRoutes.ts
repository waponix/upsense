import {Router} from 'express';
import Routes from '../../../components/routes';
import Controller from '../controllers/authController';
import passport from '../../../components/security/passport';
import {JwtAuth} from "../../../components/security/JwtAuth";

let routes = new Routes('/auth', Controller);
const jwtAuth = new JwtAuth();

routes.registerRoutes((router: Router, controller: Controller) => {
    // register the routes here
    router.post('/login', jwtAuth.optional, passport.authenticate('basic', { session: false }), controller.requestJwtTokenAction);
    router.post('/refresh', jwtAuth.optional, passport.authenticate('authtoken', { session: false, optional: false }), controller.refreshJwtTokenAction);
    router.post('/logout', jwtAuth.optional, passport.authenticate('authtoken', { session: false, optional: false }), controller.invalidateJwtTokenAction);
});

module.exports = routes;
