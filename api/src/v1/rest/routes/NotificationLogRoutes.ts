import {Router} from 'express';
import Routes from '../../../components/Routes';
import Controller from '../controllers/NotificationLogController';
import passport from "../../../components/security/Passport";
import {authorize} from "../../../components/security/Authorization";

let routes = new Routes('/notification-logs', Controller);

routes.registerRoutes((router: Router, controller: Controller) => {
    // register the routes here
    router
        // get notification log list
        .get('/', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin', 'manager', 'user']), controller.getNotificationLogsAction)
        // update notification logs (seen data)
        .put('/', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin', 'manager', 'user']), controller.putNotificationLogsAction);
    // delete notification setting
    // .delete('/:userId/notification-settings/:id', passport.authenticate('jwt', {session: false, optional: false}), authorize(['user']), controller.deleteNotificationSettingAction);
});

module.exports = routes;
