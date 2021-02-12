import { ObjectType, Field, Float } from 'type-graphql';

@ObjectType()
export class SensorPayload
{
    @Field(() => Float, { nullable: true })
    battery: number = 0;

    @Field(() => Float)
    temperature: number = 0;

    @Field(() => Float, { nullable: true })
    humidity: number = 0;

    @Field(() => Float)
    timestamp: number = 0;
}
