import {BaseRepository} from "../../shared/repositories/BaseRepository";
import {Log} from "../../shared/entities/Log";

export class LogRepository extends BaseRepository
{
    async create(data: Partial<Log>): Promise<Log>
    {
        let log: Log = new Log();

        log.sensor = data.sensor!;
        log.message = data.message!;
        log.maxTemp = data.maxTemp!;
        log.minTemp = data.minTemp!;
        log.recordedTemp = data.recordedTemp!;

        await this.repository.save(log);

        return log;
    }
}
