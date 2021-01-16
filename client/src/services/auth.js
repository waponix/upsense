import axios from 'axios';
import jwtDecode from 'jwt-decode';

export const isBrowser = () => typeof window !== 'undefined';

const setToken = token => window.localStorage.setItem("_token", JSON.stringify(token));

export const handleLogin = async (credentials) => {
    const authUrl = 'http://localhost:8443/api/v1/auth/login';

    try {
        let response = await axios.post(authUrl, {}, {'auth': {
                username: credentials.username,
                password: credentials.password
            }});

        console.log(jwtDecode(response.data.accessToken));

        // save the token
        setToken(response.data);
    } catch (e) {
        alert(e);
    }
}

export const isLoggedIn = () => {
    // const user = getUser()
    // return !!user.username
    return false;
};

export const logout = callback => {
    // setUser({})
    // callback()
    setToken({});
};
