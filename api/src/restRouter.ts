import express, {Request, Response, Router} from 'express';
import Routes from './components/Routes';
import path from 'path';
import {ApiResponse} from "./v1/rest/objects/ApiResponse";
import {CommonMessages} from "./messages/messages";
import {Status} from "./components/types/ResponseStatusTypes";

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
    require('./v1/rest/routes/CompanyRoutes'),
    require('./v1/rest/routes/ZoneRoutes'),
    require('./v1/rest/routes/SensorRoutes'),
    require('./v1/rest/routes/HubRoutes'),
];

// register v1 apis
do {
    let route = routes.shift();

    if (route !== undefined) {
        restRouter.use(path.posix.join('/v1', route.getPath()), route.getRouter());
    }
} while(routes.length > 0);

restRouter.use((request: Request, response: Response) => {
    let apiResponse: ApiResponse = new ApiResponse();
    apiResponse.message = 'Endpoint does not exist';
    apiResponse.status = Status.NotFound;

    response
        .status(404)
        .json(apiResponse);
});

export default restRouter;
