import {Router} from 'express';
import Routes from '../../../components/Routes';
import Controller from '../controllers/StatisticController';
import passport from "../../../components/security/Passport";
import {authorize} from "../../../components/security/Authorization";

let routes = new Routes('/statistics', Controller);

routes.registerRoutes((router: Router, controller: Controller) => {
    // register the routes here
    router
        // get dashboard statistic
        .get('/dashboard', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin', 'manager', 'user']), controller.getDashboardData)
        .get('/unseen-notifications/count', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin', 'manager', 'user']), controller.getUnseenNotificationsCount)
});

module.exports = routes;
