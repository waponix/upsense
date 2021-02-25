import express, { Router } from 'express';
import Routes from './components/Routes';
import path from 'path';

const restRouter: Router = express.Router();

/**
 * Collect all the route in this single Router object
 */

// add the imported routes here
const routes: Routes[] = [
    require('./v1/rest/routes/AuthRoutes'),
    require('./v1/rest/routes/AdminRoutes'),
    require('./v1/rest/routes/ManagerRoutes'),
    require('./v1/rest/routes/UserRoutes'),
    require('./v1/rest/routes/CompanyRoutes')
];

// register v1 apis
do {
    let route = routes.shift();

    if (route !== undefined) {
        restRouter.use(path.posix.join('/v1', route.getPath()), route.getRouter());
    }
} while(routes.length > 0);

export default restRouter;
