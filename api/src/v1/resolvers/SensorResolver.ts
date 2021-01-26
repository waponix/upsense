import {Args, Query, Resolver, Root, Subscription} from 'type-graphql';
import { SensorPayload } from '../objects/SensorPayload';
import sensorDataReceiver from '../mqtt/receivers/SensorDataReceiver';
import { Sensor } from '../entities/Sensor';
import { SubscriberArgs } from '../resolverArgs/SubscriberArgs';

@Resolver()
export class SensorResolver
{
    @Query(() => Sensor)
    sensors () {
        return new Sensor();
    }
    @Subscription(() => SensorPayload, {
        subscribe: () => {
            return sensorDataReceiver.pubSub.asyncIterator('sensor/+/temperature/reading');
        }})
    reading (
        @Root() { temperature, timestamp }: SensorPayload,
        @Args() { topic }: SubscriberArgs
    ) {
        console.log(topic);
        let reading = new SensorPayload();
        reading.temperature = temperature;
        reading.timestamp = timestamp;
        return reading;
    }
}
