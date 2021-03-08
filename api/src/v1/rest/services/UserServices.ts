import {User} from '../../shared/entities/User';
import {UserRepository} from "../repositories/UserRepository";
import {ApiResponse} from "../objects/ApiResponse";
import {ReturnableResponse} from "../objects/ReturnableResponse";
import {Request} from "express";
import {Status} from "../../../components/types/ResponseStatusTypes";
import {userCreateValidation, userUpdateValidation} from "../validators/UserValidator";
import {CommonMessages} from "../../../messages/messages";

export default class UserServices
{
    private user: any;
    private userRepository: UserRepository;

    /**
     *
     * @param user
     */
    constructor(user: any) {
        this.user = user;
        this.userRepository = new UserRepository(User);
    }

    /**
     *
     * @param request
     */
    async getList(request: Request): Promise<ReturnableResponse> {
        let apiResponse: ApiResponse = new ApiResponse();
        const {query} = request.body;

        await this.userRepository.init();
        apiResponse.result = await this.userRepository.getList(query);

        return new ReturnableResponse(200, apiResponse);
    }

    /**
     *
     * @param request
     */
    async getOne(request: Request): Promise<ReturnableResponse> {
        await this.userRepository.init();
        let apiResponse: ApiResponse = new ApiResponse();
        let statusCode = 200;
        const {id} = request.params;

        const user: User | undefined = await this.userRepository.findOneById(parseInt(id));

        if (user === undefined) {
            apiResponse.status = Status.NotFound;
            apiResponse.message = CommonMessages.NotFound('User');
            statusCode = 404;
        } else {
            apiResponse.result = user;
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
        let validation = userCreateValidation(data);

        return new Promise(resolve => {
            validation.checkAsync(async () => {
                // success callback
                await this.userRepository.init();

                await this.userRepository.queryRunner.startTransaction();

                try {
                    const user: User = await this.userRepository.create(data);
                    await this.userRepository.queryRunner.commitTransaction();
                    // @ts-ignore
                    delete user.password;
                    // @ts-ignore
                    delete user.salt;
                    apiResponse.result = user;
                } catch {
                    apiResponse.status = Status.Error;
                    apiResponse.message = CommonMessages.UnableToSave('User');
                    await this.userRepository.queryRunner.rollbackTransaction();
                    statusCode = 500;
                } finally {
                    await this.userRepository.queryRunner.release();
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

        await this.userRepository.init();

        let apiResponse: ApiResponse = new ApiResponse();
        let statusCode: number = 200;
        let user: User | undefined = await this.userRepository.findOneById(parseInt(id));

        if (user === undefined) {
            apiResponse.status = Status.NotFound;
            apiResponse.message = CommonMessages.NotFound('User');
            statusCode = 404;

            return new ReturnableResponse(statusCode, apiResponse);
        }

        // do validation before proceed
        let validation = userUpdateValidation(data, user);

        return new Promise(resolve => {
            validation.checkAsync(async () => {
                await this.userRepository.queryRunner.startTransaction();

                try {
                    // @ts-ignore
                    await this.userRepository.update(user, data);
                    await this.userRepository.queryRunner.commitTransaction();
                    // @ts-ignore
                    delete user.password;
                    // @ts-ignore
                    delete user.salt;
                    apiResponse.result = user;
                } catch {
                    await this.userRepository.queryRunner.rollbackTransaction();
                    apiResponse.status = Status.Error;
                    apiResponse.message = CommonMessages.UnableToUpdate('User');
                    statusCode = 500;
                } finally {
                    await this.userRepository.queryRunner.release();
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

        // get the user to be deleted
        let user: User | undefined = await this.userRepository.findOneById(parseInt(id));

        if (user === undefined) {
            apiResponse.status = Status.NotFound;
            apiResponse.message = CommonMessages.NotFound('User');
            statusCode = 404;
        }

        await this.userRepository.init();
        await this.userRepository.queryRunner.startTransaction();

        try {
            //@ts-ignore
            await this.userRepository.delete(user);
            await this.userRepository.queryRunner.commitTransaction();
        } catch {
            await this.userRepository.queryRunner.rollbackTransaction();
            apiResponse.status = Status.Error;
            apiResponse.message = CommonMessages.UnableToDelete('User');
            statusCode = 500;
        } finally {
            await this.userRepository.queryRunner.release();
        }

        return new ReturnableResponse(statusCode, apiResponse);
    }
}
