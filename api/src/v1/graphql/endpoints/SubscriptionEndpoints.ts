import {Endpoint} from "../../../components/graphql/Endpoint";
import {SensorResolver} from "../resolvers/SensorResolver";


export const SubscriptionEndpoints = (app: any, server: any) => {
    return new Endpoint({
        app,
        path: '/v1/graphql/subscriptions',
        resolvers: [SensorResolver],
        subscriptionServer: server
    });
};
