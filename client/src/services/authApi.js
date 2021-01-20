import axios from 'axios';
import { getToken, setToken, logout } from './auth';
import { navigate } from 'gatsby';


const apiBaseUri = 'http://localhost:8443/';
const apiAuthUrl = `api/graphql/auth`;

let api = axios.create({
    baseURL: apiBaseUri,
    timeout: 1000,
    headers: {'Content-Type': 'application/json'}
});

// this is only used in login page
export const requestAuth = async (username, password) => {
    try {
        const requestBody = { query:
                `mutation {
                    login (username: "${username}" password: "${password}") {
                        accessToken
                        refreshToken
                    }
                }`};
        let {data: {data: {login}}} = await api.post(apiAuthUrl, requestBody);

        return login;
    } catch (e) {
        console.log(e);
    }
};

export const endAuth = async () => {
    try {
        const requestBody = {
            query:
                `   
                mutation {
                    logout(auth: "${getToken('refreshToken')}")
                }
            `
        };

        await api.post(apiAuthUrl, requestBody);
    } catch (e) {
        console.log(e);
    }
};

export const refreshAuth = async () => {
    try {
        const refreshToken = getToken('refreshToken')
        const requestBody = {
            query:
                `
             mutation {
                refresh (auth: "${refreshToken}") {
                    accessToken
                    refreshToken
                    message
                    resultCode
                }
             }
            `
        }

        let {data: {data: {refresh}}} = await api.post(apiAuthUrl, requestBody);

        if (refresh.resultCode === 0) {
            setToken({accessToken: refresh.accessToken, refreshToken: refresh.refreshToken});
        } else {
            logout(() => navigate('/auth/login'));
            return null;
        }

        return refresh;
    } catch (e) {
        console.log(e);
    }
};
