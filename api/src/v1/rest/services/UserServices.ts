import {User} from '../../shared/entities/User';
import {UserRepository} from "../repositories/UserRepository";
import {ApiResponse} from "../objects/ApiResponse";
import {ReturnableResponse} from "../objects/ReturnableResponse";
import {Request} from "express";
import {Status} from "../../../components/types/ResponseStatusTypes";
import {userCreateValidation, userUpdateValidation} from "../validators/UserValidator";
import {AuthMessages, CommonMessages} from "../../../messages/messages";
import {CompanyRepository} from "../repositories/CompanyRepository";
import {Company} from "../../shared/entities/Company";
import {ZoneRepository} from "../repositories/ZoneRepository";
import {Zone} from "../../shared/entities/Zone";
import {UserRole} from "../../../components/types/UserRoleTypes";

export default class UserServices
{
    private user: any;
    private userRepository: UserRepository;
    private zoneRepository: ZoneRepository;
    private companyRepository: CompanyRepository;

    /**
     *
     * @param user
     */
    constructor(user: any) {
        this.user = user;
        this.userRepository = new UserRepository(User);
        this.companyRepository = new CompanyRepository(Company);
        this.zoneRepository = new ZoneRepository(Zone);
    }

    /**
     *
     * @param request
     */
    async getList(request: Request): Promise<ReturnableResponse> {
        let apiResponse: ApiResponse = new ApiResponse();
        let query: any = {};
        if ((<any>request).query.query !== undefined) {
            query = JSON.parse((<any>request).query.query);
        }

        await this.userRepository.init();
        let result: any[] = await this.userRepository.getList(query, this.user);
        result = result.map((record: User) => record.serialize());

        apiResponse.result = result;

        await this.userRepository.queryRunner.release();

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

        if (this.user.role === UserRole.user && parseInt(id) !== this.user.id) {
            apiResponse.status = Status.NotFound;
            apiResponse.message = CommonMessages.NotFound('User');
            statusCode = 404;
            return new ReturnableResponse(statusCode, apiResponse);
        }

        let user: User | undefined = undefined;
        if (!isNaN(parseInt(id))) {
            user = await this.userRepository.findOneByUser(parseInt(id), this.user);
        }

        if (user === undefined) {
            apiResponse.status = Status.NotFound;
            apiResponse.message = CommonMessages.NotFound('User');
            statusCode = 404;
        } else {
            apiResponse.result = user.serialize();
        }

        await this.userRepository.queryRunner.release();

        return new ReturnableResponse(statusCode, apiResponse);
    }

    /**
     *
     * @param request
     */
    async create(request: Request): Promise<ReturnableResponse> {
        let apiResponse: ApiResponse = new ApiResponse();
        let statusCode: number = 201;
        const {data} = request.body;

        // do validation before proceed
        let validation = userCreateValidation(data);

        return new Promise(resolve => {
            validation.checkAsync(async () => {
                // success callback
                await this.userRepository.init();

                await this.userRepository.queryRunner.startTransaction();

                if (data.company) {
                    // query for company if user passes value
                    await this.companyRepository.init();
                    data.company = await this.companyRepository.findOneBy({id: data.company});
                    await this.companyRepository.queryRunner.release();
                }

                if (data.zones) {
                    await this.zoneRepository.init();
                    let zones = [];
                    for (let zoneId of data.zones) {
                        const zone: Zone | undefined = await this.zoneRepository.findOneBy({id: parseInt(zoneId), company: data.company});
                        zones.push(zone);
                    }
                    data.zones = zones;
                    await this.zoneRepository.queryRunner.release();
                }

                try {
                    const user: User = await this.userRepository.create(data);
                    await this.userRepository.queryRunner.commitTransaction();

                    apiResponse.result = user.serialize();
                } catch (e) {
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

        if (this.user.role === UserRole.user && data.zones) {
            // don't allow zones to update for role user
            delete data.zones;
        }

        await this.userRepository.init();

        let apiResponse: ApiResponse = new ApiResponse();
        let statusCode: number = 200;

        let user: User | undefined = undefined
        if (!isNaN(parseInt(id))) {
            user = await this.userRepository.findOneById(parseInt(id));
        }

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

                if (data.addZones) {
                    await this.zoneRepository.init();
                    let zones = [];
                    for (let zoneId of data.addZones) {
                        const zone: Zone | undefined = await this.zoneRepository.findOneBy({id: parseInt(zoneId), company: data.company});
                        zones.push(zone);
                    }
                    data.addZones = zones;
                    await this.zoneRepository.queryRunner.release();
                }

                if (data.removeZones) {
                    await this.zoneRepository.init();
                    let zones = [];
                    for (let zoneId of data.removeZones) {
                        const zone: Zone | undefined = await this.zoneRepository.findOneBy({id: parseInt(zoneId), company: data.company});
                        zones.push(zone);
                    }
                    data.removeZones = zones;
                    await this.zoneRepository.queryRunner.release();
                }

                try {
                    // @ts-ignore
                    await this.userRepository.update(user, data);
                    await this.userRepository.queryRunner.commitTransaction();
                    // get updated user
                    user = await this.userRepository.findOneById(parseInt(id));
                    apiResponse.result = user?.serialize();
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

        await this.userRepository.init();

        // get the user to be deleted
        let user: User | undefined = undefined;
        if (!isNaN(parseInt(id))) {
            user = await this.userRepository.findOneById(parseInt(id));
        }

        if (user === undefined) {
            apiResponse.status = Status.NotFound;
            apiResponse.message = CommonMessages.NotFound('User');
            statusCode = 404;

            return new ReturnableResponse(statusCode, apiResponse);
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
