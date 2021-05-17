import {BaseRepository} from "../../shared/repositories/BaseRepository";
import {Sensor} from "../../shared/entities/Sensor";

export class SensorRepository extends BaseRepository
{
    async findOneBy(options: any, relations: any = null): Promise<Sensor | undefined> {
        options = {where: options};
        if (relations !== null) {
            options.relations = relations;
        }
        return await this.repository.findOne(options);
    }

    async save(sensor: Sensor) {
        await this.repository.save(sensor);
    }
}
