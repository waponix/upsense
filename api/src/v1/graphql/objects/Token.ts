import { ObjectType, Field, Int } from 'type-graphql';
import {RESPONSE_STATUS, Status} from "../../../components/types/ResponseStatusTypes";

@ObjectType()
export class Token
{
    @Field(() => String, { nullable: true })
    accessToken!: string;

    @Field(() => String, { nullable: true })
    refreshToken!: string;
}
