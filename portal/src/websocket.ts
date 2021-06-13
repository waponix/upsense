import http from 'http';
import {mqttConfig} from "./config";
const mqtt = require('mqtt');
const WebSocket = require('ws');

let MQTT_OPTIONS = {
    port: mqttConfig.port,
    host: mqttConfig.host,
    protocol: mqttConfig.protocol,
    // username: mqttConfig.username,
    // password: mqttConfig.password,
    rejectUnauthorized: false,
};

export const WebSocketServer = async () => {
    const server = http.createServer();
    const wss = new WebSocket.Server({server});
    const mqttClient = mqtt.connect(MQTT_OPTIONS);

    wss.on('connection', function connection(ws: any) {
        ws.on('message', function incoming(data: any) {
            wss.clients.forEach(function each(client: any) {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(data);
                }
            });
        });
    });

    mqttClient.on('connect', () => {
        // make sure mqtt connection stablished before listening to ws connections
        console.log('Websocket connection to MQTT broker: OK');

        mqttClient.subscribe('sensor/data');

        mqttClient.on('message', (topic: string, data: Buffer) => {
            console.log(topic);
        });
    });

    try {
        await server.listen(mqttConfig.wsPort);
        console.log(`Websocket server listening at port ${mqttConfig.wsPort}`);
    } catch {
        console.log('Websocket server failed to start');
    }
}
