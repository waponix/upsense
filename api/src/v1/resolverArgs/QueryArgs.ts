import { ArgsType, Field, Int } from 'type-graphql';
import { paginationConfig } from '../../config';

@ArgsType()
export class QueryArgs {
    @Field(type => Int, { nullable: true })
    id?: number;

    @Field(type => String, { nullable: true })
    query?: string;

    @Field(type => Int, { nullable: true })
    page?: number;

    get pageOffset() {
        if (!this.page) {
            return 0;
        }

        let offset: number = this.page - 1;

        return offset * paginationConfig.limit;
    }
}
