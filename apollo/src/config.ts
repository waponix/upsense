import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

/**
 * application config
 */
export const appConfig = {
    port: process.env.API_PORT
};

/**
 * api pagination config
 */
export const paginationConfig = {
    pageMax: process.env.PAGE_LIMIT
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
