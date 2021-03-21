import {ZoneRepository} from "../repositories/ZoneRepository";
import {Zone} from "../../shared/entities/Zone";
import {ReturnableResponse} from "../objects/ReturnableResponse";
import {ApiResponse} from "../objects/ApiResponse";
import {Request} from "express";

export default class ZoneServices
{
    private user: any;
    private zoneRepository: ZoneRepository;

    constructor(user: any)
    {
        this.user = user;
        this.zoneRepository = new ZoneRepository(Zone);
    }

    async create(request: Request)
    {
        let apiResponse: ApiResponse = new ApiResponse();
        let statusCode: number = 200;
        const {data} = request.body;

        await this.zoneRepository.init();
        await this.zoneRepository.queryRunner.startTransaction();
        try {
            const zone: Zone = await this.zoneRepository.create(data);
            await this.zoneRepository.queryRunner.commitTransaction();
            apiResponse.result = zone.serialize();
        } catch (e) {
            await this.zoneRepository.queryRunner.rollbackTransaction();
        } finally {
            await this.zoneRepository.queryRunner.release();
        }

        return new ReturnableResponse(statusCode, apiResponse);
    }
}
