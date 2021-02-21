import {Company} from '../../shared/entities/Company';
import {Request} from "express";
import {ReturnableResponse} from "../objects/ReturnableResponse";
import {ApiResponse} from "../objects/ApiResponse";
import {Status} from "../../../components/types/ResponseStatusTypes";
import {CommonMessages} from "../../../messages/messages";
import {companyCreateValidation} from "../validators/CompanyValidator";
import {CompanyRepository} from "../repositories/CompanyRepository";

export default class companyServices
{
    private user: any;
    private companyRepository: any;

    constructor(user: any) {
        this.user = user;
        this.companyRepository = new CompanyRepository();
    }

    /**
     *
     * @param request
     */
    async getList(request: Request): Promise<ReturnableResponse>
    {
        let apiResponse: ApiResponse = new ApiResponse();
        const {query} = request.body;

        await this.companyRepository.init();
        apiResponse.result = await this.companyRepository.getList(query);

        return new ReturnableResponse(200, apiResponse);
    }

    async getOne(request: Request): Promise<ReturnableResponse>
    {
        let statusCode: number = 200;
        let apiResponse: ApiResponse = new ApiResponse();

        const {id} = request.params;

        await this.companyRepository.init();
        const company: Company | undefined = await this.companyRepository.findOneById(parseInt(id));

        if (company === undefined) {
            apiResponse.status = Status.NotFound;
            apiResponse.message = CommonMessages.NotFound('Company');
            statusCode = 404;
        } else {
            apiResponse.result = company;
        }

        return new ReturnableResponse(statusCode, apiResponse);
    }

    /**
     *
     * @param request
     */
    async create(request: Request): Promise<ReturnableResponse>
    {
        let apiResponse: ApiResponse = new ApiResponse();
        let statusCode: number = 200;

        const {data} = request.body;
        const validation = companyCreateValidation(data);

        return new Promise(resolve => {
            validation.checkAsync(async () => {
                await this.companyRepository.init();
                await this.companyRepository.queryRunner.startTransaction();

                try {
                    const company = await this.companyRepository.create(data);
                    await this.companyRepository.queryRunner.commitTransaction();
                    //@ts-ignore
                    delete company.branch;
                    apiResponse.result = company;
                } catch (e) {
                    await this.companyRepository.queryRunner.rollbackTransaction();
                    apiResponse.status = Status.Error;
                    apiResponse.message = CommonMessages.UnableToSave('Company');
                    statusCode = 500;
                } finally {
                    await this.companyRepository.queryRunner.release();
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

        return new ReturnableResponse(statusCode, apiResponse);
    }
}
