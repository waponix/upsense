const Broker = require('./broker');
const Receiver = require('./receiver');
const Transmitter = require('./transmitter');

const TOPIC = 'sensor/temperature/reading';

let broker = new Broker();

broker.listen(() => {
    broker.setupAuthentication();

    let receiver = new Receiver(TOPIC);
    receiver.connect(() => {
        receiver.onMessage = (topic, message) => {
            console.log(JSON.parse(message.toString()));
        }
    });

    let transmitter = new Transmitter(TOPIC);
    // begin transmitting temperature
    transmitter.start();
});
