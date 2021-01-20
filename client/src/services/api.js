import axios from 'axios';
import { getToken } from './auth';
import { refreshAuth } from './authApi';

const apiBaseUri = 'http://localhost:8443/';
const apiAuthUrl = `api/graphql/auth`;
const apiUrl = `api/graphql`;

// use this for accessing apis under /api/graphql
let api = axios.create({
    baseURL: apiBaseUri,
    timeout: 1000,
    headers: {'Content-Type': 'application/json'}
});

api.interceptors.request.use(
    config => {
        const token = getToken();

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        Promise.reject(error);
    });

api.interceptors.response.use(
    response => {
        return response;
    }, async error => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

           await refreshAuth();

            api.defaults.headers.common['Authorization'] = `Bearer ${getToken()}`;
            return api(originalRequest);
        }

        return Promise.reject(error);
    });

export const getCompanies = async (...args) => {
    try {
        const requestBody = { query:
                `query {
            companies {
                name
                createdAt
            }
        }`};

        let {data: {data: {companies}}} = await api.post(apiUrl, requestBody);

        return companies;
    } catch (e) {
        console.log(e.response);
    }
};
