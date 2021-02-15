import mqtt from 'mqtt';
import { mqttConfig } from './config';

const MQTT_OPTIONS = {
    port: mqttConfig.port,
    host: mqttConfig.host,
    protocol: mqttConfig.protocol,
    // username: mqttConfig.username,
    // password: mqttConfig.password,
    rejectUnauthorized: false,
};

export class Receiver {
    client: any = null;
    topic: string;
    onMessage: any = (topic: string, message: Buffer) => {};

    constructor(topic: string) {
        this.topic = topic;
    }

    connect(connectionCallback = () => {}) {
        this.client = mqtt.connect(MQTT_OPTIONS);

        this.client.on('connect', () => {
            console.log('Receiver connection to the MQTT broker: OK')
            // subscribe to a topic
            this.client.subscribe(this.topic);

            connectionCallback();

            // receive a message and do something with it
            this.client.on('message', this.onMessage);
        });

        this.client.on('disconnect', () => {
            console.log('failed to connect');
        })

        this.client.on('error', (err: any) => {
            console.log(`An error occurred. ${err}`);
        });

        return this;
    }

    disconnect(cb: CallableFunction = () => {})
    {
        this.client.end();
        cb();
        return this;
    }
}
