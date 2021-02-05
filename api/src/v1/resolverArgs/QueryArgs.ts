import { ArgsType, Field, Int } from 'type-graphql';
import { paginationConfig } from '../../config';

@ArgsType()
export class QueryArgs {
    @Field(type => Int, { nullable: true })
    id?: number | null = null;

    @Field(type => String, { nullable: true })
    search?: string | null = null;

    @Field(type => Int, { nullable: true })
    page?: number | null = null;

    get pageOffset() {
        if (!this.page) {
            return 0;
        }

        let offset: number = this.page - 1;

        return offset * paginationConfig.limit;
    }
}
