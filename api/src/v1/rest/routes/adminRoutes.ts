import {Router} from 'express';
import Routes from '../../components/routes';
import Controller from '../controllers/adminController';
import jwtAuth from '../security/jwtAuth';

let routes = new Routes('/admins', Controller);

routes.registerRoutes((router: Router, controller: Controller) => {
    // register the routes here
    router
        .get('/', [jwtAuth.required], controller.getAdminsAction)
        .post('/', jwtAuth.optional, controller.postAdminAction)
        .delete('/:uuid', jwtAuth.required, controller.deleteAdminAction);
});

module.exports = routes;
