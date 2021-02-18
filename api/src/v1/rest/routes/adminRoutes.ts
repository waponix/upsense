import {Router} from 'express';
import Routes from '../../../components/routes';
import Controller from '../controllers/adminController';
import {JwtAuth} from '../../../components/security/JwtAuth';
import passport from "../../../components/security/passport";

const jwtAuth = new JwtAuth();
let routes = new Routes('/admins', Controller);

routes.registerRoutes((router: Router, controller: Controller) => {
    // register the routes here
    router
        .get('/', passport.authenticate('jwt', {session: false, optional: false}), controller.getAdminsAction)
        .get('/:id', passport.authenticate('jwt', {session: false, optional: false}), controller.getAdminAction)
        .post('/', passport.authenticate('jwt', {session: false, optional: false}), controller.postAdminAction)
        .put('/:id', passport.authenticate('jwt', {session: false, optional: false}), controller.putAdminAction)
        .delete('/:id', passport.authenticate('jwt', {session: false, optional: false}), controller.deleteAdminAction);
});

module.exports = routes;
