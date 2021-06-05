import {ZoneRepository} from "../repositories/ZoneRepository";
import {Zone} from "../../shared/entities/Zone";
import {ReturnableResponse} from "../objects/ReturnableResponse";
import {ApiResponse} from "../objects/ApiResponse";
import {Request} from "express";
import {Status} from "../../../components/types/ResponseStatusTypes";
import {CommonMessages, OperationNotAllowed} from "../../../messages/messages";
import {zoneCreateValidation, zoneUpdateValidation} from "../validators/ZoneValidator";
import CompanyServices from "./CompanyServices";
import {Company} from "../../shared/entities/Company";
import {companyUpdateValidation} from "../validators/CompanyValidator";
import {UserRole} from "../../../components/types/UserRoleTypes";

export default class ZoneServices
{
    private user: any;
    private zoneRepository: ZoneRepository;

    constructor(user: any)
    {
        this.user = user;
        this.zoneRepository = new ZoneRepository(Zone);
    }

    /**
     *
     * @param request
     */
    async getList(request: Request): Promise<ReturnableResponse>
    {
        const companyServices = new CompanyServices(this.user);
        // validate the company id if it belongs to the currently logged in user
        // @ts-ignore
        const companyValidationResponse: boolean | ReturnableResponse = await companyServices.validateCompany(request);

        // @ts-ignore
        if (companyValidationResponse !== true) {
            //@ts-ignore
            return companyValidationResponse;
        }

        let apiResponse: ApiResponse = new ApiResponse();

        let query = {};
        if ((<any>request).query.query !== undefined) {
            query = JSON.parse((<any>request).query.query);
        }

        const companyId = parseInt(request.params.companyId);

        await this.zoneRepository.init();

        let result: any[] = await this.zoneRepository.getList(companyId, query);
        result = result.map((record: Zone) => record.serialize());

        apiResponse.result = result;

        await this.zoneRepository.queryRunner.release();

        return new ReturnableResponse(200, apiResponse);
    }

    /**
     *
     * @param request
     */
    async getOne(request: Request): Promise<ReturnableResponse>
    {
        const companyServices = new CompanyServices(this.user);
        // validate the company id if it belongs to the currently logged in user
        // @ts-ignore
        const companyValidationResponse: boolean | ReturnableResponse = await companyServices.validateCompany(request);

        // @ts-ignore
        if (companyValidationResponse !== true) {
            //@ts-ignore
            return companyValidationResponse;
        }

        let statusCode: number = 200;
        let apiResponse: ApiResponse = new ApiResponse();

        const {id, companyId} = request.params;

        await this.zoneRepository.init();
        const zone: Zone | undefined = await this.zoneRepository.findOneBy({id: parseInt(id), company: parseInt(companyId)}, ['users']);

        if (zone === undefined) {
            apiResponse.status = Status.NotFound;
            apiResponse.message = CommonMessages.NotFound('Zone');
            statusCode = 404;
        } else {
            apiResponse.result = zone.serialize();
        }

        await this.zoneRepository.queryRunner.release();

        return new ReturnableResponse(statusCode, apiResponse);
    }

    /**
     *
     * @param request
     */
    async create(request: Request): Promise<ReturnableResponse>
    {
        const companyServices = new CompanyServices(this.user);
        // validate the company id if it belongs to the currently logged in user
        // @ts-ignore
        const companyValidationResponse: boolean | ReturnableResponse = await companyServices.validateCompany(request);

        // @ts-ignore
        if (companyValidationResponse !== true) {
            //@ts-ignore
            return companyValidationResponse;
        }

        let apiResponse: ApiResponse = new ApiResponse();
        let statusCode: number = 201;
        const data = request.body.data || {};

        data.company = parseInt(request.params.companyId);

        // do validation before proceed
        let validation = zoneCreateValidation(data);

        return new Promise(resolve => {
            validation.checkAsync(async () => {
                // success callback
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
    async update(request: Request): Promise<ReturnableResponse>
    {
        const companyServices = new CompanyServices(this.user);
        // validate the company id if it belongs to the currently logged in user
        // @ts-ignore
        const companyValidationResponse: boolean | ReturnableResponse = await companyServices.validateCompany(request);

        // @ts-ignore
        if (companyValidationResponse !== true) {
            //@ts-ignore
            return companyValidationResponse;
        }

        let apiResponse: ApiResponse = new ApiResponse();
        let statusCode: number = 200;
        const {id, companyId} = request.params;
        const data = request.body.data || {};
        data.company = parseInt(companyId);

        await this.zoneRepository.init();
        let zone: Zone | undefined = await this.zoneRepository.findOneBy({id: parseInt(id), company: parseInt(companyId)});

        if (zone === undefined) {
            apiResponse.status = Status.NotFound;
            apiResponse.message = CommonMessages.NotFound('Zone');
            statusCode = 404;

            return new ReturnableResponse(statusCode, apiResponse);
        }

        let validation = zoneUpdateValidation(data, zone);

        return new Promise(resolve => {
            validation.checkAsync(async () => {
                await this.zoneRepository.queryRunner.startTransaction();
                try {
                    //@ts-ignore
                    await this.zoneRepository.update(zone, data);
                    await this.zoneRepository.queryRunner.commitTransaction();
                    apiResponse.result = zone;
                } catch {
                    await this.zoneRepository.queryRunner.rollbackTransaction();
                    apiResponse.status = Status.Error;
                    apiResponse.message = CommonMessages.UnableToUpdate('Zone');
                    statusCode = 500;
                } finally {
                    await this.zoneRepository.queryRunner.release();
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
    async delete(request: Request): Promise<ReturnableResponse>
    {
        const companyServices = new CompanyServices(this.user);
        // validate the company id if it belongs to the currently logged in user
        // @ts-ignore
        const companyValidationResponse: boolean | ReturnableResponse = await companyServices.validateCompany(request);

        // @ts-ignore
        if (companyValidationResponse !== true) {
            //@ts-ignore
            return companyValidationResponse;
        }

        let apiResponse: ApiResponse = new ApiResponse();
        let statusCode: number = 200;

        await this.zoneRepository.init();
        const {id} = request.params;
        const zone: Zone | undefined = await this.zoneRepository.findOneById(parseInt(id));

        if (zone === undefined) {
            apiResponse.status = Status.NotFound;
            apiResponse.message = CommonMessages.NotFound('Zone');
            statusCode = 404;

            return new ReturnableResponse(statusCode, apiResponse);
        }

        await this.zoneRepository.queryRunner.startTransaction();
        try {
            await this.zoneRepository.delete(zone);
        } catch {
            await this.zoneRepository.queryRunner.rollbackTransaction();
            apiResponse.status = Status.Error;
            apiResponse.message = CommonMessages.UnableToDelete('Zone');
            statusCode = 500;
        } finally {
            await this.zoneRepository.queryRunner.release();
        }

        return new ReturnableResponse(statusCode, apiResponse);
    }

    async validateZone(request: Request): Promise<boolean | ReturnableResponse> {
        const companyId: number = isNaN(parseInt(request.params.companyId)) ? 0 : parseInt(request.params.companyId);
        const zoneId: number = parseInt(request.params.zoneId);
        let apiResponse: ApiResponse = new ApiResponse();

        // validate if company do exist
        await this.zoneRepository.init();
        let zone: Zone | undefined = undefined;
        if (!isNaN(zoneId)) {
            zone = await this.zoneRepository.findOneBy({id: zoneId});
        }

        await this.zoneRepository.queryRunner.release();

        if (zone === undefined) {
            apiResponse.status = Status.NotFound;
            apiResponse.message = CommonMessages.NotFound('Zone');
            return new ReturnableResponse(404, apiResponse);
        }

        // validate if zone belongs to company
        await this.zoneRepository.init();
        zone = await this.zoneRepository.findIfZoneBelongsToCompany(zoneId, companyId);
        await this.zoneRepository.queryRunner.release();

        if (zone === undefined) {
            apiResponse.status = Status.Unauthorized;
            apiResponse.message = OperationNotAllowed;
            return new ReturnableResponse(401, apiResponse);
        }

        return true;
    }

}
