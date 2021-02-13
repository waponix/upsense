import {Endpoint} from "../../../components/graphql/Endpoint";
import {ApiAuthChecker} from "../../../components/security/ApiAuthChecker";
import {ManagerResolver} from "../resolvers/ManagerResolver";

export const ManagerEndpoints = (app: any) => {
    return new Endpoint({
        app,
        path: '/api/v1/graphql/manager',
        resolvers: [ManagerResolver],
        jwtAuthEnabled: true,
        authChecker: ApiAuthChecker
    });
};
