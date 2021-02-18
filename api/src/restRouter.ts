import express, { Router } from 'express';
import Routes from './components/routes';
import path from 'path';

const restRouter: Router = express.Router();

/**
 * Collect all the route in this single Router object
 */

// add the imported routes here
const routes: Routes[] = [
    require('./v1/rest/routes/authRoutes'),
    require('./v1/rest/routes/adminRoutes'),
    require('./v1/rest/routes/managerRoutes'),
    require('./v1/rest/routes/companyRoutes')
];

// register v1 apis
do {
    let route = routes.shift();

    if (route !== undefined) {
        restRouter.use(path.posix.join('/api/v1', route.getPath()), route.getRouter());
    }
} while(routes.length > 0);

export default restRouter;
