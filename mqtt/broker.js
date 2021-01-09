const tls = require('tls');
const fs = require('fs');
const aedes = require('aedes');

const PORT = 1883;
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

        console.log('Starting MQTT broker on port:' + PORT);

        this.server.listen(PORT, () => {
            console.log('MQTT broker now running at localhost:' + PORT);
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
