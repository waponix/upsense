import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

/**
 * Application config
 */
export const appConfig = {
    port: process.env.API_PORT
};

/**
 * API pagination config
 */
export const paginationConfig = {
    limit: 25
}

/**
 * JWT config
 */
export const jwtConfig = {
    algorithm: process.env.JWT_ALGORITHM,
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    issuer: process.env.JWT_ISSUER,
    expiry: process.env.JWT_EXPIRY,
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY
}

/**
 * MQTT config
 */
export const mqttConfig = {
    host: process.env.MQTT_HOST,
    port: process.env.MQTT_PORT,
    protocol: process.env.MQTT_PROTOCOL,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD
}

/**
 * Mailer config
 */
export const mailerConfig = {
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    user: process.env.MAILER_USER,
    password: process.env.MAILER_PWD
}
