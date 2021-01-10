const Influx = require('influx');

const DATABASE = 'temperature_reading';

const CONNECTION_OPTION = {
    host: 'localhost',
    port: 8086,
    database: DATABASE,
    username: 'root',
    password: 'admin123',
    schema: [
        {
            measurement: 'temperature',
            fields: {
                temperature: Influx.FieldType.FLOAT,
            },
            tags: ['host'],
        },
    ],
};

class Storage {
    influx = null;

    constructor(cb = () => {})
    {
        this.influx = new Influx.InfluxDB(CONNECTION_OPTION);

        this.influx.getDatabaseNames().then((names) => {
            console.log(names);
            if (!names.includes(DATABASE)) {
                return this.influx.createDatabase(DATABASE);
            }

            return null;
        }).then(cb);
    }

    save(message, cb = () => {}) {
        console.log(`Storing message: ${message.temperature} ${message.timestamp}`);
        this.influx.writePoints([
            {
                measurement: 'temperature',
                fields: {
                    temperature: message.temperature,
                },
                timestamp: message.timestamp,
            },
        ])
            .then(cb)
    }
}

module.exports = Storage;
