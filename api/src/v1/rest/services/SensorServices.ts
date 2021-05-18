import {SensorRepository} from "../repositories/SensorRepository";
import {Sensor} from "../../shared/entities/Sensor";
import {Request} from "express";
import {ApiResponse} from "../objects/ApiResponse";
import {Hub} from "../../shared/entities/Hub";
import {ReturnableResponse} from "../objects/ReturnableResponse";

export default class SensorServices
{
    private user: any;
    private sensorRepository: SensorRepository;

    constructor(user: any)
    {
        this.user = user;
        this.sensorRepository = new SensorRepository(Sensor);
    }

    async getList(request: Request)
    {
        let apiResponse: ApiResponse = new ApiResponse();

        let query = {};
        if ((<any>request).query.query !== undefined) {
            query = JSON.parse((<any>request).query.query);
        }

        await this.sensorRepository.init();

        let result: any[] = await this.sensorRepository.getList(query);
        result = result.map((record: Hub) => record.serialize());

        apiResponse.result = result;

        await this.sensorRepository.queryRunner.release();

        return new ReturnableResponse(200, apiResponse);
    }
}
