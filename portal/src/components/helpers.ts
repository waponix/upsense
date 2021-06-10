import {Request} from "express";
import querystring from "querystring";

export const GetQuery = (request: Request) => {
    return querystring.stringify({query: JSON.stringify(request.body.query)})
}
