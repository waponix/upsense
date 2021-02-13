import {Endpoint} from "../../../components/graphql/Endpoint";
import {ApiAuthChecker} from "../../../components/security/ApiAuthChecker";
import {AdminResolver} from "../resolvers/AdminResolver";

export const AdminEndpoints = (app: any) => {
    return new Endpoint({
        app,
        path: '/api/v1/graphql/admin',
        resolvers: [AdminResolver],
        jwtAuthEnabled: true,
        authChecker: ApiAuthChecker
    });
};
