import {NextFunction, Response, Request} from "express";
import {UserRoleTypes} from "../types/UserRoleTypes";
import {ApiResponse} from "../../v1/rest/objects/ApiResponse";
import {Status} from "../types/ResponseStatusTypes";
import {AuthMessages} from "../../messages/messages";

// Set authorization for each route
export const authorize = (roles: UserRoleTypes | UserRoleTypes[]) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (request: Request, response: Response, next: NextFunction) => {
        const user = (<any>request).user;

        if (roles.indexOf(user.role) < 0) {
            let apiResponse: ApiResponse = new ApiResponse();
            apiResponse.status = Status.Forbidden;
            apiResponse.message = AuthMessages.InsufficientPermission;

            response
                .status(403)
                .json(apiResponse);
        }

        next();
    }
}
