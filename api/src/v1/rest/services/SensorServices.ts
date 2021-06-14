import {SensorRepository} from "../repositories/SensorRepository";
import {Sensor} from "../../shared/entities/Sensor";
import {Request} from "express";
import {ApiResponse} from "../objects/ApiResponse";
import {ReturnableResponse} from "../objects/ReturnableResponse";
import {Status} from "../../../components/types/ResponseStatusTypes";
import {CommonMessages} from "../../../messages/messages";
import {sensorCreateValidation, sensorUpdateValidation} from "../validators/SensorValidator";
import {Hub} from "../../shared/entities/Hub";
import {HubRepository} from "../repositories/HubRepository";

export default class SensorServices
{
    private user: any;
    private sensorRepository: SensorRepository;
    private hubRepository: HubRepository;

    constructor(user: any)
    {
        this.user = user;
        this.sensorRepository = new SensorRepository(Sensor);
        this.hubRepository = new HubRepository(Hub);
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
        result = result.map((record: Sensor) => record.serialize());

        apiResponse.result = result;

        await this.sensorRepository.queryRunner.release();

        return new ReturnableResponse(200, apiResponse);
    }

    async getOne(request: Request): Promise<ReturnableResponse>
    {
        let statusCode: number = 200;
        let apiResponse: ApiResponse = new ApiResponse();

        const {id} = request.params;

        await this.sensorRepository.init();
        let sensor: Sensor | undefined = undefined;
        if (!isNaN(parseInt(id))) {
            sensor = await this.sensorRepository.findOneBy({id: parseInt(id)}, ['hub']);
        }

        if (sensor === undefined) {
            apiResponse.status = Status.NotFound;
            apiResponse.message = CommonMessages.NotFound('Sensor');
            statusCode = 404;
        } else {
            apiResponse.result = sensor.serialize();
        }

        await this.sensorRepository.queryRunner.release();

        return new ReturnableResponse(statusCode, apiResponse);
    }

    async create(request: Request): Promise<ReturnableResponse>
    {
        let apiResponse: ApiResponse = new ApiResponse();
        let statusCode: number = 201;
        const data = request.body.data || {};

        // do validation before proceed
        let validation = sensorCreateValidation(data);

        return new Promise(resolve => {
            validation.checkAsync(async () => {
                // success callback
                await this.sensorRepository.init();
                await this.sensorRepository.queryRunner.startTransaction();

                if (data.hub) {
                    await this.hubRepository.init();
                    const hub: Hub | undefined = await this.hubRepository.findOneBy({id: parseInt(data.hub)});
                    data.hub = hub;
                    await this.hubRepository.queryRunner.release();
                }

                try {
                    const sensor: Sensor = await this.sensorRepository.create(data);
                    await this.sensorRepository.queryRunner.commitTransaction();

                    apiResponse.result = sensor.serialize();
                } catch (e) {
                    apiResponse.status = Status.Error;
                    apiResponse.message = CommonMessages.UnableToSave('Hub');
                    await this.sensorRepository.queryRunner.rollbackTransaction();
                    statusCode = 500;
                } finally {
                    await this.sensorRepository.queryRunner.release();
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

    async update(request: Request): Promise<ReturnableResponse>
    {
        let apiResponse: ApiResponse = new ApiResponse();
        let statusCode: number = 200;
        const {id} = request.params;
        const data = request.body.data || {};

        await this.sensorRepository.init();
        let sensor: Sensor | undefined = undefined;
        if (!isNaN(parseInt(id))) {
            sensor = await this.sensorRepository.findOneBy({id: parseInt(id)});
        }

        if (sensor === undefined) {
            apiResponse.status = Status.NotFound;
            apiResponse.message = CommonMessages.NotFound('Sensor');
            statusCode = 404;

            return new ReturnableResponse(statusCode, apiResponse);
        }

        let validation = sensorUpdateValidation(data);

        return new Promise(resolve => {
            validation.checkAsync(async () => {
                await this.sensorRepository.queryRunner.startTransaction();

                if (data.hub) {
                    await this.hubRepository.init();
                    const hub: Hub | undefined = await this.hubRepository.findOneBy({id: parseInt(data.hub)});
                    data.hub = hub;
                    await this.hubRepository.queryRunner.release();
                }

                try {
                    //@ts-ignore
                    await this.sensorRepository.update(sensor, data);
                    await this.sensorRepository.queryRunner.commitTransaction();

                    sensor = await this.sensorRepository.findOneBy({id: parseInt(id)});
                    apiResponse.result = sensor?.serialize();
                } catch {
                    await this.sensorRepository.queryRunner.rollbackTransaction();
                    apiResponse.status = Status.Error;
                    apiResponse.message = CommonMessages.UnableToUpdate('Sensor');
                    statusCode = 500;
                } finally {
                    await this.sensorRepository.queryRunner.release();
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
