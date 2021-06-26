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
import {NotificationLogRepository} from "./v1/rest/repositories/NotificationLogRepository";
import {NotificationLog} from "./v1/shared/entities/NotificationLog";
import {SensorStatus} from "./components/types/SensorStatus";

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
const NOTIF_SENSOR_ABNORMAL = 1;

export class SubscriberApp
{
    private client: any = null;
    private sensorRepository: SensorRepository;
    private sensorReadingRepository: SensorReadingRepository;
    private zoneRepository: ZoneRepository;
    private notificationLogRepository: NotificationLogRepository;
    private hubRepository: HubRepository;
    private topic: string = 'iot/+/sensor';
    private transporter: any;

    constructor() {
        this.sensorRepository = new SensorRepository(Sensor);
        this.sensorReadingRepository = new SensorReadingRepository(SensorReading);
        this.zoneRepository = new ZoneRepository(Zone);
        this.hubRepository = new HubRepository(Hub);
        this.notificationLogRepository = new NotificationLogRepository(NotificationLog);

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
        await this.hubRepository.queryRunner.startTransaction();
        let hub: Hub | undefined = await this.hubRepository.findOneBy({serial: data.obj?.rxInfo[0].mac});
        try {
            if (hub === undefined) {
                hub = new Hub();
                hub.serial = data.obj?.rxInfo[0].mac;
            }

            // update hub data
            hub.isConnected = 1;
            hub.deviceName = data.obj?.rxInfo[0].name;
            hub.lastSeen = dataTimestamp;

            await this.hubRepository.save(hub);
            await this.hubRepository.queryRunner.commitTransaction();
        } catch {
            await this.hubRepository.queryRunner.rollbackTransaction();
        } finally {
            await this.hubRepository.queryRunner.release();
        }


        await this.sensorRepository.init();
        await this.sensorRepository.queryRunner.startTransaction();
        let sensor: Sensor | undefined = await this.sensorRepository.findOneBy({serial: data.obj?.devEUI}, ['hub']);

        if (sensor === undefined) {
            sensor = new Sensor();
            if (hub) {
                sensor.hub = hub;
            }
            sensor.serial = data.obj?.devEUI;
        }

        // Handle notifications
        let isSensorHealthy = true;
        if (sensor.maxTemp !== null && data.temperature > sensor.maxTemp) {
            isSensorHealthy = false;
        }

        if (sensor.minTemp !== null && data.temperature < sensor.minTemp) {
            isSensorHealthy = false;
        }

        try {
            sensor.deviceName = data.obj?.deviceName;
            sensor.currentTemp = data.temperature;

            if (data.battery) {
                sensor.batteryStatus = data.battery;
            }
            //@ts-ignore
            sensor.lastSeen = dataTimestamp;
            sensor.isConnected = 1;
            sensor.status = isSensorHealthy ? SensorStatus.healthy : SensorStatus.warning;

            await this.sensorRepository.save(sensor);
            await this.sensorRepository.queryRunner.commitTransaction();
        } catch {
            await this.sensorRepository.queryRunner.rollbackTransaction();
        } finally {
            await this.sensorRepository.queryRunner.release();
        }

        if (data.temperature && data.humidity) {
            await this.sensorReadingRepository.init();
            await this.sensorReadingRepository.queryRunner.startTransaction();

            let sensorReading = new SensorReading();
            try {
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
                await this.sensorReadingRepository.queryRunner.commitTransaction();
            } catch {
                await this.sensorReadingRepository.queryRunner.rollbackTransaction();
            } finally {
                await this.sensorReadingRepository.queryRunner.release();
            }
        }

        // Send realtime sensor updates
        this.client.publish('sensors/data', JSON.stringify({
            temperature: data.temperature,
            humidity: data.humidity,
            battery: data.battery || sensor.batteryStatus,
            serial: sensor.serial,
            timestamp: dataTimestamp
        }));

        await this.hubRepository.init();
        // send email notification to all users
        let result: string[] = await this.hubRepository.findUserEmailsForNotification(sensor.hub);
        await this.hubRepository.queryRunner.release();
        let emails: string[] = [];
        for(const row of result) {
            emails.push((<any>row).email);
        }

        do {
            if (emails.length <= 0) {
                break;
            }

            let notificationLog = new NotificationLog();
            notificationLog.maxTemp = sensor.maxTemp;
            notificationLog.minTemp = sensor.minTemp;
            notificationLog.recordedTemp = sensor.currentTemp;
            notificationLog.sensor = sensor;

            if (!isSensorHealthy) {
                await this.zoneRepository.init();
                const zone: Zone | undefined = await this.zoneRepository.findOneByHub(sensor.hub);
                await this.zoneRepository.queryRunner.release();
                let zoneName = 'N/A'
                if (zone !== undefined) {
                    zoneName = zone.name;
                }

                if (!alarmingSensors[sensor.serial]) {
                    // cache the sensor that has abnormal reading
                    alarmingSensors[sensor.serial] = true;

                    // only send email notification once
                    await this.sendEmailNotification(emails, zoneName, sensor.name, data.temperature, NOTIF_SENSOR_ABNORMAL);
                }

                await this.notificationLogRepository.init();
                try {
                    notificationLog.message = 'Sensor temperature levels exceeded the set limit';
                    await this.notificationLogRepository.save(notificationLog);
                    this.client.publish('notifications', '');
                } finally {
                    await this.notificationLogRepository.queryRunner.release();
                }
            } else if (isSensorHealthy && alarmingSensors[sensor.serial]) {
                // if sensor came back to normal operation send another notification
                delete alarmingSensors[sensor.serial];

                await this.zoneRepository.init();
                const zone: Zone | undefined = await this.zoneRepository.findOneByHub(sensor.hub);
                await this.zoneRepository.queryRunner.release();
                let zoneName = 'N/A'
                if (zone !== undefined) {
                    zoneName = zone.name;
                }
                await this.sendEmailNotification(emails, zoneName, sensor.name, data.temperature, NOTIF_SENSOR_NORMAL);

                await this.notificationLogRepository.init();
                try {
                    notificationLog.message = 'Sensor temperature levels went back to normal';
                    await this.notificationLogRepository.save(notificationLog);
                    this.client.publish('notifications', '');
                } finally {
                    await this.notificationLogRepository.queryRunner.release();
                }
            }

            break;
        } while (true);
    }

    private async sendEmailNotification(emails: string[], zoneName: string, sensorName: string, temperature: number, notifType: number)
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
            while (emails.length > 0) {
                const email: string | undefined = emails.pop();

                await this.transporter.sendMail({
                    from: `Upsense <${mailerConfig.user}>`, // sender address
                    to: email, // list of receivers
                    subject: `Temperature Alert - ${zoneName} - ${sensorName}`, // Subject line
                    html: content
                });
            }
        } catch (e) {
            console.log(e);
        }
    }
}
