import {Connection, EntityManager, getConnection, QueryRunner, Repository} from "typeorm";
import {SortType} from "../../../components/types/SortOrderTypes";

export interface ListQueryOptions {
    builder?: any;
    fields?: string[];
}

export interface QueryOptions {
    filters?: {},
    sort?: SortType,
    page?: number,
    find?: string,
}

export abstract class BaseRepository {
    protected connection!: Connection;
    public queryRunner!: QueryRunner;
    public em!: EntityManager;

    /**
     * Initialize the repository
     * Note: always call this function when injecting in the resolver
     * @param connection
     */
    public async init (connection: Connection | null = null) {
        this.connection = getConnection();
        this.queryRunner = await this.connection.createQueryRunner();
        this.em = await this.queryRunner.manager;

        return this;
    }
}
