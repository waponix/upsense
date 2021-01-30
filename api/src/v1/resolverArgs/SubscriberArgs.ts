import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class SubscriberArgs {
    @Field(type => String, {nullable: true})
    topic: string | null = null;
}
