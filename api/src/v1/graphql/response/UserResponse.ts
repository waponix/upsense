import {ObjectType, Field} from 'type-graphql'
import {Response} from '../objects/Response'
import {Admin} from "../../shared/entities/Admin";

@ObjectType()
export class UserResponse extends Response
{
    @Field(() => [Admin], { nullable: true })
    result?: Admin[];
}

@ObjectType()
export class SingleUserResponse extends Response
{
    @Field(() => Admin, { nullable: true })
    result?: Admin;
}
