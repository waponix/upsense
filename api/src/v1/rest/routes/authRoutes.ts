import {Router} from 'express';
import Routes from '../../components/routes';
import Controller from '../controllers/authController';
import passport from '../security/passport';
import jwtAuth from '../security/jwtAuth';

let routes = new Routes('/auth', Controller);

routes.registerRoutes((router: Router, controller: Controller) => {
    // register the routes here
    router.post('/login', jwtAuth.optional, passport.authenticate('basic', { session: false }), controller.requestJwtTokenAction);
    router.post('/logout', jwtAuth.required, controller.invalidateJwtTokenAction);
});

module.exports = routes;
