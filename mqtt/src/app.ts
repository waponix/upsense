import { Broker } from './Broker';import { Receiver } from './Receiver';const { Transmitter } = require('./Transmitter');const { Storage } = require('./Storage');const TOPIC = 'sensor/temperature/reading';let broker = new Broker();broker.listen(() => {    // broker.setupAuthentication(); //disable this for now    let receiver = new Receiver(TOPIC);    receiver.connect(() => {        let storage = new Storage();        receiver.onMessage = (topic: string, message: Buffer) => {            storage.save(JSON.parse(message.toString()));        }    });    let transmitter = new Transmitter(TOPIC);    // begin transmitting temperature    transmitter.start();});