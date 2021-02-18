import {Request} from 'express';
import {paginationConfig} from "../../../config";
import {SortType} from "../../../components/types/SortOrderTypes";

export default class ApiFilter
{
    search?: string = '';
    offset: number = 1;
    limit: number = paginationConfig.limit;
    filter: any = {};
    sort?: SortType;
    order: any = ['asc'];

    constructor(request: Request)
    {
        for (let key in request.params) {
            switch(key.toLowerCase()) {
                case 'query': this.search = request.params.query; break;
                case 'page': this.offset = this.limit * parseInt((<any>request.params).page); break;
                case 'sort': this.sort = (<any>request.params).sort.split(','); break;
                case 'order': this.order = (<any>request.params).order.split(','); break;
                default: this.filter[key] = request.params[key];
            }
        }
    }

    public getArgs()
    {
        let args = {
            skip: this.offset,
            take: this.limit
        };

        return args;
    }
}
