import 'reflect-metadata';
import express, {Router} from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import restRouter from "./restRouter";
import { appConfig } from './config';
import { JwtAuth } from './components/security/JwtAuth';
import { createServer } from 'http';
import {initConnection} from './components/Connection';

import {SubscriberApp} from "./mqtt";

class App
{
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
        this.app = express();
        this.httpServer = createServer(this.app);
        this.app.use(
            '/',
            cors({
                exposedHeaders: ['X-CSRF-TOKEN', 'X-Requested-With']
            }), // enable cross-origin
            bodyParser.json(), // support application/json type post data
            bodyParser.urlencoded({ extended: true }), //support application/x-www-form-urlencoded post data)
        );

        try {
            // listen to the configured port number
            await this.httpServer.listen(appConfig.port);
            initConnection();
            console.log(`API Server running at port ${appConfig.port}`);

            this.registerRoutes(restRouter);

            new SubscriberApp();
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
