import {Router} from 'express';
import Routes from '../../../components/routes';
import Controller from '../controllers/UserController';
import passport from "../../../components/security/passport";

let routes = new Routes('/users', Controller);

routes.registerRoutes((router: Router, controller: Controller) => {
    // register the routes here
    router
        .get('/', passport.authenticate('jwt', {session: false, optional: false}), controller.getUsersAction)
        .get('/:id', passport.authenticate('jwt', {session: false, optional: false}), controller.getUserAction)
        .post('/', passport.authenticate('jwt', {session: false, optional: false}), controller.postUserAction)
        .put('/:id', passport.authenticate('jwt', {session: false, optional: false}), controller.putUserAction)
        .delete('/:id', passport.authenticate('jwt', {session: false, optional: false}), controller.deleteUserAction);
});

module.exports = routes;
