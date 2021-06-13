// import tls from 'tls';
import net from 'net';
import http from 'http';
import aedes from 'aedes';
import { mqttConfig } from './config';

// const OPTIONS = {
//     key: fs.readFileSync(`${__dirname}/../../certificates/cert.key`),
//     cert: fs.readFileSync(`${__dirname}/../../certificates/cert.pem`),
// };

export class Broker
{
    aedes: any;
    mqttServer: any;
    wsServer: any;
    httpServer: any;

    constructor() {
        this.aedes = aedes();
        this.mqttServer = net.createServer(this.aedes.handle);
        this.httpServer = http.createServer();
    }

    async listen(cb: CallableFunction = () => {})
    {
        await this.mqttServer.listen(mqttConfig.port);
        console.log(`MQTT Broker Server now running at port ${mqttConfig.port}`);

        cb();

        return this;
    }

    // setupAuthentication()
    // {
    //     this.aedes.authenticate = (client: Client, username: string, password: Buffer, cb: CallableFunction) => {
    //         if (username && username === 'root') {
    //             if (password && typeof password === 'object' && password.toString() === 'admin') {
    //                 cb(null, true);
    //                 console.log(`Client: ${client} authenticated successfully`);
    //             }
    //         } else {
    //             cb(false, false);
    //         }
    //     }
    //
    //     return this;
    // }
}
