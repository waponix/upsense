import {ObjectType, Field} from 'type-graphql'
import {Response} from '../objects/Response'
import {Admin} from "../entities/Admin";

@ObjectType()
export class AdminResponse extends Response
{
    @Field(() => [Admin], { nullable: true })
    result?: Admin[];
}

@ObjectType()
export class SingleAdminResponse extends Response
{
    @Field(() => Admin, { nullable: true })
    result?: Admin;
}
