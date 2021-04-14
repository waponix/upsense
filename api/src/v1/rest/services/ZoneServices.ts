import {ZoneRepository} from "../repositories/ZoneRepository";
import {Zone} from "../../shared/entities/Zone";
import {ReturnableResponse} from "../objects/ReturnableResponse";
import {ApiResponse} from "../objects/ApiResponse";
import {Request} from "express";
import {Status} from "../../../components/types/ResponseStatusTypes";
import {CommonMessages} from "../../../messages/messages";
import {zoneCreateValidation} from "../validators/ZoneValidator";
import CompanyServices from "./CompanyServices";

export default class ZoneServices
{
    private user: any;
    private zoneRepository: ZoneRepository;

    constructor(user: any)
    {
        this.user = user;
        this.zoneRepository = new ZoneRepository(Zone);
    }

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
        let statusCode: number = 200;
        const {data} = request.body;

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
}
