import axios from 'axios';
import jwtDecode from 'jwt-decode';

const TOKEN_KEY = '_token';
const USER_KEY = '_user';

export const isBrowser = () => typeof window !== 'undefined';

/**
 * Store the token data
 * @param token
 */
const setToken = token => window.localStorage.setItem(TOKEN_KEY, JSON.stringify(token));

/**
 * Get the stored token
 * @param key
 * @returns {*}
 */
export const getToken = (key = 'accessToken') => isBrowser() ? JSON.parse(window.localStorage.getItem(TOKEN_KEY))[key] : {};

/**
 * Store the user data from the payload
 * @param user
 */
const setUser = user => window.localStorage.setItem(USER_KEY, JSON.stringify(user));

/**
 * Get the stored user data
 * @returns {any}
 */
export const getUser = () => isBrowser() ? JSON.parse(window.localStorage.getItem(USER_KEY)) : {};

/**
 * Handle the login
 * @param credentials
 * @returns {Promise<void>}
 */
export const handleLogin = async (credentials, successCallback, errorCallback) => {
    const authUrl = 'http://localhost:8443/api/v1/auth/login';

    try {
        let {data} = await axios.post(authUrl, {}, {'auth': {
                username: credentials.username,
                password: credentials.password
            }});

        let payload = jwtDecode(data.accessToken);
        let user = payload.user;

        // save the token
        setToken(data);

        // save the user
        setUser(user);

        successCallback();
    } catch (e) {
        if (e.response.status === 401) {
            errorCallback('Sign up details did not match');
        }
    }
};

/**
 * Check if a user is currently logged in
 * @returns {boolean}
 */
export const isLoggedIn = () => {
    // const user = getUser()
    // return !!user.username

    return !!getToken('refreshToken');
};

/**
 * Log out the currently logged in user
 * @param callback
 */
export const logout = callback => {
    setToken({});
    setUser({});
    callback();
};
