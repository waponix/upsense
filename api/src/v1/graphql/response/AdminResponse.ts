import {ObjectType, Field} from 'type-graphql'
import {Response} from '../objects/Response'
import {User} from "../../shared/entities/User";

@ObjectType()
export class AdminResponse extends Response
{
    @Field(() => [User], { nullable: true })
    result?: User[];
}

@ObjectType()
export class SingleAdminResponse extends Response
{
    @Field(() => User, { nullable: true })
    result?: User;
}
