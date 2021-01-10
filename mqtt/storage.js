const {InfluxDB, Point} = require('@influxdata/influxdb-client');

// You can generate a Token from the "Tokens Tab" in the UI
const TOKEN = 'sHq-XTHEV0o4TQr5r4ihijDcGEzorE5Sq3n_eGvuEMYo6SkKOmTRxd54NsqX8m0VrhOMt6DvazGhvmAat_kKfw==';
const ORG = 'upsense';
const BUCKET = 'temperature';

class Storage
{
    client = null;

    constructor()
    {
        this.client = new InfluxDB({url: 'http://localhost:8086', token: TOKEN});

        return this;
    }

    save(reading)
    {
        const writeApi = this.client.getWriteApi(ORG, BUCKET);
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
