import {Request} from "express";
import querystring from "querystring";

export const GetQuery = (request: Request) => {
    return querystring.stringify({query: JSON.stringify(request.body.query)})
}

export const PrepareQuery = (query: any) => {
    return querystring.stringify({query: JSON.stringify(query)});
}

export const GetTableSorting = (request: Request) => {
    const tableInfo = request.body;
    const sortColumn = tableInfo[`mDataProp_${tableInfo.iSortCol_0}`];

    return {[sortColumn]: tableInfo.sSortDir_0.toString().toUpperCase()};
}
