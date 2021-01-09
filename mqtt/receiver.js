const mqtt = require('mqtt');

const CONNECT_OPTIONS = {
    port: 1883,
    host: 'localhost',
    protocol: 'mqtts',
    username: 'root',
    password: 'admin',
    rejectUnauthorized: false,
};

class Receiver {
    client = null;
    topic = null;
    onMessage = (topic, message) => {};

    constructor(topic) {
        this.topic = topic;
    }

    connect(connectionCallback = () => {}) {
        this.client = mqtt.connect(CONNECT_OPTIONS);

        this.client.on('connect', () => {
            console.log('Receiver connection to the MQTT broker: OK')
            // subscribe to a topic
            this.client.subscribe(this.topic);

            connectionCallback();

            // receive a message and do something with it
            this.client.on('message', this.onMessage);
        });

        this.client.on('error', (err) => {
            console.log('An error occurred. ' + err);
        });

        return this;
    }

    disconnect(cb = () => {})
    {
        this.client.end();
        cb();
        return this;
    }
}

module.exports = Receiver;
