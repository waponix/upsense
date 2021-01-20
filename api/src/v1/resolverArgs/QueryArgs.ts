import { ArgsType, Field, Int } from 'type-graphql';
import { paginationConfig } from '../../config';

@ArgsType()
export class QueryArgs {
    @Field(type => Int, { nullable: true })
    id: number | null = null;

    @Field(type => String, { nullable: true })
    search: string | null = null;

    @Field(type => Int, { nullable: true })
    page: number | null = null;

    @Field(type => String, { nullable: true })
    sort: string | null = null;

    @Field(type => String, { nullable: true })
    order: string | null = null;

    pageMax: any = paginationConfig.pageMax;

    get pageOffset() {
        if (!this.page) {
            return 0;
        }

        let offset = this.page - 1;

        return offset * this.pageMax;
    }
}
