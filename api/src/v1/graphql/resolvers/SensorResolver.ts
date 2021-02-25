import { Query, Resolver, Root, Subscription } from 'type-graphql';
import { SensorPayload } from '../objects/SensorPayload';
import sensorDataReceiver from '../../mqtt/receivers/SensorDataReceiver';
import { Sensor } from '../../shared/entities/Sensor';

@Resolver()
export class SensorResolver
{
    @Query(() => Sensor)
    sensors () {
        return new Sensor();
    }
    @Subscription(() => SensorPayload, {
        subscribe: () => {
            return sensorDataReceiver.pubSub.asyncIterator('sensors/+/reading');
        }})
    reading (
        @Root() { temperature, humidity }: SensorPayload
    ) {
        let reading = new SensorPayload();
        reading.temperature = temperature;
        reading.humidity = humidity;
        return reading;
    }
}
