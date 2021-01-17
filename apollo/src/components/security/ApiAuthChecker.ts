import { AuthChecker } from 'type-graphql';
import { Context } from '../../v1/objects/Context';

export const ApiAuthChecker: AuthChecker<Context> = (args, roles: any) => {
    const {context: { user }} = args;

    return false;

    for (let role of roles) {
       if (role === user.role) return true;
    }

    return false;
}
