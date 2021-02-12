import {Connection, EntityManager, QueryRunner, Repository} from "typeorm";
import {SortType} from "../../../components/types/SortOrderTypes";
import {BaseEntity} from "../../entities/BaseEntity";

export interface ListQueryOptions {
    builder?: any;
    fields?: string[];
}

export interface ListOptions {
    filters?: {},
    sort?: SortType,
    page?: number,
    find?: string,
}

export abstract class BaseRepository {
    protected connection!: Connection;
    public queryRunner!: QueryRunner;
    public manager!: EntityManager;

    /**
     * Initialize the repository
     * Note: always call this function when injecting in the resolver
     * @param connection
     */
    public async init (connection: Connection) {
        this.connection = connection;
        this.queryRunner = await this.connection.createQueryRunner();
        this.manager = await this.queryRunner.manager;

        return this;
    }
}
