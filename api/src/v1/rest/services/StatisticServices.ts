import {Request} from "express";
import {SensorRepository} from "../repositories/SensorRepository";
import {Sensor} from "../../shared/entities/Sensor";
import {SensorStatus} from "../../../components/types/SensorStatus";
import {ReturnableResponse} from "../objects/ReturnableResponse";
import {ApiResponse} from "../objects/ApiResponse";
import {NotificationLogRepository} from "../repositories/NotificationLogRepository";
import {NotificationLog} from "../../shared/entities/NotificationLog";

export default class StatisticServices
{
    private user: any;
    private sensorRepository: SensorRepository;
    private notificationLogRepository: NotificationLogRepository;

    constructor(user: any)
    {
        this.user = user;
        this.sensorRepository = new SensorRepository(Sensor);
        this.notificationLogRepository = new NotificationLogRepository(NotificationLog);
    }

    async getDashboardData(request: Request): Promise<ReturnableResponse>
    {
        const apiResponse: ApiResponse = new ApiResponse();
        let statusCode = 200;

        await this.sensorRepository.init();

        const healthySensorCount: number = await this.sensorRepository.getSensorCountByStatus(SensorStatus.healthy, this.user);
        const warningSensorCount: number = await this.sensorRepository.getSensorCountByStatus(SensorStatus.warning, this.user);
        const totalSensors: number = await this.sensorRepository.getSensorCount(this.user);

        await this.sensorRepository.queryRunner.release();

        await this.notificationLogRepository.init();

        const notifications: NotificationLog[] = await this.notificationLogRepository.getLatestRecords(this.user, 5);

        await this.notificationLogRepository.queryRunner.release();

        apiResponse.result = {
            totalSensors: totalSensors,
            healthy: healthySensorCount,
            warning: warningSensorCount,
            notifications: notifications
        }

        return new ReturnableResponse(statusCode, apiResponse);
    }
}
