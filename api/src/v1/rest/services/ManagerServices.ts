import {User as Manager} from '../../shared/entities/User';
import {ManagerRepository} from "../repositories/ManagerRepository";
import {ApiResponse} from "../objects/ApiResponse";
import {ReturnableResponse} from "../objects/ReturnableResponse";
import {Request} from "express";
import {Status} from "../../../components/types/ResponseStatusTypes";
import {managerCreateValidation, managerUpdateValidation} from "../validators/ManagerValidator";
import {CommonMessages} from "../../../messages/messages";

export default class ManagerServices
{
    private user: any;
    private managerRepository: ManagerRepository;

    /**
     *
     * @param user
     */
    constructor(user: any) {
        this.user = user;
        this.managerRepository = new ManagerRepository(Manager);
    }

    /**
     *
     * @param request
     */
    async getList(request: Request): Promise<ReturnableResponse> {
        let apiResponse: ApiResponse = new ApiResponse();
        const {query} = request.body;

        await this.managerRepository.init();
        apiResponse.result = await this.managerRepository.getList(query);

        await this.managerRepository.queryRunner.release();

        return new ReturnableResponse(200, apiResponse);
    }

    /**
     *
     * @param request
     */
    async getOne(request: Request): Promise<ReturnableResponse> {
        await this.managerRepository.init();
        let apiResponse: ApiResponse = new ApiResponse();
        let statusCode = 200;
        const {id} = request.params;

        const manager: Manager | undefined = await this.managerRepository.findOneById(parseInt(id));

        if (manager === undefined) {
            apiResponse.status = Status.NotFound;
            apiResponse.message = CommonMessages.NotFound('Manager');
            statusCode = 404;
        } else {
            apiResponse.result = manager;
        }

        await this.managerRepository.queryRunner.release();

        return new ReturnableResponse(statusCode, apiResponse);
    }

    /**
     *
     * @param request
     */
    async create(request: Request): Promise<ReturnableResponse> {
        let apiResponse: ApiResponse = new ApiResponse();
        let statusCode: number = 200;
        const {data} = request.body;
        await this.managerRepository.init();

        // do validation before proceed
        let validation = managerCreateValidation(data);

        return new Promise(resolve => {
            validation.checkAsync(async () => {
                // success callback
                await this.managerRepository.queryRunner.startTransaction();

                try {
                    const manager: Manager = await this.managerRepository.create(data);
                    await this.managerRepository.queryRunner.commitTransaction();
                    // @ts-ignore
                    delete manager.password;
                    // @ts-ignore
                    delete manager.salt;
                    apiResponse.result = manager;
                } catch {
                    apiResponse.status = Status.Error;
                    apiResponse.message = CommonMessages.UnableToSave('Manager');
                    await this.managerRepository.queryRunner.rollbackTransaction();
                    statusCode = 500;
                } finally {
                    await this.managerRepository.queryRunner.release();
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
        const {data} = request.body;
        const {id} = request.params;

        await this.managerRepository.init();

        let apiResponse: ApiResponse = new ApiResponse();
        let statusCode: number = 200;
        let manager: Manager | undefined = await this.managerRepository.findOneById(parseInt(id));

        if (manager === undefined) {
            apiResponse.status = Status.NotFound;
            apiResponse.message = CommonMessages.NotFound('Manager');
            statusCode = 404;

            return new ReturnableResponse(statusCode, apiResponse);
        }

        // do validation before proceed
        let validation = managerUpdateValidation(data, manager);

        return new Promise(resolve => {
            validation.checkAsync(async () => {
                await this.managerRepository.queryRunner.startTransaction();

                try {
                    // @ts-ignore
                    await this.managerRepository.update(manager, data);
                    await this.managerRepository.queryRunner.commitTransaction();
                    // @ts-ignore
                    delete manager.password;
                    // @ts-ignore
                    delete manager.salt;
                    apiResponse.result = manager;
                } catch {
                    await this.managerRepository.queryRunner.rollbackTransaction();
                    apiResponse.status = Status.Error;
                    apiResponse.message = CommonMessages.UnableToUpdate('Manager');
                    statusCode = 500;
                } finally {
                    await this.managerRepository.queryRunner.release();
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
        let apiResponse: ApiResponse = new ApiResponse();
        let statusCode: number = 200;

        const {id}: any = request.params;

        await this.managerRepository.init();

        // get the manager to be deleted
        let manager: Manager | undefined = await this.managerRepository.findOneById(parseInt(id));

        if (manager === undefined) {
            apiResponse.status = Status.NotFound;
            apiResponse.message = CommonMessages.NotFound('Manager');
            statusCode = 404;

            return new ReturnableResponse(statusCode, apiResponse);
        }

        await this.managerRepository.init();
        await this.managerRepository.queryRunner.startTransaction();

        try {
            //@ts-ignore
            await this.managerRepository.delete(manager);
            await this.managerRepository.queryRunner.commitTransaction();
        } catch {
            await this.managerRepository.queryRunner.rollbackTransaction();
            apiResponse.status = Status.Error;
            apiResponse.message = CommonMessages.UnableToDelete('Manager');
            statusCode = 500;
        } finally {
            await this.managerRepository.queryRunner.release();
        }

        return new ReturnableResponse(statusCode, apiResponse);
    }
}
