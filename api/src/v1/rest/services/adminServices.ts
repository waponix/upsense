import {Admin} from '../../shared/entities/Admin';
import {getConnection} from 'typeorm';
import {paginationConfig} from "../../../config";
import ApiFilter from '../filters/apiFilter';
import {AdminRepository} from "../repositories/AdminRepository";

export default class AdminServices
{
    private user: any;
    private adminRepository: AdminRepository;

    /**
     *
     * @param user
     * @param em
     */
    constructor(user: any) {
        this.user = user;
        this.adminRepository = new AdminRepository();
        this.adminRepository.init(getConnection());
    }

    /**
     *
     * @param filter
     */
    async getList(filter: ApiFilter): Promise<Admin[]> {
        const admins: Admin[] = await this.adminRepository.getList({});

        return admins;
    }

    /**
     *
     * @param data
     */
    async create(data: Partial<Admin>): Promise<Admin> {
        const admin: Admin = await this.adminRepository.create(data);

        return admin;
    }

    /**
     *
     * @param admin
     * @param data
     */
    async update(admin: Admin, data: Partial<Admin>): Promise<boolean> {
        return await this.adminRepository.update(admin, data);
    }

    /**
     *
     * @param admin
     */
    async delete(admin: Admin): Promise<boolean> {
        return await this.adminRepository.delete(admin);
    }
}
