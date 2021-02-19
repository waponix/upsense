import {Company} from '../../shared/entities/Company';
import {QueryOptions} from "../../shared/repositories/BaseRepository";
import {Request} from "express";
import {ReturnableResponse} from "../objects/ReturnableResponse";
import {ApiResponse} from "../objects/ApiResponse";
import {Status} from "../../../components/types/ResponseStatusTypes";
import {CommonMessages} from "../../../messages/messages";
import {createCompanyValidator} from "../validators/CompanyValidator";
import {CompanyRepository} from "../repositories/CompanyRepository";

export default class companyServices
{
    private user: any;
    private companyRepository: any;

    constructor(user: any) {
        this.user = user;
        this.companyRepository = new CompanyRepository();
    }

    async getList(query: QueryOptions)
    {
        return await this.companyRepository.find({}, {take: 20});
    }

    async create(request: Request): Promise<ReturnableResponse>
    {
        let apiResponse: ApiResponse = new ApiResponse();
        let statusCode: number = 200;

        const {data} = request.body;
        const validation = createCompanyValidator(data);

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
}
