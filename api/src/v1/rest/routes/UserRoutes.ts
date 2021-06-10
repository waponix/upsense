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
        .get('/:id(\\d+)', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin', 'manager', 'user']), controller.getUserAction)
        // get user's company
        .get('/:userId(\\d+)/company', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin', 'manager', 'user']), controller.getCompanyAction)
        // add user
        .post('/', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin', 'manager']), controller.postUserAction)
        // update user
        .put('/:id(\\d+)', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin', 'manager', 'user']), controller.putUserAction)
        // delete user
        .delete('/:id(\\d+)', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin', 'manager']), controller.deleteUserAction)
        // get notification setting list
        // .get('/:userId/notification-settings', passport.authenticate('jwt', {session: false, optional: false}), authorize(['user']), controller.getNotificationSettingsAction)
        // get one notification setting
        .get('/:userId(\\d+)/notification-setting', passport.authenticate('jwt', {session: false, optional: false}), authorize(['user']), controller.getNotificationSettingAction)
        // add notification setting
        // .post('/:userId/notification-settings/', passport.authenticate('jwt', {session: false, optional: false}), authorize(['user']), controller.postNotificationSettingAction)
        // update notification setting
        .put('/:userId(\\d+)/notification-setting', passport.authenticate('jwt', {session: false, optional: false}), authorize(['user']), controller.putNotificationSettingAction)
        // delete notification setting
        // .delete('/:userId/notification-settings/:id', passport.authenticate('jwt', {session: false, optional: false}), authorize(['user']), controller.deleteNotificationSettingAction);
});

module.exports = routes;
