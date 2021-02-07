import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createConnection } from 'typeorm';
import { buildSchema } from 'type-graphql';
import { appConfig } from './config';
import { JwtAuth } from './components/security/JwtAuth';
import { ApiAuthChecker } from './components/security/ApiAuthChecker';
import { ApolloServer } from 'apollo-server-express';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';

// Import Resolvers
import { AuthResolver } from './v1/resolvers/AuthResolver';
import { AdminResolver } from './v1/resolvers/AdminResolver';
import { CompanyResolver } from './v1/resolvers/CompanyResolver';
import { ManagerResolver } from "./v1/resolvers/ManagerResolver";
import { UserRepository } from "./v1/repositories/UserRepository";
import {UserResolver} from "./v1/resolvers/UserResolver";

// import { SensorResolver } from './v1/resolvers/SensorResolver';

class App
{
    connection: any;
    app: any;
    httpServer: any;
    websocketServer: any;
    apiServer: any;
    apiAuthServer: any;
    jwt: any;

    constructor()
    {
        this.jwt = new JwtAuth();
        this.initServer()
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

        // listen to the configured port number
        await this.httpServer.listen(appConfig.port);

        console.log(`API Server running at port ${appConfig.port}`);

        await this.initApiAuthServer();
        await this.initApiServer();
        // await this.initWebsocketServer();
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

    private async initApiAuthServer()
    {
        this.app.use(
            '/api/graphql/auth',
            this.jwt.optional
        );

        const schema = await buildSchema({
            resolvers: [
                AuthResolver
            ],
            authChecker: () => true
        });

        this.apiAuthServer = new ApolloServer({ schema });
        this.apiAuthServer.applyMiddleware({ app: this.app, path: '/api/graphql/auth'});
    }

    private async initApiServer()
    {
        this.app.use(
            '/api/graphql',
            this.jwt.required,
            this.jwt.authenticationErrorHandler,
        );

        const schema = await buildSchema({
            resolvers: [
                AdminResolver,
                ManagerResolver,
                UserResolver,
                CompanyResolver,
                // SensorResolver
            ],
            authChecker: ApiAuthChecker,
        });

        this.apiServer = new ApolloServer({
            schema,
            context: (args: any) => {
                const { user } = args.req.user || { user: null };
                return { user };
            }
        });
        this.apiServer.applyMiddleware({ app: this.app, path: '/api/graphql' });
    }
}

new App();
