import {ApiResponse} from "../objects/ApiResponse";
import {ReturnableResponse} from "../objects/ReturnableResponse";
import {Request} from "express";
import {Status} from "../../../components/types/ResponseStatusTypes";
import {CommonMessages} from "../../../messages/messages";
import {ZoneRepository} from "../repositories/ZoneRepository";
import {Zone} from "../../shared/entities/Zone";
import {
    notificationSettingCreateValidation,
    notificationSettingUpdateValidation
} from "../validators/NotificationSettingValidator";
import {NotificationSettingRepository} from "../repositories/NotificationSettingRepository";
import {NotificationSetting} from "../../shared/entities/NotificationSetting";
import CompanyServices from "./CompanyServices";
import ZoneServices from "./ZoneServices";

export default class NotificationSettingServices
{
    private user: any;
    private zoneRepository: ZoneRepository;
    private notificationSettingRepository: NotificationSettingRepository;

    /**
     *
     * @param user
     */
    constructor(user: any) {
        this.user = user;
        this.zoneRepository = new ZoneRepository(Zone);
        this.notificationSettingRepository = new NotificationSettingRepository(NotificationSetting);
    }

    /**
     *
     * @param request
     */
    async getList(request: Request): Promise<ReturnableResponse> {
        const companyServices = new CompanyServices(this.user);
        // validate the company id if it belongs to the currently logged in user
        // @ts-ignore
        const validateResponse: boolean | ReturnableResponse = await companyServices.validateCompany(request);

        // @ts-ignore
        if (validateResponse !== true) {
            //@ts-ignore
            return validateResponse;
        }

        const zoneServices = new ZoneServices(this.user);
        // validate the company id if it belongs to the currently logged in user
        // @ts-ignore
        const validateResponse: boolean | ReturnableResponse = await zoneServices.validateZone(request);

        // @ts-ignore
        if (validateResponse !== true) {
            //@ts-ignore
            return validateResponse;
        }

        let apiResponse: ApiResponse = new ApiResponse();
        let query: any = {};
        if ((<any>request).query.query !== undefined) {
            query = JSON.parse((<any>request).query.query);
        }

        await this.notificationSettingRepository.init();
        let result: any[] = await this.notificationSettingRepository.getList(query);
        result = result.map((record: NotificationSetting) => record.serialize());

        apiResponse.result = result;

        await this.notificationSettingRepository.queryRunner.release();

        return new ReturnableResponse(200, apiResponse);
    }

    /**
     *
     * @param request
     */
    async getOne(request: Request): Promise<ReturnableResponse> {
        const companyServices = new CompanyServices(this.user);
        // validate the company id if it belongs to the currently logged in user
        // @ts-ignore
        const validateResponse: boolean | ReturnableResponse = await companyServices.validateCompany(request);

        // @ts-ignore
        if (validateResponse !== true) {
            //@ts-ignore
            return validateResponse;
        }

        const zoneServices = new ZoneServices(this.user);
        // validate the company id if it belongs to the currently logged in user
        // @ts-ignore
        const validateResponse: boolean | ReturnableResponse = await zoneServices.validateZone(request);

        // @ts-ignore
        if (validateResponse !== true) {
            //@ts-ignore
            return validateResponse;
        }

        await this.notificationSettingRepository.init();
        let apiResponse: ApiResponse = new ApiResponse();
        let statusCode = 200;
        const {id} = request.params;

        const notificationSetting: NotificationSetting | undefined = await this.notificationSettingRepository.findOneById(parseInt(id));

        if (notificationSetting === undefined) {
            apiResponse.status = Status.NotFound;
            apiResponse.message = CommonMessages.NotFound('Notification Setting');
            statusCode = 404;
        } else {
            apiResponse.result = notificationSetting.serialize();
        }

        await this.notificationSettingRepository.queryRunner.release();

        return new ReturnableResponse(statusCode, apiResponse);
    }

    /**
     *
     * @param request
     */
    async create(request: Request): Promise<ReturnableResponse> {
        const companyServices = new CompanyServices(this.user);
        // validate the company id if it belongs to the currently logged in user
        // @ts-ignore
        const validateResponse: boolean | ReturnableResponse = await companyServices.validateCompany(request);

        // @ts-ignore
        if (validateResponse !== true) {
            //@ts-ignore
            return validateResponse;
        }

        const zoneServices = new ZoneServices(this.user);
        // validate the company id if it belongs to the currently logged in user
        // @ts-ignore
        const validateResponse: boolean | ReturnableResponse = await zoneServices.validateZone(request);

        // @ts-ignore
        if (validateResponse !== true) {
            //@ts-ignore
            return validateResponse;
        }

        let apiResponse: ApiResponse = new ApiResponse();
        let statusCode: number = 200;
        const {data} = request.body;

        // do validation before proceed
        let validation = notificationSettingCreateValidation(data);

        return new Promise(resolve => {
            validation.checkAsync(async () => {
                // success callback
                await this.notificationSettingRepository.init();

                await this.notificationSettingRepository.queryRunner.startTransaction();

                await this.zoneRepository.init();
                const {zoneId} = request.params;
                const zone: Zone | undefined = await this.zoneRepository.findOneBy({id: parseInt(zoneId)});
                data.zone = zone;
                await this.zoneRepository.queryRunner.release();

                try {
                    const notificationSetting: NotificationSetting = await this.notificationSettingRepository.create(data);
                    await this.notificationSettingRepository.queryRunner.commitTransaction();

                    apiResponse.result = notificationSetting.serialize();
                } catch (e) {
                    apiResponse.status = Status.Error;
                    apiResponse.message = CommonMessages.UnableToSave('Notification Setting');
                    await this.notificationSettingRepository.queryRunner.rollbackTransaction();
                    statusCode = 500;
                } finally {
                    await this.notificationSettingRepository.queryRunner.release();
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

    /**
     *
     * @param request
     */
    async update(request: Request): Promise<ReturnableResponse> {
        const companyServices = new CompanyServices(this.user);
        // validate the company id if it belongs to the currently logged in user
        // @ts-ignore
        const validateResponse: boolean | ReturnableResponse = await companyServices.validateCompany(request);

        // @ts-ignore
        if (validateResponse !== true) {
            //@ts-ignore
            return validateResponse;
        }

        const zoneServices = new ZoneServices(this.user);
        // validate the company id if it belongs to the currently logged in user
        // @ts-ignore
        const validateResponse: boolean | ReturnableResponse = await zoneServices.validateZone(request);

        // @ts-ignore
        if (validateResponse !== true) {
            //@ts-ignore
            return validateResponse;
        }

        const {data} = request.body;
        const {id} = request.params;

        await this.notificationSettingRepository.init();

        let apiResponse: ApiResponse = new ApiResponse();
        let statusCode: number = 200;
        let notificaitonSetting: NotificationSetting | undefined = await this.notificationSettingRepository.findOneById(parseInt(id));

        if (notificaitonSetting === undefined) {
            apiResponse.status = Status.NotFound;
            apiResponse.message = CommonMessages.NotFound('Notification Setting');
            statusCode = 404;

            return new ReturnableResponse(statusCode, apiResponse);
        }

        // do validation before proceed
        let validation = notificationSettingUpdateValidation(data);

        return new Promise(resolve => {
            validation.checkAsync(async () => {
                await this.notificationSettingRepository.queryRunner.startTransaction();

                try {
                    // @ts-ignore
                    await this.notificationSettingRepository.update(notificaitonSetting, data);
                    await this.notificationSettingRepository.queryRunner.commitTransaction();
                    // get updated notificaitonSetting
                    notificaitonSetting = await this.notificationSettingRepository.findOneById(parseInt(id));
                    apiResponse.result = notificaitonSetting?.serialize();
                } catch {
                    await this.notificationSettingRepository.queryRunner.rollbackTransaction();
                    apiResponse.status = Status.Error;
                    apiResponse.message = CommonMessages.UnableToUpdate('Notification Setting');
                    statusCode = 500;
                } finally {
                    await this.notificationSettingRepository.queryRunner.release();
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

    /**
     *
     * @param request
     */
    async delete(request: Request): Promise<ReturnableResponse> {
        const companyServices = new CompanyServices(this.user);
        // validate the company id if it belongs to the currently logged in user
        // @ts-ignore
        const validateResponse: boolean | ReturnableResponse = await companyServices.validateCompany(request);

        // @ts-ignore
        if (validateResponse !== true) {
            //@ts-ignore
            return validateResponse;
        }

        const zoneServices = new ZoneServices(this.user);
        // validate the company id if it belongs to the currently logged in user
        // @ts-ignore
        const validateResponse: boolean | ReturnableResponse = await zoneServices.validateZone(request);

        // @ts-ignore
        if (validateResponse !== true) {
            //@ts-ignore
            return validateResponse;
        }

        let apiResponse: ApiResponse = new ApiResponse();
        let statusCode: number = 200;

        const {id}: any = request.params;

        await this.notificationSettingRepository.init();

        // get the notification setting to be deleted
        let notificationSetting: NotificationSetting | undefined = await this.notificationSettingRepository.findOneById(parseInt(id));

        if (notificationSetting === undefined) {
            apiResponse.status = Status.NotFound;
            apiResponse.message = CommonMessages.NotFound('Notification Setting');
            statusCode = 404;

            return new ReturnableResponse(statusCode, apiResponse);
        }

        await this.notificationSettingRepository.init();
        await this.notificationSettingRepository.queryRunner.startTransaction();

        try {
            //@ts-ignore
            await this.notificationSettingRepository.delete(notificationSetting);
            await this.notificationSettingRepository.queryRunner.commitTransaction();
        } catch {
            await this.notificationSettingRepository.queryRunner.rollbackTransaction();
            apiResponse.status = Status.Error;
            apiResponse.message = CommonMessages.UnableToDelete('Notification Setting');
            statusCode = 500;
        } finally {
            await this.notificationSettingRepository.queryRunner.release();
        }

        return new ReturnableResponse(statusCode, apiResponse);
    }
}
