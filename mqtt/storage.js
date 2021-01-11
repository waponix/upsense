const {InfluxDB, Point} = require('@influxdata/influxdb-client');
const {INFLUX_TOKEN, INFLUX_ORG, INFLUX_BUCKET, INFLUX_PROTOCOL, INFLUX_PORT, INFLUX_HOST} = require('./config');

class Storage
{
    client = null;

    constructor()
    {
        this.client = new InfluxDB({url: INFLUX_PROTOCOL  + '://' + INFLUX_HOST + ':' + INFLUX_PORT, token: INFLUX_TOKEN});

        return this;
    }

    save(reading)
    {
        const writeApi = this.client.getWriteApi(INFLUX_ORG, INFLUX_BUCKET);
        writeApi.useDefaultTags({host: 'host1'});

        const point = new Point('reading');
        point
            .floatField('temperature', reading.temperature)
            .intField('timestamp', reading.timestamp);

        writeApi.writePoint(point);
        writeApi
            .close()
            .then(() => {
                console.log(reading);
            })
            .catch(e => {
                console.error(e)
                console.log('\nFinished ERROR')
            });

        return this;
    }
}

module.exports = Storage;
