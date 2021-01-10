const Broker = require('./broker');
const Receiver = require('./receiver');
const Transmitter = require('./transmitter');
const Storage = require('./storage');

const TOPIC = 'sensor/temperature/reading';

let broker = new Broker();

broker.listen(() => {
    broker.setupAuthentication();

    let receiver = new Receiver(TOPIC);
    receiver.connect(() => {
        let storage = new Storage((message) => {
            console.log(message);
        });

        receiver.onMessage = (topic, message) => {
            storage.save(JSON.parse(message.toString()));
        }
    });

    let transmitter = new Transmitter(TOPIC);
    // begin transmitting temperature
    transmitter.start();
});
