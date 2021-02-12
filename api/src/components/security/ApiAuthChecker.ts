import { AuthChecker } from 'type-graphql';
import {Context} from "../../v1/graphql/objects/Context";

/**
 * Note: this function should return true to grant access
 *
 * @param args
 * @param roles
 * @constructor
 */
export const ApiAuthChecker: AuthChecker<Context> = (args, roles: any) => {
    const {context: { user }} = args;

    for (let role of roles) {
       if (role === user.role) return true;
    }

    return false;
}
