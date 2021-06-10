import {NextFunction, Request, Response} from "express";

export const GlobalVariablesHandler = (request: Request, response: Response, next: NextFunction) =>
{
    response.locals.activeMenu = request.originalUrl;
    next();
}
