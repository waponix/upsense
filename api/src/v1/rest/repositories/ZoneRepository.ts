import {BaseRepository, QueryOptions} from "../../shared/repositories/BaseRepository";
import {Zone} from "../../shared/entities/Zone";
import {miscConfig, paginationConfig} from "../../../config";
import {Hub} from "../../shared/entities/Hub";

export class ZoneRepository extends BaseRepository
{
    private searchableFields: string[] = ['name'];

    /**
     * @param companyId
     * @param options
     */
    async getList(companyId: number, options: QueryOptions = {}): Promise<any> {
        let parameters: any = { companyId, defaultZone: miscConfig.defaultZone };
        let whereStatements: any = [
            'z.name != :defaultZone',
            'z.company = :companyId'
        ];

        const offset = options.page ? paginationConfig.limit * (options.page - 1) : 0;

        const query = await this
            .createQueryBuilder('z')
            .select([
                'z.id',
                'z.name',
                'z.updatedAt',
                'z.createdAt'
            ]);

        // create filters if provided
        if (!!options.filters) {
            for (const [field, value] of Object.entries(options.filters)) {
                whereStatements.push(`z.${field} = :${field}`);
                parameters[field] = value;
            }
        }

        // add sort and
        if (!!options.sort) {
            for (const [field, value] of Object.entries(options.sort)) {
                query.addOrderBy(`z.${field}`, value)
            }
        }

        // create search statement if find is provided
        if (!!options.find) {
            parameters.find = `%${options.find}%`;
            let searchStatement = [];

            for (const field of this.searchableFields) {
                searchStatement.push(`z.${field} LIKE :find`);
            }

            whereStatements.push(`(${searchStatement.join(' OR ')})`);
        }

        do {
            if (options.relations === undefined) {
                break;
            }

            if (options.relations.indexOf('users') > -1) {
                query
                    .leftJoinAndSelect('z.users', 'u');
            }

            break;
        } while (true);

        if (whereStatements.length > 0) {
            query
                .where(whereStatements.join(' AND '))
                .setParameters(parameters);
        }

        const totalCount = await this.getCount(query);

        query
            .offset(offset)
            .limit(paginationConfig.limit);

        const data = await query.getMany();

        return {
            totalCount: totalCount,
            count: data.length,
            data: data
        }
    }

    /**
     *
     * @param data
     */
    async create(data: any): Promise<Zone>
    {
        let zone: Zone = new Zone();
        zone.name = data.name;

        if (data.company) {
            zone.company = data.company;
        }

        await this.repository.save(zone);
        return zone;
    }

    /**
     *
     * @param company
     * @param data
     */
    async update(zone: Zone, data: Partial<Zone>): Promise<boolean>
    {
        zone.name = data.name || zone.name;

        await this.repository.save(zone);

        return true;
    }

    /**
     *
     * @param idads
     */
    async findOneById(id: number): Promise<Zone | undefined>
    {
        return await this.repository.findOne({where: { id }});
    }

    async findOneBy(options: any, relations: any = null): Promise<Zone | undefined>
    {
        options = {where: options};
        if (relations !== null) {
            options.relations = relations;
        }
        return await this.repository.findOne(options);
    }

    async findOneByHub(hub: Hub): Promise<Zone | undefined>
    {
        return this
            .createQueryBuilder('z')
            .innerJoin('z.hubs', 'h')
            .where('h.id = :hubId')
            .setParameter('hubId', hub.id)
            .getOne();
    }

    /**
     *
     * @param zone
     */
    async delete(zone: Zone): Promise<boolean>
    {
        await this.repository.remove(zone);
        return true;
    }

    async findIfZoneBelongsToCompany(zoneId: number, companyId: number): Promise<Zone | undefined>
    {
        return this
            .createQueryBuilder('z')
            .leftJoin('z.company', 'c')
            .where('z.id = :zoneId')
            .andWhere('c.id = :companyId')
            .setParameters({
                zoneId,
                companyId
            })
            .getOne();
    }

    private async getCount(query: any): Promise<number>
    {
        let queryClone = Object.create(query);

        return await queryClone.getCount();
    }
}
