import {Router} from 'express';
import Routes from '../../../components/routes';
import Controller from '../controllers/managerController';
import passport from "../../../components/security/passport";

let routes = new Routes('/managers', Controller);

routes.registerRoutes((router: Router, controller: Controller) => {
    // register the routes here
    router
        .get('/', passport.authenticate('jwt', {session: false, optional: false}), controller.getManagersAction)
        .get('/:id', passport.authenticate('jwt', {session: false, optional: false}), controller.getManagerAction)
        .post('/', passport.authenticate('jwt', {session: false, optional: false}), controller.postManagerAction)
        .put('/:id', passport.authenticate('jwt', {session: false, optional: false}), controller.putManagerAction)
        .delete('/:id', passport.authenticate('jwt', {session: false, optional: false}), controller.deleteManagerAction);
});

module.exports = routes;
