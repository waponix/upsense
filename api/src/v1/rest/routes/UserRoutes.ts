import {Router} from 'express';
import Routes from '../../../components/Routes';
import Controller from '../controllers/UserController';
import passport from "../../../components/security/Passport";
import {authorize} from "../../../components/security/Authorization";

let routes = new Routes('/users', Controller);

routes.registerRoutes((router: Router, controller: Controller) => {
    // register the routes here
    router
        // get users list
        .get('/', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin', 'manager']), controller.getUsersAction)
        // get one user
        .get('/:id', passport.authenticate('jwt', {session: false, optional: false}, authorize(['admin', 'manager', 'user'])), controller.getUserAction)
        // get user's company
        .get('/:userId/company', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin', 'manager', 'user']), controller.getCompanyAction)
        // add user
        .post('/', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin', 'manager']), controller.postUserAction)
        // update user
        .put('/:id', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin', 'manager', 'user']), controller.putUserAction)
        // delete user
        .delete('/:id', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin', 'manager']), controller.deleteUserAction);
});

module.exports = routes;
