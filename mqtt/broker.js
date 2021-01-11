const tls = require('tls');
const fs = require('fs');
const aedes = require('aedes');
const {MQTT_PORT, MQTT_HOST} = require('./config');

const OPTIONS = {
    key: fs.readFileSync('./certificates/cert.key'),
    cert: fs.readFileSync('./certificates/cert.pem'),
};

class Broker
{
    aedes = null;
    server = null;

    listen(cb = () => {})
    {
        this.aedes = aedes();
        this.server = tls.createServer(OPTIONS, this.aedes.handle);

        console.log('Starting MQTT broker on port: ' + MQTT_PORT);

        this.server.listen(MQTT_PORT, () => {
            console.log('MQTT broker now running at ' + MQTT_HOST + ': ' + MQTT_PORT);
            cb();
        });

        return this;
    }

    setupAuthentication()
    {
        this.aedes.authenticate = (client, username, password, cb) => {
            if (username && typeof username === 'string' && username === 'root') {
                if (password && typeof password === 'object' && password.toString() === 'admin') {
                    cb(null, true);
                    console.log('Client: ' + client + ' authenticated successfully');
                }
            } else {
                cb(false, false);
            }
        }

        return this;
    }
}

module.exports = Broker;
