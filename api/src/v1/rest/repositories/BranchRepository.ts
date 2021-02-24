const baseRepositoryPath = "../../shared/repositories/BaseRepository";

const {BaseRepository} = require(baseRepositoryPath);
import {Branch} from "../../shared/entities/Branch";
import {Repository} from "typeorm";

const defaultName: string = "Main";

export class BranchRepository extends BaseRepository {

    async createDefault(): Promise<Branch>
    {
        let branch: Branch = new Branch();

        branch.name = defaultName;

        await this.repository.save(branch);

        return branch;
    }
}
