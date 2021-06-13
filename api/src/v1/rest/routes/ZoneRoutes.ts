import {Router} from 'express';
import Routes from '../../../components/Routes';
import Controller from '../controllers/ZoneController';
import passport from "../../../components/security/Passport";
import {authorize} from "../../../components/security/Authorization";

let routes = new Routes('/zones', Controller);

routes.registerRoutes((router: Router, controller: Controller) => {
    // register the routes here
    router
        // get one zone
        .get('/:id(\\d+)', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin']), controller.getZoneAction);
    // delete notification setting
    // .delete('/:userId/notification-settings/:id', passport.authenticate('jwt', {session: false, optional: false}), authorize(['user']), controller.deleteNotificationSettingAction);
});

module.exports = routes;
