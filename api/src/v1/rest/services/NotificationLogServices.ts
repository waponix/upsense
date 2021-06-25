import {User} from "../../shared/entities/User";
import {Request} from "express";
import {ReturnableResponse} from "../objects/ReturnableResponse";
import {ApiResponse} from "../objects/ApiResponse";
import {NotificationLogRepository} from "../repositories/NotificationLogRepository";
import {NotificationLog} from "../../shared/entities/NotificationLog";
import {Status} from "../../../components/types/ResponseStatusTypes";
import {CommonMessages} from "../../../messages/messages";

export default class NotificationLogServices
{
    private user: any;
    private notificationLogRepository: NotificationLogRepository;
    /**
     *
     * @param user
     */
    constructor(user: any) {
        this.user = user;
        this.notificationLogRepository = new NotificationLogRepository(NotificationLog);
    }

    async getList(request: Request): Promise<ReturnableResponse> {
        let apiResponse: ApiResponse = new ApiResponse();
        let query: any = {};
        if ((<any>request).query.query !== undefined) {
            query = JSON.parse((<any>request).query.query);
        }

        await this.notificationLogRepository.init();
        let result: any = await this.notificationLogRepository.getList(query, this.user);

        apiResponse.result = result;

        await this.notificationLogRepository.queryRunner.release();

        return new ReturnableResponse(200, apiResponse);
    }

    async updateMany(request: Request): Promise<ReturnableResponse> {
        let apiResponse: ApiResponse = new ApiResponse();
        let statusCode: number = 200;
        const data: any = request.body.data || null;

        await this.notificationLogRepository.init()
        await this.notificationLogRepository.queryRunner.startTransaction();

        try {
            await this.notificationLogRepository.updateSeen(data.ids, this.user);
            await this.notificationLogRepository.queryRunner.commitTransaction();
        } catch (e) {
            console.log(e);
            await this.notificationLogRepository.queryRunner.rollbackTransaction();
            apiResponse.status = Status.Error;
            apiResponse.message = CommonMessages.UnableToUpdate('Notification Log');
            statusCode = 500;
        } finally {
            await this.notificationLogRepository.queryRunner.release();
        }

        return new ReturnableResponse(statusCode, apiResponse);
    }
}
