import {Router} from 'express';
import Routes from '../../../components/Routes';
import Controller from '../controllers/SensorController';
import passport from "../../../components/security/Passport";
import {authorize} from "../../../components/security/Authorization";

let routes = new Routes('/sensors', Controller);

routes.registerRoutes((router: Router, controller: Controller) => {
    // register the routes here
    router
        // get sensor list
        .get('/', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin', 'manager', 'user']), controller.getSensorsAction)
        // get one sensor
        .get('/:id(\d+)', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin']), controller.getSensorAction)
        // // update sensor
        .put('/:id(\d+)', passport.authenticate('jwt', {session: false, optional: false}), authorize(['admin']), controller.putSensorAction);
});

module.exports = routes;
