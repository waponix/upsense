import {Company} from '../../shared/entities/Company';
import {Request} from "express";
import {ReturnableResponse} from "../objects/ReturnableResponse";
import {ApiResponse} from "../objects/ApiResponse";
import {Status} from "../../../components/types/ResponseStatusTypes";
import {CommonMessages, OperationNotAllowed} from "../../../messages/messages";
import {companyCreateValidation, companyUpdateValidation} from "../validators/CompanyValidator";
import {CompanyRepository} from "../repositories/CompanyRepository";
import {UserRepository} from "../repositories/UserRepository";
import {User, User as Manager} from "../../shared/entities/User";
import {ManagerRepository} from "../repositories/ManagerRepository";
import {UserRole} from "../../../components/types/UserRoleTypes";

export default class companyServices
{
    private user: any;
    private companyRepository: CompanyRepository;
    private userRepository: UserRepository;
    private managerRepository: ManagerRepository;

    constructor(user: any) {
        this.user = user;
        this.companyRepository = new CompanyRepository(Company);
        this.userRepository = new UserRepository(User);
        this.managerRepository = new ManagerRepository(Manager)
    }

    /**
     *
     * @param request
     */
    async getList(request: Request): Promise<ReturnableResponse>
    {
        let apiResponse: ApiResponse = new ApiResponse();

        let query: any = {};
        if ((<any>request).query.query !== undefined) {
            query = JSON.parse((<any>request).query.query);
        }

        await this.companyRepository.init();

        let result: any[] = await this.companyRepository.getList(query);
        result = result.map((record: Company) => record.serialize());

        apiResponse.result = result;

        await this.companyRepository.queryRunner.release();

        return new ReturnableResponse(200, apiResponse);
    }

    /**
     *
     * @param request
     */
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
            apiResponse.result = company.serialize();
        }

        await this.companyRepository.queryRunner.release();

        return new ReturnableResponse(statusCode, apiResponse);
    }

    /**
     *
     * @param request
     */
    async getOneByUser(request: Request): Promise<ReturnableResponse>
    {
        let statusCode: number = 200;
        let apiResponse: ApiResponse = new ApiResponse();

        const {userId} = request.params;

        await this.userRepository.init();
        const user: User | undefined = await this.userRepository.findOneById(parseInt(userId));
        await this.userRepository.queryRunner.release();

        if (user === undefined) {
            apiResponse.status = Status.NotFound;
            apiResponse.message = CommonMessages.NotFound('User');
            statusCode = 404;

            return new ReturnableResponse(statusCode, apiResponse);
        }

        await this.companyRepository.init();
        const company: Company | undefined = await this.companyRepository.findOneByUser(user);

        if (company === undefined) {
            apiResponse.status = Status.NotFound;
            apiResponse.message = CommonMessages.NotFound('Company');
            statusCode = 404;
        } else {
            apiResponse.result = company.serialize();
        }

        await this.companyRepository.queryRunner.release();

        return new ReturnableResponse(statusCode, apiResponse);
    }

    /**
     *
     * @param request
     */
    async getOneByManager(request: Request): Promise<ReturnableResponse>
    {
        let statusCode: number = 200;
        let apiResponse: ApiResponse = new ApiResponse();

        const {managerId} = request.params;

        await this.managerRepository.init();
        const manager: Manager | undefined = await this.managerRepository.findOneById(parseInt(managerId));
        await this.managerRepository.queryRunner.release();

        if (manager === undefined) {
            apiResponse.status = Status.NotFound;
            apiResponse.message = CommonMessages.NotFound('Manager');
            statusCode = 404;

            return new ReturnableResponse(statusCode, apiResponse);
        }

        await this.companyRepository.init();
        const company: Company | undefined = await this.companyRepository.findOneByManager(manager);

        if (company === undefined) {
            apiResponse.status = Status.NotFound;
            apiResponse.message = CommonMessages.NotFound('Company');
            statusCode = 404;
        } else {
            apiResponse.result = company.serialize();
        }

        await this.companyRepository.queryRunner.release();

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
                    apiResponse.result = company.serialize();
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

    /**
     *
     * @param request
     */
    async update(request: Request): Promise<ReturnableResponse>
    {
        let apiResponse: ApiResponse = new ApiResponse();
        let statusCode: number = 200;
        const {id} = request.params;
        const {data} = request.body;

        await this.companyRepository.init();
        let company: Company | undefined = await this.companyRepository.findOneById(parseInt(id));

        if (company === undefined) {
            apiResponse.status = Status.NotFound;
            apiResponse.message = CommonMessages.NotFound('Company');
            statusCode = 404;

            return new ReturnableResponse(statusCode, apiResponse);
        }

        let validation = companyUpdateValidation(data, company);

        return new Promise(resolve => {
            validation.checkAsync(async () => {
                await this.companyRepository.queryRunner.startTransaction();
                try {
                    //@ts-ignore
                    await this.companyRepository.update(company, data);
                    await this.companyRepository.queryRunner.commitTransaction();
                    apiResponse.result = company;
                } catch {
                    await this.companyRepository.queryRunner.rollbackTransaction();
                    apiResponse.status = Status.Error;
                    apiResponse.message = CommonMessages.UnableToUpdate('Company');
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

    /**
     *
     * @param request
     */
    async delete(request: Request): Promise<ReturnableResponse>
    {
        let apiResponse: ApiResponse = new ApiResponse();
        let statusCode: number = 200;

        await this.companyRepository.init();
        const {id} = request.params;
        const company: Company | undefined = await this.companyRepository.findOneById(parseInt(id));

        if (company === undefined) {
            apiResponse.status = Status.NotFound;
            apiResponse.message = CommonMessages.NotFound('Company');
            statusCode = 404;

            return new ReturnableResponse(statusCode, apiResponse);
        }

        await this.companyRepository.queryRunner.startTransaction();
        try {
            await this.companyRepository.delete(company);
        } catch (e) {
            console.log(e);
            await this.companyRepository.queryRunner.rollbackTransaction();
            apiResponse.status = Status.Error;
            apiResponse.message = CommonMessages.UnableToDelete('Company');
            statusCode = 500;
        } finally {
            await this.companyRepository.queryRunner.release();
        }

        return new ReturnableResponse(statusCode, apiResponse);
    }

    async validateCompany(request: Request): Promise<boolean | ReturnableResponse> {
        const companyId: number = parseInt(request.params.companyId);
        let apiResponse: ApiResponse = new ApiResponse();

        // validate if company do exist
        await this.companyRepository.init();
        let company: Company | undefined = await this.companyRepository.findOneById(companyId);
        await this.companyRepository.queryRunner.release();

        if (company === undefined) {
            apiResponse.status = Status.NotFound;
            apiResponse.message = CommonMessages.NotFound('Company');
            return new ReturnableResponse(404, apiResponse);
        }


        if (this.user.role === UserRole.admin) {
            // no need to check if user has admin role
            return true;
        }

        // validate if company belongs to logged in user
        await this.companyRepository.init();
        company = await this.companyRepository.findIfCompanyBelongsToUser(companyId, this.user.id);
        await this.companyRepository.queryRunner.release();

        if (company === undefined) {
            apiResponse.status = Status.Unauthorized;
            apiResponse.message = OperationNotAllowed;
            return new ReturnableResponse(401, apiResponse);
        }

        return true;
    }
}
