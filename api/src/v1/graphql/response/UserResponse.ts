import {ObjectType, Field} from 'type-graphql'
import {Response} from '../objects/Response'
import {User} from "../../shared/entities/User";

@ObjectType()
export class UserResponse extends Response
{
    @Field(() => [User], { nullable: true })
    result?: User[];
}

@ObjectType()
export class SingleUserResponse extends Response
{
    @Field(() => User, { nullable: true })
    result?: User;
}
