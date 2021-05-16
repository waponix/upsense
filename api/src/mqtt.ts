//@ts-ignore
import mqtt from 'mqtt';
import { mqttConfig } from './config';
import {SensorRepository} from "./v1/rest/repositories/SensorRepository";
import {Sensor} from "./v1/shared/entities/Sensor";
import moment from 'moment';
import {SensorReadingRepository} from "./v1/rest/repositories/SensorReadingRepository";
import {SensorReading} from "./v1/shared/entities/SensorReading";

const MQTT_OPTIONS = {
    port: mqttConfig.port,
    host: mqttConfig.host,
    protocol: mqttConfig.protocol,
    // username: mqttConfig.username,
    // password: mqttConfig.password,
    rejectUnauthorized: false,
};

export class SubscriberApp
{
    client: any = null;
    sensorRepository: SensorRepository;
    sensorReadingRepository: SensorReadingRepository;

    constructor() {
        this.sensorRepository = new SensorRepository(Sensor);
        this.sensorReadingRepository = new SensorReadingRepository(SensorReading);

        this.client = mqtt.connect(MQTT_OPTIONS);

        this.client.on('connect', () => {
            console.log('Receiver connection to the MQTT broker: OK')
            // subscribe to a topic
            this.client.subscribe('iot/+/sensor');

            // receive a message and do something with it
            this.client.on('message', async (topic: string, message: Buffer) => {
                await this.dataHandler(topic, message);
            });
        });

        this.client.on('disconnect', () => {
            console.log('failed to connect');
        });

        this.client.on('error', (err: any) => {
            console.log(`An error occurred. ${err}`);
        });

        return this;
    }

    private async dataHandler(topic: string, message: Buffer)
    {
        const data = JSON.parse(message.toString());

        await this.sensorRepository.init();
        let sensor: Sensor | undefined = await this.sensorRepository.findOneBy({serial: data.obj?.devEUI});

        if (sensor === undefined) {
            sensor = new Sensor();
            sensor.serial = data.obj?.devEUI;
        }

        const dataTimestamp: number = moment(data.obj?.time).unix();

        sensor.name = data.obj?.deviceName;
        sensor.currentTemp = data.temperature;
        //@ts-ignore
        sensor.lastSeen = dataTimestamp;
        sensor.isConnected = 1;

        await this.sensorRepository.save(sensor);

        await this.sensorRepository.queryRunner.release();

        await this.sensorReadingRepository.init();

        let sensorReading = new SensorReading();
        sensorReading.temperature = data.temperature;
        sensorReading.humidity = data.humidity;
        sensorReading.timestamp = dataTimestamp;
        sensorReading.sensor = sensor;

        await this.sensorReadingRepository.save(sensorReading);

        await this.sensorReadingRepository.queryRunner.release();
    }
}
