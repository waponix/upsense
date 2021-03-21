import {Router} from 'express';
import Routes from '../../../components/Routes';
import Controller from '../controllers/AdminController';
import passport from "../../../components/security/Passport";
import {authorize} from "../../../components/security/Authorization";

let routes = new Routes('/admins', Controller);

routes.registerRoutes((router: Router, controller: Controller) => {
    // register the routes here
    router
        // get admin list
        .get('/', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin']), controller.getAdminsAction)
        // get one admin
        .get('/:id', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin']), controller.getAdminAction)
        // add admin
        .post('/', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin']), controller.postAdminAction)
        // update admin
        .put('/:id', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin']), controller.putAdminAction)
        // delete admin
        .delete('/:id', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin']), controller.deleteAdminAction);
});

module.exports = routes;
