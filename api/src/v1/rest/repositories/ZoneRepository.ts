import {BaseRepository} from "../../shared/repositories/BaseRepository";
import {Zone} from "../../shared/entities/Zone";

export class ZoneRepository extends BaseRepository
{
    async create(data: any): Promise<Zone>
    {
        const repository = await this.repository;
        let zone: Zone = new Zone();
        zone.name = data.name;
        zone.company = data.company;
        await repository.save(zone);
        return zone;
    }
}
