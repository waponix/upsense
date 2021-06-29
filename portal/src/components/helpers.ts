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
    const colCount = parseInt(tableInfo.iColumns);
    let sort: any = {};

    for (let index = 0; index < colCount; index++) {
        // check if column is sortable
        if (tableInfo[`bSortable_${index}`] === 'true') {
            // add it to sort array
            sort[tableInfo[`mDataProp_${index}`]] = tableInfo[`sSortDir_${index - 1}`].toString().toUpperCase();
        }
    }

    return sort;
}
