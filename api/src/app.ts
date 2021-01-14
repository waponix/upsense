import 'reflect-metadata';
import express, {Application, Router, Request, Response, NextFunction} from 'express';
import bodyParser from 'body-parser';
import router from './router';
import cors from 'cors';

const PORT_NUMBER: number = 8443;

class App {
    app: Application;

    //Configure isProduction variable
    isProduction: boolean = process.env.NODE_ENV === 'production';

    constructor ()
    {
        // initializing express in this application
        this.app = express();

        // support application/json type post data
        this.app.use(bodyParser.json());

        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: true }));

        // enable cors
        this.app.use('/api', cors());
    }

    /**
     * Register the routes
     * @param routes
     */
    registerRoutes (routes: Router) {
        this.security(routes);
        return this;
    }

    security (routes: Router)
    {
        this.app.use('/', routes);
    }

    /**
     * Initialize the server
     * @param port
     */
    initServer (port: number)
    {
        this.app.listen(port, () => console.log('Server running at port: ' + port));
        return this;
    }
}

const app: App = new App();

app
    .initServer(PORT_NUMBER)
    .registerRoutes(router);


