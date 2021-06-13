//@ts-ignore
import mqtt from 'mqtt';
import {mailerConfig, mqttConfig} from './config';
import {SensorRepository} from "./v1/rest/repositories/SensorRepository";
import {Sensor} from "./v1/shared/entities/Sensor";
import moment from 'moment';
import {SensorReadingRepository} from "./v1/rest/repositories/SensorReadingRepository";
import {SensorReading} from "./v1/shared/entities/SensorReading";
import {HubRepository} from "./v1/rest/repositories/HubRepository";
import {Hub} from "./v1/shared/entities/Hub";
import {ZoneRepository} from "./v1/rest/repositories/ZoneRepository";
import {Zone} from "./v1/shared/entities/Zone";
import {LogRepository} from "./v1/rest/repositories/LogRepository";
import {Log} from "./v1/shared/entities/Log";

const nodeMailer = require('nodemailer');

let MQTT_OPTIONS = {
    port: mqttConfig.port,
    host: mqttConfig.host,
    protocol: mqttConfig.protocol,
    // username: mqttConfig.username,
    // password: mqttConfig.password,
    rejectUnauthorized: false,
};

let alarmingSensors: any = {};

const NOTIF_SENSOR_NORMAL = 0;
const NOTIF_SENSOR_ABNORMAL = 0;

export class SubscriberApp
{
    private client: any = null;
    private sensorRepository: SensorRepository;
    private sensorReadingRepository: SensorReadingRepository;
    private zoneRepsoitory: ZoneRepository;
    private logRepository: LogRepository;
    private hubRepository: HubRepository;
    private topic: string = 'iot/+/sensor';
    private transporter: any;

    constructor() {
        this.sensorRepository = new SensorRepository(Sensor);
        this.sensorReadingRepository = new SensorReadingRepository(SensorReading);
        this.zoneRepsoitory = new ZoneRepository(Zone);
        this.hubRepository = new HubRepository(Hub);
        this.logRepository = new LogRepository(Log);

        this.client = mqtt.connect(MQTT_OPTIONS);

        this.transporter = nodeMailer.createTransport({
            host: mailerConfig.host,
            port: mailerConfig.port,
            secure: false,
            auth: {
                user: mailerConfig.user,
                pass: mailerConfig.password
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        this.client.on('connect', () => {
            console.log('Connection to the MQTT broker: OK')
            // subscribe to a topic
            this.client.subscribe(this.topic);

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
        const dataTimestamp: number = moment(data.obj?.time).unix();

        await this.hubRepository.init();
        let hub: Hub | undefined = await this.hubRepository.findOneBy({serial: data.obj?.rxInfo[0].mac});

        if (hub === undefined) {
            hub = new Hub();
            hub.serial = data.obj?.rxInfo[0].mac;
        }

        // update hub data
        hub.isConnected = 1;
        hub.name = data.obj?.rxInfo[0].name;
        hub.lastSeen = dataTimestamp;

        await this.hubRepository.save(hub);
        await this.hubRepository.queryRunner.release();


        await this.sensorRepository.init();
        let sensor: Sensor | undefined = await this.sensorRepository.findOneBy({serial: data.obj?.devEUI}, ['hub']);

        if (sensor === undefined) {
            sensor = new Sensor();
            if (hub) {
                sensor.hub = hub;
            }
            sensor.serial = data.obj?.devEUI;
        }

        sensor.name = data.obj?.deviceName;
        sensor.currentTemp = data.temperature;

        if (data.battery) {
            sensor.batteryStatus = data.battery;
        }
        //@ts-ignore
        sensor.lastSeen = dataTimestamp;
        sensor.isConnected = 1;

        await this.sensorRepository.save(sensor);
        await this.sensorRepository.queryRunner.release();

        if (data.temperature && data.humidity) {
            await this.sensorReadingRepository.init();

            let sensorReading = new SensorReading();
            sensorReading.temperature = data.temperature;
            sensorReading.humidity = data.humidity;
            sensorReading.timestamp = dataTimestamp;

            if (data.battery) {
                sensorReading.battery = data.battery;
            }

            if (sensor) {
                sensorReading.sensor = sensor;
            }

            await this.sensorReadingRepository.save(sensorReading);
            await this.sensorReadingRepository.queryRunner.release();
        }

        // Send realtime sensor udpates
        this.client.publish('sensors/data', JSON.stringify({
            temperature: data.temperature,
            humidity: data.humidity,
            battery: data.battery || sensor.batteryStatus,
            serial: sensor.serial
        }));

        // Handle notifications
        let triggerSendNotification = false;
        if (sensor.maxTemp !== null && data.temperature > sensor.maxTemp) {
            triggerSendNotification = true;
        }

        if (sensor.minTemp !== null && data.temperature < sensor.minTemp) {
            triggerSendNotification = true;
        }

        await this.hubRepository.init();
        await this.logRepository.init();
        // send email notification to all users
        let result: string[] = await this.hubRepository.findUserEmailsForNotification(sensor.hub);
        let emails: string[] = [];
        for(const row of result) {
            emails.push((<any>row).email);
        }

        do {
            if (emails.length <= 0) {
                break;
            }

            const logData = {
                sensor,
                message: '',
                maxtemp: sensor.maxTemp,
                minTemp: sensor.minTemp,
                recordedTemp: data.temperature
            }

            await this.zoneRepsoitory.init();

            if (triggerSendNotification) {
                if (!alarmingSensors[sensor.serial]) {
                    // cache the sensor that has abnormal reading
                    alarmingSensors[sensor.serial] = true;
                }

                const zone: Zone | undefined = await this.zoneRepsoitory.findOneByHub(sensor.hub);
                let zoneName = 'N/A'
                if (zone !== undefined) {
                    zoneName = zone.name;
                }
                this.sendEmailNotification(emails.join(','), zoneName, sensor.name, data.temperature, NOTIF_SENSOR_ABNORMAL);

                logData.message = 'Sensor temperature levels exceeded the set limit';
                await this.logRepository.create(logData);
            } else {
                // if sensor came back to normal operation send another notification
                if (alarmingSensors[sensor.serial]) {
                    delete alarmingSensors[sensor.serial];

                    await this.zoneRepsoitory.init();
                    const zone: Zone | undefined = await this.zoneRepsoitory.findOneByHub(sensor.hub);
                    let zoneName = 'N/A'
                    if (zone !== undefined) {
                        zoneName = zone.name;
                    }
                    this.sendEmailNotification(emails.join(','), zoneName, sensor.name, data.temperature, NOTIF_SENSOR_NORMAL);

                    logData.message = 'Sensor temperature levels went back to normal';
                    await this.logRepository.create(logData);
                }
            }

            await this.zoneRepsoitory.queryRunner.release();

            break;
        } while (true);

        await this.hubRepository.queryRunner.release();
        await this.logRepository.queryRunner.release();
    }

    private async sendEmailNotification(emails: string, zoneName: string, sensorName: string, temperature: number, notifType: number)
    {
        let date = moment();

        const message1 =
            "" +
            "<p>Dear User,</p><br>" +
            `<p>The temperature has gone back to acceptable levels in ${zoneName} -  ${sensorName}.</p>` +
            `<p>At <b>${date.format('DD-MM-YYYY hh:mm:ss a')}</b>, the temperature recorded was <b>${temperature}°C</b> for this location.</p>` +
            "<p>Thank you,</p>" +
            "<p>Upsense Team</p>"; // html body

        const message2 =
            "" +
            "<p>Dear User,</p><br>" +
            `<p>The temperature limit has exceeded in ${zoneName} -  ${sensorName}.</p>` +
            `<p>At <b>${date.format('DD-MM-YYYY hh:mm:ss a')}</b>, the temperature recorded was <b>${temperature}°C</b> for this location.</p>` +
            "<p>Do check to ensure your operations are not affected.</p><br>" +
            "<p>Thank you,</p>" +
            "<p>Upsense Team</p>"; // html body

        let content: string = '';

        switch (notifType) {
            case NOTIF_SENSOR_NORMAL: content = message1; break;
            case NOTIF_SENSOR_ABNORMAL: content = message2; break;
        }

        // send mail with defined transport object
        try {
            let info = await this.transporter.sendMail({
                from: `Upsense <${mailerConfig.user}>`, // sender address
                to: emails, // list of receivers
                subject: `Temperature Alert - ${zoneName} - ${sensorName}`, // Subject line
                html: content
            });
        } catch (e) {
            console.log(e);
        }
    }
}
