import {Admin} from '../../shared/entities/Admin';
import {AdminRepository} from "../repositories/AdminRepository";
import {ApiResponse} from "../objects/ApiResponse";
import {ReturnableResponse} from "../objects/ReturnableResponse";
import {Request} from "express";
import {Status} from "../../../components/types/ResponseStatusTypes";
import {adminCreateValidation, adminUpdateValidation} from "../validators/AdminValidator";
import {CommonMessages} from "../../../messages/messages";

export default class AdminServices
{
    private user: any;
    private adminRepository: AdminRepository;

    /**
     *
     * @param user
     */
    constructor(user: any) {
        this.user = user;
        this.adminRepository = new AdminRepository();
    }

    /**
     *
     * @param request
     */
    async getList(request: Request): Promise<ReturnableResponse> {
        let apiResponse: ApiResponse = new ApiResponse();
        const {query} = request.body;

        await this.adminRepository.init();
        apiResponse.result = await this.adminRepository.getList(query);

        return new ReturnableResponse(200, apiResponse);
    }

    /**
     *
     * @param request
     */
    async getOne(request: Request): Promise<ReturnableResponse> {
        await this.adminRepository.init();
        let apiResponse: ApiResponse = new ApiResponse();
        let statusCode = 200;
        const {id} = request.params;

        const admin: Admin | undefined = await this.adminRepository.findOneById(parseInt(id));

        if (admin === undefined) {
            apiResponse.status = Status.NotFound;
            apiResponse.message = CommonMessages.NotFound('Admin');
            statusCode = 404;
        } else {
            apiResponse.result = admin;
        }

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

        // do validation before proceed
        let validation = adminCreateValidation(data);

        return new Promise(resolve => {
            validation.checkAsync(async () => {
                // success callback
                await this.adminRepository.init();

                await this.adminRepository.queryRunner.startTransaction();

                try {
                    const admin: Admin = await this.adminRepository.create(data);
                    await this.adminRepository.queryRunner.commitTransaction();
                    // @ts-ignore
                    delete admin.password;
                    // @ts-ignore
                    delete admin.salt;
                    apiResponse.result = admin;
                } catch {
                    apiResponse.status = Status.Error;
                    apiResponse.message = CommonMessages.UnableToSave('Admin');
                    await this.adminRepository.queryRunner.rollbackTransaction();
                    statusCode = 500;
                } finally {
                    await this.adminRepository.queryRunner.release();
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

        await this.adminRepository.init();

        let apiResponse: ApiResponse = new ApiResponse();
        let statusCode: number = 200;
        let admin: Admin | undefined = await this.adminRepository.findOneById(parseInt(id));

        if (admin === undefined) {
            apiResponse.status = Status.NotFound;
            apiResponse.message = CommonMessages.NotFound('Admin');
            statusCode = 404;

            return new ReturnableResponse(statusCode, apiResponse);
        }

        // do validation before proceed
        let validation = adminUpdateValidation(data, admin);

        return new Promise(resolve => {
            validation.checkAsync(async () => {
                await this.adminRepository.queryRunner.startTransaction();

                try {
                    // @ts-ignore
                    await this.adminRepository.update(admin, data);
                    await this.adminRepository.queryRunner.commitTransaction();
                    // @ts-ignore
                    delete admin.password;
                    // @ts-ignore
                    delete admin.salt;
                    apiResponse.result = admin;
                } catch {
                    await this.adminRepository.queryRunner.rollbackTransaction();
                    apiResponse.status = Status.Error;
                    apiResponse.message = CommonMessages.UnableToUpdate('Admin');
                    statusCode = 500;
                } finally {
                    await this.adminRepository.queryRunner.release();
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

        // get the admin to be deleted
        let admin: Admin | undefined = await this.adminRepository.findOneById(parseInt(id));

        if (admin === undefined) {
            apiResponse.status = Status.NotFound;
            apiResponse.message = CommonMessages.NotFound('Admin');
            statusCode = 404;
        }

        await this.adminRepository.init();
        await this.adminRepository.queryRunner.startTransaction();

        try {
            //@ts-ignore
            await this.adminRepository.delete(admin);
            await this.adminRepository.queryRunner.commitTransaction();
        } catch {
            await this.adminRepository.queryRunner.rollbackTransaction();
            apiResponse.status = Status.Error;
            apiResponse.message = CommonMessages.UnableToDelete('Admin');
            statusCode = 500;
        } finally {
            await this.adminRepository.queryRunner.release();
        }

        return new ReturnableResponse(statusCode, apiResponse);
    }
}
