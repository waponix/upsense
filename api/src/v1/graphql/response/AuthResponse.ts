import {ObjectType, Field} from 'type-graphql'
import {Response} from '../objects/Response'
import {Token} from '../objects/Token'

@ObjectType()
export class AuthResponse extends Response
{
    @Field(() => Token, { nullable: true })
    result?: Token;
}
