import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createConnection, Connection } from 'typeorm';
import { buildSchema } from 'type-graphql';
import { appConfig } from './config';
import { JwtAuth } from './components/security/JwtAuth';
import { ApiAuthChecker } from './components/security/ApiAuthChecker';

// Import Resolvers
import { AuthResolver } from './v1/resolvers/AuthResolver';
import { AdminResolver } from './v1/resolvers/AdminResolver';
import { CompanyResolver } from './v1/resolvers/CompanyResolver';

const { ApolloServer } = require('apollo-server-express');

class App
{
    connection: any;
    apiSchema: any;
    apiAuthSchema: any;
    app: any;
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
        this.connection = await createConnection();

        this.app = express();
        this.app.use(
            cors(), // enable cross-origin
            bodyParser.json(), // support application/json type post data
            bodyParser.urlencoded({ extended: true }), //support application/x-www-form-urlencoded post data)
        );

        await this.initApiAuthServer();
        await this.initApiServer();

        // listen to the configured port number
        this.app.listen(appConfig.port, () => console.log(`API Server running at port ${appConfig.port}`));
    }

    private async initApiAuthServer()
    {
        this.app.use(
            '/api/graphql/auth',
            this.jwt.optional
        );

        this.apiAuthSchema = await buildSchema({
            resolvers: [
                AuthResolver
            ],
            authChecker: () => true
        });

        this.apiAuthServer = new ApolloServer({
            schema: this.apiAuthSchema
        });

        this.apiAuthServer.applyMiddleware({ app: this.app, path: '/api/graphql/auth' });
    }

    private async initApiServer()
    {
        this.app.use(
            '/api/graphql',
            this.jwt.required,
            this.jwt.authenticationErrorHandler,
        );

        this.apiSchema = await buildSchema({
            resolvers: [
                AdminResolver,
                CompanyResolver,
            ],
            authChecker: ApiAuthChecker,
        });

        this.apiServer = new ApolloServer({
            schema: this.apiSchema,
            context: (args: any) => {
                const user = args.req.user.user || null;
                return { user };
            }
        });

        this.apiServer.applyMiddleware({ app: this.app, path: '/api/graphql' });
    }
}

const APP = new App();
