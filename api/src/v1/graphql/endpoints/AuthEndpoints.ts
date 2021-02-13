import {Endpoint} from "../../../components/graphql/Endpoint";
import {AuthResolver} from "../resolvers/AuthResolver";

export const AuthEndpoints = (app: any) => {
    return new Endpoint({
        app,
        path: '/api/v1/graphql/auth',
        resolvers: [AuthResolver]
    });
};
