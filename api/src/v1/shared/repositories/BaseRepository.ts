import {Connection, EntityManager, getConnection, QueryBuilder, QueryRunner, Repository} from "typeorm";
import {SortType} from "../../../components/types/SortOrderTypes";
import {SelectQueryBuilder} from "typeorm/query-builder/SelectQueryBuilder";

export interface ListQueryOptions {
    builder?: any;
    fields?: string[];
}

export interface QueryOptions {
    filters?: {},
    sort?: SortType,
    page?: number,
    find?: string,
    relation?: string[]
}

export abstract class BaseRepository {
    protected connection!: Connection;
    public queryRunner!: QueryRunner;
    public em!: EntityManager;
    protected repository!: Repository<any>;
    private entity: any;
    private initialized: boolean = false;

    constructor(entity: any)
    {
        this.entity = entity;
    }

    /**
     * Initialize the repository
     * Note: always call this function when injecting in the resolver
     * @param connection
     */
    public async init (connection: Connection | null = null)
    {
        this.connection = getConnection();
        this.queryRunner = await this.connection.createQueryRunner();
        this.em = await this.queryRunner.manager;
        this.repository = await this.em.getRepository(this.entity);

        this.initialized = true

        return this;
    }

    protected createQueryBuilder(alias: string)
    {
        const repository = this.em.getRepository(this.entity);
        return (<Repository<any>>repository).createQueryBuilder(alias);
    }
}
