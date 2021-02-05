import {getRepository, Repository} from "typeorm";
import {Admin} from "../entities/Admin";
import {AdminFilterInput} from "../resolverInputs/AdminDataInput";
import {paginationConfig} from "../../config";

export class AdminRepository
{
    public repo: Repository<Admin>;

    constructor(adminRepository: Repository<Admin>) {
        this.repo = adminRepository;
    }

    getAdminList = async (filters: AdminFilterInput) =>  {
        const query = this.repo
            .createQueryBuilder('a')
            .select('a.id')
            .addSelect('a.username')
            .addSelect('a.firstName')
            .addSelect('a.lastName')
            .addSelect('a.email')
            .addSelect('a.mobileNumber')
            .addSelect('a.picture')
            .addSelect('a.createdAt')
            .addSelect('a.updatedAt')
            .limit(paginationConfig.limit);

        return await query.getMany();
    }
}

