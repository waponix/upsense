import axios from 'axios';
import { getToken } from './auth';
import jwtDecode from 'jwt-decode';

const apiBaseUri = 'http://localhost:8443/';
const apiAuthUrl = `${apiBaseUri}api/graphql/auth`;
const apiUrl = `${apiBaseUri}api/graphql`;

// use this for all of the api calls under /api/graphql
const authorization = (type = 'access') => {
    return {
        headers: {
            Authorization: `Bearer ${getToken(`${type}Token`)}`
        }
    };
}

// this is only used in login page
export const requestAuth = async (username, password) => {
    const requestBody = { query:
            `mutation {
                login (username: "${username}" password: "${password}") {
                    accessToken
                    refreshToken
                }
            }`};
    let {data: {data: {login}}} = await axios.post(apiAuthUrl, requestBody);

    return login;
}

export const getCompanies = async (...args) => {
    try {
        const requestBody = { query:
                `query {
            companies {
                name
                createdAt
            }
        }`};

        let {data: {data: {companies}}} = await axios.post(apiUrl, requestBody, authorization());

        return companies;
    } catch (e) {
        console.log(e.response)
    }
}

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

        await axios.post(apiAuthUrl, requestBody);
    } catch (e) {
        console.log(e);
    }
}
