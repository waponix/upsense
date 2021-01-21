import { connect } from 'mqtt';
import { mqttConfig } from '../../../config';
import { MQTTPubSub } from 'graphql-mqtt-subscriptions';

export class SensorDataReceiver
{
    client: any;
    pubSub: any;

    constructor()
    {
        this.client = connect({
            host: mqttConfig.host,
            port: mqttConfig.port,
            protocol: mqttConfig.protocol,
            username: mqttConfig.username,
            password: mqttConfig.password,
            rejectUnauthorized: false,
            reconnectPeriod: 1000
        });

        this.pubSub = new MQTTPubSub({client: this.client})
    }
}

const sensorDataReceiver = new SensorDataReceiver();

export default sensorDataReceiver;
