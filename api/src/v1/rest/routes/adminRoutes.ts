import {Router} from 'express';
import Routes from '../../../components/routes';
import Controller from '../controllers/adminController';
import {JwtAuth} from '../../../components/security/JwtAuth';

const jwtAuth = new JwtAuth();
let routes = new Routes('/admins', Controller);

routes.registerRoutes((router: Router, controller: Controller) => {
    // register the routes here
    router
        .get('/', [jwtAuth.required], controller.getAdminsAction)
        .post('/', jwtAuth.required, controller.postAdminAction)
        .delete('/:id', jwtAuth.required, controller.deleteAdminAction);
});

module.exports = routes;
