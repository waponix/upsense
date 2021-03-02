import 'reflect-metadata';
import express, {Router} from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import restRouter from "./restRouter";
import { createConnection } from 'typeorm';
import { buildSchema } from 'type-graphql';
import { appConfig } from './config';
import { JwtAuth } from './components/security/JwtAuth';
import { ApiAuthChecker } from './components/security/ApiAuthChecker';
import { ApolloServer } from 'apollo-server-express';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';

// Import Graphql Endpoints
import {AuthEndpoints} from "./v1/graphql/endpoints/AuthEndpoints";
import {AdminEndpoints} from "./v1/graphql/endpoints/AdminEndpoints";
import {ManagerEndpoints} from "./v1/graphql/endpoints/ManagerEndpoints";
import {UserEndpoints} from "./v1/graphql/endpoints/UserEndpoint";

import { SensorResolver } from './v1/graphql/resolvers/SensorResolver';
import {SubscriptionEndpoints} from "./v1/graphql/endpoints/SubscriptionEndpoints";

class App
{
    connection: any;
    app: any;
    httpServer: any;
    jwt: any;

    constructor()
    {
        this.jwt = new JwtAuth();

        this.initServer();
    }

    private async initServer()
    {
        try {
            this.connection = await createConnection();
        } catch (e:any) {
            console.log(`Database connection failed: ${e.message}`);
        }

        this.app = express();
        this.httpServer = createServer(this.app);
        this.app.use(
            cors(), // enable cross-origin
            bodyParser.json(), // support application/json type post data
            bodyParser.urlencoded({ extended: true }), //support application/x-www-form-urlencoded post data)
        );

        try {
            // listen to the configured port number
            await this.httpServer.listen(appConfig.port);

            console.log(`API Server running at port ${appConfig.port}`);

            this.registerRoutes(restRouter);

            // Add GraphQL endpoints here
            await AuthEndpoints(this.app).init();
            await AdminEndpoints(this.app).init();
            await ManagerEndpoints(this.app).init();
            await UserEndpoints(this.app).init();
            await SubscriptionEndpoints(this.app, this.httpServer).init();
            //
            // new SubscriptionServer({
            //     execute,
            //     subscribe,
            //     schema: subscriptionEndpoint.schema,
            // }, {
            //     server: this.httpServer,
            //     path: '/'
            // });

            // register rest endpoints
        } catch (e) {
            console.log(`Server failed to start: ${e}`)
        }
    }
    /**
     * Register the rest api routes
     * @param routes
     */
    public registerRoutes (routes: Router) {
        this.security(routes);
        return this;
    }

    private security (routes: Router)
    {
        this.app.use('/', routes);
    }
}

new App();
