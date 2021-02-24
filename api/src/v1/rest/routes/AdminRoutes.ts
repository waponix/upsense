import {Router} from 'express';
import Routes from '../../../components/Routes';
import Controller from '../controllers/AdminController';
import passport from "../../../components/security/Passport";

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
