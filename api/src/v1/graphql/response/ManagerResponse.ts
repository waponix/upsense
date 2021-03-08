import {ObjectType, Field} from 'type-graphql'
import {Response} from '../objects/Response'
import {User} from "../../shared/entities/User";

@ObjectType()
export class ManagerResponse extends Response
{
    @Field(() => [User], { nullable: true })
    result?: User[];
}

@ObjectType()
export class SingleManagerResponse extends Response
{
    @Field(() => User, { nullable: true })
    result?: User;
}
