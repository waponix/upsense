import {Endpoint} from "../../../components/graphql/Endpoint";
import {ApiAuthChecker} from "../../../components/security/ApiAuthChecker";
import {UserResolver} from "../resolvers/UserResolver";

export const UserEndpoints = (app: any) => {
    return new Endpoint({
        app,
        path: '/v1/graphql/user',
        resolvers: [UserResolver],
        jwtAuthEnabled: true,
        authChecker: ApiAuthChecker
    });
};
