import {BaseRepository} from "../../shared/repositories/BaseRepository";
import {Hub} from "../../shared/entities/Hub";

export class HubRepository extends BaseRepository
{
    async findOneBy(options: any, relations: any = null): Promise<Hub | undefined> {
        if (relations !== null) {
            options.relations = relations;
        }
        options = {where: options};
        return await this.repository.findOne(options);
    }

    async save(hub: Hub) {
        await this.repository.save(hub);
    }
}
