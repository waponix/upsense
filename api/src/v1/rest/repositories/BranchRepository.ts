import {BaseRepository} from "../../shared/repositories/BaseRepository";
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
