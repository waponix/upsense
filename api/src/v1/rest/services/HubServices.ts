import {HubRepository} from "../repositories/HubRepository";
import {Request} from "express";
import {ReturnableResponse} from "../objects/ReturnableResponse";
import {ApiResponse} from "../objects/ApiResponse";
import {Hub} from "../../shared/entities/Hub";
import {Status} from "../../../components/types/ResponseStatusTypes";
import {CommonMessages} from "../../../messages/messages";
import {hubUpdateValidation} from "../validators/HubValidator";
import {Zone} from "../../shared/entities/Zone";
import {ZoneRepository} from "../repositories/ZoneRepository";

export default class HubServices
{
    private user: any;
    private hubRepository: HubRepository;
    private zoneRepository: ZoneRepository;

    constructor(user: any)
    {
        this.user = user;
        this.hubRepository = new HubRepository(Hub);
        this.zoneRepository = new ZoneRepository(Zone);
    }

    async getList(request: Request): Promise<ReturnableResponse> {
        let apiResponse: ApiResponse = new ApiResponse();

        let query = {};
        if ((<any>request).query.query !== undefined) {
            query = JSON.parse((<any>request).query.query);
        }

        await this.hubRepository.init();

        let result: any[] = await this.hubRepository.getList(query);
        console.log(result);
        result = result.map((record: Hub) => record.serialize());

        apiResponse.result = result;

        await this.hubRepository.queryRunner.release();

        return new ReturnableResponse(200, apiResponse);
    }

    async getOne(request: Request): Promise<ReturnableResponse>
    {
        let statusCode: number = 200;
        let apiResponse: ApiResponse = new ApiResponse();

        const {id} = request.params;

        await this.hubRepository.init();
        const hub: Hub | undefined = await this.hubRepository.findOneBy({id: parseInt(id)}, ['zone']);

        if (hub === undefined) {
            apiResponse.status = Status.NotFound;
            apiResponse.message = CommonMessages.NotFound('Hub');
            statusCode = 404;
        } else {
            apiResponse.result = hub.serialize();
        }

        await this.hubRepository.queryRunner.release();

        return new ReturnableResponse(statusCode, apiResponse);
    }

    async update(request: Request): Promise<ReturnableResponse>
    {
        let apiResponse: ApiResponse = new ApiResponse();
        let statusCode: number = 200;
        const {id} = request.params;
        const {data} = request.body;

        await this.hubRepository.init();
        let hub: Hub | undefined = await this.hubRepository.findOneBy({id: parseInt(id)});

        if (hub === undefined) {
            apiResponse.status = Status.NotFound;
            apiResponse.message = CommonMessages.NotFound('Hub');
            statusCode = 404;

            return new ReturnableResponse(statusCode, apiResponse);
        }

        let validation = hubUpdateValidation(data);

        return new Promise(resolve => {
            validation.checkAsync(async () => {
                await this.hubRepository.queryRunner.startTransaction();

                if (data.zone) {
                    await this.zoneRepository.init();
                    const zone: Zone | undefined = await this.zoneRepository.findOneBy({id: parseInt(data.zone)});
                    data.zone = zone;
                    await this.zoneRepository.queryRunner.release();
                }

                try {
                    //@ts-ignore
                    await this.hubRepository.update(hub, data);
                    await this.hubRepository.queryRunner.commitTransaction();

                    hub = await this.hubRepository.findOneById(parseInt(id));
                    apiResponse.result = hub?.serialize();
                } catch {
                    await this.hubRepository.queryRunner.rollbackTransaction();
                    apiResponse.status = Status.Error;
                    apiResponse.message = CommonMessages.UnableToUpdate('Hub');
                    statusCode = 500;
                } finally {
                    await this.hubRepository.queryRunner.release();
                }

                resolve(new ReturnableResponse(statusCode, apiResponse));
            }, () => {
                // fail callback
                apiResponse.status = Status.BadRequest;
                apiResponse.message = CommonMessages.ArgumentValuesIncorrect;
                apiResponse.error = validation.errors.all();
                statusCode = 400;

                resolve(new ReturnableResponse(statusCode, apiResponse));
            });
        });
    }
}
