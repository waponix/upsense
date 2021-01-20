import jwtDecode from 'jwt-decode';
import { endAuth, requestAuth } from './authApi';

const TOKEN_KEY = '_token';
const USER_KEY = '_user';

export const isBrowser = () => typeof window !== 'undefined';

/**
 * Store the token data
 * @param token
 */

export const setToken = token => {
    window.localStorage.setItem(TOKEN_KEY, JSON.stringify(token));

    if (token.accessToken) {
        const accessToken = token.accessToken;
        const { user } = jwtDecode(accessToken);

        // set the user
        setUser(user);
    } else {
        setUser({});
    }
}

/**
 * Get the stored token
 * @param key
 * @returns {*}
 */
export const getToken = (key = 'accessToken') => {
    if (isBrowser()) {
        const token = JSON.parse(window.localStorage.getItem(TOKEN_KEY));
        if (token !== null) {
            return token[key];
        }
    }

    return null;
};

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
    try {
        let { accessToken, refreshToken, resultCode } = await requestAuth(credentials.username, credentials.password);

        // save the token
        setToken({ accessToken, refreshToken });

        successCallback();
    } catch (e) {
        console.log('Login failed with error:', e);
        if (e.response && e.response.status === 401) {
            errorCallback('Sign up details did not match');
        } else {
            errorCallback('Something went wrong, please try again')
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
    endAuth();
    setToken({});
    callback();
};
