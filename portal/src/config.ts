import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

/**
 * Application config
 */
export const appConfig = {
    port: process.env.API_PORT
};

/**
 * Portal config
 */
export const portalConfig = {
    port: process.env.PORTAL_PORT
}

/**
 * API config
 */
export const apiConfig = {
    host: process.env.API_HOST,
    port: process.env.API_PORT
}

/**
 * Axios config
 */
export const axiosConfig = {
    baseURL: `http://${apiConfig.host}:${apiConfig.port}/v1`,
    timeout: 2000,
    headers: {
        'Content-Type': 'application/json'
    }
}

/**
 * MQTT config
 */
export const mqttConfig = {
    port: process.env.MQTT_PORT,
    wsPort: process.env.MQTT_WS_PORT,
    host: process.env.MQTT_HOST,
    protocol: process.env.MQTT_PROTOCOL,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
};
