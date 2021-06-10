import axios from "axios";
import {axiosConfig} from "../config";
import {Request, Response} from "express";
import {KEY_ACCESS_TOKEN, KEY_REFRESH_TOKEN, TokenHandler} from "../middlewares/Security";

export const ApiAuth = axios.create(axiosConfig);
export const Api = (request: Request, response: Response) => {
    const tokenHandler: TokenHandler = new TokenHandler(request, response);

    const api = axios.create(axiosConfig);

    const handle_axios_error = function(err: any) {

        if (err.response) {
            let custom_error: any = new Error(err.response.statusText || 'Internal server error');
            custom_error.status = err.response.status || 500;
            custom_error.description = err.response.data ? err.response.data : null;
            throw custom_error;
        }
        throw new Error(err);
    }

    api.interceptors.request.use(
        config => {
            const token = tokenHandler.getToken(KEY_ACCESS_TOKEN);

            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        handle_axios_error);

    api.interceptors.response.use(
        response => {
            return response;
        }, async error => {
            const originalRequest = error.config;

            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                await tokenHandler.refreshToken();

                api.defaults.headers.common['Authorization'] = `Bearer ${tokenHandler.getToken(KEY_ACCESS_TOKEN)}`;
                return api(originalRequest);
            }

            return Promise.reject(handle_axios_error(error));
        });

    return api;
};
