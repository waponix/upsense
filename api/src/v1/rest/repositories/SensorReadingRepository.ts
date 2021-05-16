import {BaseRepository} from "../../shared/repositories/BaseRepository";
import {SensorReading} from "../../shared/entities/SensorReading";

export class SensorReadingRepository extends BaseRepository
{
    async save(sensorReading: SensorReading) {
        await this.repository.save(sensorReading);
    }
}
