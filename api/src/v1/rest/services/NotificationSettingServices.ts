import {ApiResponse} from "../objects/ApiResponse";
import {ReturnableResponse} from "../objects/ReturnableResponse";
import {Request} from "express";
import {Status} from "../../../components/types/ResponseStatusTypes";
import {CommonMessages} from "../../../messages/messages";
import {
    notificationSettingUpdateValidation
} from "../validators/NotificationSettingValidator";
import {NotificationSettingRepository} from "../repositories/NotificationSettingRepository";
import {NotificationSetting} from "../../shared/entities/NotificationSetting";
import {UserRepository} from "../repositories/UserRepository";
import {User} from "../../shared/entities/User";

export default class NotificationSettingServices
{
    private user: any;
    private userRepository: UserRepository;
    private notificationSettingRepository: NotificationSettingRepository;

    /**
     *
     * @param user
     */
    constructor(user: any) {
        this.user = user;
        this.userRepository = new UserRepository(User);
        this.notificationSettingRepository = new NotificationSettingRepository(NotificationSetting);
    }

    /**
     *
     * @param request
     */
    async getOne(request: Request): Promise<ReturnableResponse> {
        await this.notificationSettingRepository.init();
        let apiResponse: ApiResponse = new ApiResponse();
        let statusCode = 200;
        const {userId} = request.params;

        await this.userRepository.init();
        let user: User | undefined = undefined;
        if (!isNaN(parseInt(userId))) {
            user = await this.userRepository.findOneBy({
                id: parseInt(userId)
            }, ['notificationSetting']);
        }

        let notificationSetting: NotificationSetting | undefined = user?.notificationSetting;

        if (notificationSetting === undefined) {
            apiResponse.status = Status.NotFound;
            apiResponse.message = CommonMessages.NotFound('Notification Setting');
            statusCode = 404;
        } else {
            apiResponse.result = notificationSetting.serialize();
        }

        await this.userRepository.queryRunner.release();
        await this.notificationSettingRepository.queryRunner.release();

        return new ReturnableResponse(statusCode, apiResponse);
    }

    /**
     *
     * @param request
     */
    async update(request: Request): Promise<ReturnableResponse> {
        const {data} = request.body;
        const {userId} = request.params;

        if (data.sendEmail) {
            data.sendEmail = (!!data.sendEmail) ? 1 : 0;
        }

        if (data.sendSms) {
            data.sendSms = (!!data.sendSms) ? 1 : 0;
        }

        await this.notificationSettingRepository.init();

        let apiResponse: ApiResponse = new ApiResponse();
        let statusCode: number = 200;
        await this.userRepository.init();
        let user: User | undefined = undefined;
        if (!isNaN(parseInt(userId))) {
            user = await this.userRepository.findOneBy({
                id: parseInt(userId)
            }, ['notificationSetting']);
        }
        await this.userRepository.queryRunner.release();

        let notificationSetting: NotificationSetting | undefined = user?.notificationSetting;

        if (notificationSetting === undefined) {
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
                    await this.notificationSettingRepository.update(notificationSetting, data);
                    await this.notificationSettingRepository.queryRunner.commitTransaction();
                    apiResponse.result = notificationSetting?.serialize();
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
}
