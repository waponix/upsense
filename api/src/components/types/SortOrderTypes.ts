export type OrderType = 'ASC' | 'DESC';

export type SortType = {
    [key: string]: OrderType;
}
