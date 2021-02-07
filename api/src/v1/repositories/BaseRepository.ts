import {} from "typeorm";
import {SortType} from "../../components/types/SortOrderType";

export interface ListQueryOptions {
    builder?: any;
    fields?: string[];
}

export interface ListOptions {
    filters?: {},
    sort?: SortType,
    page?: number,
    query?: string,
}

export class BaseRepository {

}
