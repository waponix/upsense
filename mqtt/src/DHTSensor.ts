const cmd = require('node-cmd');

const COMMAND = `sudo python3 ${__dirname}/../adaFruit/dhtSensor.py`

export interface DHTSensorOptions {
    readInterval?: number;
}

export default class DHTSensor
{
    command: string = COMMAND;
    loop: any;
    options: DHTSensorOptions = {};

    constructor (options: DHTSensorOptions = {}) {
        this.options.readInterval = (options.readInterval || 3) * 1000;
    }

    read (callback: CallableFunction) {
        // kill the interval if already started one
        this.stop();

        this.loop = setInterval(() => {
            const response = cmd.runSync(this.command);
            callback(response.data, response.err, response.stderr);
        }, this.options.readInterval)
    }

    stop () {
        if (this.loop !== null) {
            clearInterval(this.loop);
        }
    }
}
