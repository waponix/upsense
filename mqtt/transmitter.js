const mqtt = require('mqtt');

const CONNECT_OPTIONS = {
    port: 1883,
    host: 'localhost',
    protocol: 'mqtts',
    username: 'root',
    password: 'admin',
    rejectUnauthorized: false,
};

class Transmitter
{
    client = null;
    topic = null;
    tick = null;
    interval = 3000;

    constructor(topic)
    {
        this.topic = topic;
    }

    start()
    {
        this.connect(() => {
            // keep sending the temperature
            this.tick = setInterval(() => {
                let temperature = 100 * Math.random();

                this.send(JSON.stringify({temperature}));
            }, this.interval);
        });

        return this;
    }

    connect(connectionCallback = () => {}) {
        this.client = mqtt.connect(CONNECT_OPTIONS);

        this.client.on('connect', () => {
            console.log('Transmitter connection to the MQTT broker: OK')
            connectionCallback();
        });

        this.client.on('error', (err) => {
            console.log('An error occurred. ' + err);
        });

        this.client.on('disconnect', () => {
            console.log('Transmitter disconnected to the MQTT broker');
            // clear the interval on disconnect
            clearInterval(this.tick);
        });

        return this;
    }

    send(message)
    {
        this.client.publish(this.topic, message, (err) => {
           if (err) {
               console.log('An error occurred while trying to publish a message. Err: ' + err);
           } else {
               console.log('Successully');
           }
        });

        return this;
    }

    stop(cb = () => {})
    {
        this.client.end();
        cb();
        return this;
    }
}

module.exports = Transmitter;
