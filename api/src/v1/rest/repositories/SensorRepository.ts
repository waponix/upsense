import {BaseRepository} from "../../shared/repositories/BaseRepository";
import {Sensor} from "../../shared/entities/Sensor";

export class SensorRepository extends BaseRepository
{
    async findOneBy(where: any): Promise<Sensor | undefined> {
        return await this.repository.findOne({ where });
    }

    async save(sensor: Sensor) {
        await this.repository.save(sensor);
    }
}
