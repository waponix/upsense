import {Router} from 'express';
import Routes from '../../../components/Routes';
import Controller from '../controllers/ManagerController';
import passport from "../../../components/security/Passport";
import {authorize} from "../../../components/security/Authorization";

let routes = new Routes('/managers', Controller);

routes.registerRoutes((router: Router, controller: Controller) => {
    // register the routes here
    router
        // get manager list
        .get('/', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin']), controller.getManagersAction)
        // get one manager
        .get('/:id(\\d+)', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin', "manager"]), controller.getManagerAction)
        // get manager's company
        .get('/:managerId(\\d+)/company', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin', "manager"]), controller.getCompanyAction)
        // add manager
        .post('/', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin']), controller.postManagerAction)
        // update manager
        .put('/:id(\\d+)', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin', 'manager']), controller.putManagerAction)
        // delete manager
        .delete('/:id(\\d+)', passport.authenticate('jwt', {session: false, optional: false}, authorize(['admin'])), controller.deleteManagerAction)
        // get notification setting list
        // .get('/:userId/notification-settings', passport.authenticate('jwt', {session: false, optional: false}), authorize(['manager']), controller.getNotificationSettingsAction)
        // get one notification setting
        .get('/:userId(\\d+)/notification-setting', passport.authenticate('jwt', {session: false, optional: false}), authorize(['manager']), controller.getNotificationSettingAction)
        // add notification setting
        // .post('/:userId/notification-settings/', passport.authenticate('jwt', {session: false, optional: false}), authorize(['manager']), controller.postNotificationSettingAction)
        // update notification setting
        .put('/:userId(\\d+)/notification-setting', passport.authenticate('jwt', {session: false, optional: false}), authorize(['manager']), controller.putNotificationSettingAction)
        // delete notification setting
        // .delete('/:userId/notification-settings/:id', passport.authenticate('jwt', {session: false, optional: false}), authorize(['manager']), controller.deleteNotificationSettingAction);
});

module.exports = routes;
