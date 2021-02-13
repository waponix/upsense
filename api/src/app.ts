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

// import { SensorResolver } from './v1/resolvers/SensorResolver';

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

            // Add GraphQL endpoints here
            await AuthEndpoints(this.app).init();
            await AdminEndpoints(this.app).init();
            await ManagerEndpoints(this.app).init();
            await UserEndpoints(this.app).init();

            // register rest endpoints
            this.registerRoutes(restRouter);
            // await this.initWebsocketServer();
        } catch (e) {
            console.log(`Server failed to start: ${e}`)
        }
    }

/*    private async initWebsocketServer()
    {
        const schema = await buildSchema({
            resolvers: [
                SensorResolver
            ],
            authChecker: () => true
        });
        this.websocketServer = new SubscriptionServer({
            execute,
            subscribe,
            schema,
        }, {
            server: this.httpServer,
            path: '/subscriptions'
        });
    }*/

  /*  private async initApiAuthServer()
    {
        this.app.use(
            '/api/v1/graphql/auth',
            this.jwt.optional
        );

        const schema = await buildSchema({
            resolvers: [
                AuthResolver
            ],
            authChecker: () => true
        });

        this.apiAuthServer = new ApolloServer({ schema });
        this.apiAuthServer.applyMiddleware({ app: this.app, path: '/api/v1/graphql/auth'});
    }

    private async initApiServer()
    {
        this.app.use(
            '/api/v1/graphql',
            this.jwt.required,
            this.jwt.authenticationErrorHandler,
        );

        this.apiServer = new ApolloServer({
            schema,
            context: (args: any) => {
                const { user } = args.req.user || { user: null };
                return { user };
            }
        });
        this.apiServer.applyMiddleware({ app: this.app, path: '/api/v1/graphql' });
    }*/

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
