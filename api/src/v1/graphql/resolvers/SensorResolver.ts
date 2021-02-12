import { Query, Resolver, Root, Subscription } from 'type-graphql';
import { SensorPayload } from '../objects/SensorPayload';
import sensorDataReceiver from '../mqtt/receivers/SensorDataReceiver';
import { Sensor } from '../entities/Sensor';

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
        @Root() { temperature, timestamp }: SensorPayload
    ) {
        let reading = new SensorPayload();
        reading.temperature = temperature;
        reading.timestamp = timestamp;
        return reading;
    }
}
