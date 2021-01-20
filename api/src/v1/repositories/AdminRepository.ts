import {getRepository, Repository} from "typeorm";
import {Admin} from "../entities/Admin";

const adminRepo: Repository<Admin> = getRepository(Admin);

export default adminRepo;
