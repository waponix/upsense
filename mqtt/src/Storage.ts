import {FieldType, InfluxDB} from 'influx';
import {influxConfig} from './config';
import moment from 'moment';

export class Storage
{
    client: any = null;

    constructor() {
        this.client = new InfluxDB(`${influxConfig.protocol}://${influxConfig.user}@${influxConfig.host}:${influxConfig.port}/${influxConfig.database}`);
        this.client.schema = [
            {
                measurement: 'reading',
                tags: ['imei'],
                fields: {
                    battery: FieldType.FLOAT,
                    temperature: FieldType.FLOAT,
                    humidity: FieldType.FLOAT
                }
            }
        ];
        this.client.getDatabaseNames()
            .then((names: any) => {
                if (!names.includes(influxConfig.database)) {
                    console.log(`Creating database ${influxConfig.database}`);
                    return this.client.createDatabase(influxConfig.database);
                }
            })
            .catch((error: any) => console.log({ error }));
    }

    save (data: any) {
        const dataTimestamp: number = moment(data.obj?.time).unix();

        let fields: any = {
            temperature: data.temperature,
            humidity: data.humidity,
            timestamp: dataTimestamp
        };

        if (data.battery) {
            fields.battery = data.battery;
        }

        this.client.writePoints([
            {
                measurement: 'reading',
                tags: {serial: data.obj?.devEUI},
                fields
            }
        ]).then(() => {
            // console.log('saved');
        }).catch((e: any) => {
            console.log(e);
        });
    }

    // constructor()
    // {
    //     this.client = new InfluxDB({url: `${influxConfig.protocol}://${influxConfig.host}:${influxConfig.port}`, token: influxConfig.token});
    //
    //     return this;
    // }
    //
    // save(reading: any)
    // {
    //     const writeApi = this.client.getWriteApi(influxConfig.org, influxConfig.database);
    //     writeApi.useDefaultTags({host: 'host2'});
    //
    //     const point = new Point('reading');
    //     point
    //         .floatField('temperature', reading.temperature)
    //         .intField('timestamp', reading.timestamp);
    //
    //     writeApi.writePoint(point);
    //     writeApi
    //         .close()
    //         .then(() => {
    //             // console.log(reading);
    //         })
    //         .catch((e: any) => {
    //             console.error(e);
    //         });
    //
    //     return this;
    // }
}
