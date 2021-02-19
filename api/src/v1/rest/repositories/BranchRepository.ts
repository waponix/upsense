import {BaseRepository} from "../../shared/repositories/BaseRepository";
import {Branch} from "../../shared/entities/Branch";
import {Repository} from "typeorm";

const defaultName: string = "Main";

export class BranchRepository extends BaseRepository {

    async createDefault(): Promise<Branch>
    {
        const repository: Repository<Branch> = await this.em.getRepository(Branch);
        let branch: Branch = new Branch();

        branch.name = defaultName;

        repository.save(branch);

        return branch;
    }
}
