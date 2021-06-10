import {NextFunction, Request, Response} from "express";
import {ApiAuth} from "../components/api";
import jwt_decode from 'jwt-decode';
import moment from 'moment';

export const KEY_ACCESS_TOKEN = 'uat';
export const KEY_REFRESH_TOKEN = 'urt';

export class TokenHandler
{
    private request: Request;
    private response: Response;

    constructor(request: Request, response: Response)
    {
        this.request = request;
        this.response = response;
    }

    public getToken(key: string)
    {
        switch (key) {
            case KEY_ACCESS_TOKEN: return this.request.cookies[KEY_ACCESS_TOKEN] || null;
            case KEY_REFRESH_TOKEN: return this.request.cookies[KEY_REFRESH_TOKEN] || null;
            default: return null
        }
    }

    public storeToken(key: string, token: string)
    {
        let options: any = { httpOnly: true};

        if (key === KEY_REFRESH_TOKEN) {
            options.expires = moment().add(1, 'day').toDate();
        }

        this.response.cookie(key, token, options);
        return this;
    }

    public async refreshToken()
    {
        // check if cookie exist
        if (this.getToken(KEY_REFRESH_TOKEN) === null) {
            // nothing to do
            return false;
        }

        // try to refresh the token
        try {
            const apiResponse: any = await ApiAuth.post('auth/refresh', {}, {
                headers: { 'Authorization': `Bearer ${this.getToken(KEY_REFRESH_TOKEN)}` }
            });

            this.storeToken(KEY_ACCESS_TOKEN, apiResponse.data.result.accessToken);
            this.storeToken(KEY_REFRESH_TOKEN, apiResponse.data.result.refreshToken);

            return true;
        } catch (e) {
            console.log(e.response.data.result.error || 'Auth refresh failed');
        }

        this.clearToken();

        return false;
    }

    public getUserToken()
    {
        const accessToken = this.getToken(KEY_ACCESS_TOKEN);

        if (accessToken === null) {
            return null;
        }

        const decoded: any = jwt_decode(accessToken);

        return decoded.user || null;
    }

    public clearToken()
    {
        this.response.clearCookie(KEY_ACCESS_TOKEN);
        this.response.clearCookie(KEY_REFRESH_TOKEN);
        return this;
    }
}

export const Login = async function (request: Request, response: Response) {
    // try to login with the provider credentials
    const tokenHandler = new TokenHandler(request, response);

    const username = request.body.username || null;
    const password = request.body.password || null;

    try {
        const apiRequest: any = await ApiAuth.post('auth/login', {}, { auth: {username, password} });

        tokenHandler.storeToken(KEY_ACCESS_TOKEN, apiRequest.data.result.accessToken || null);
        tokenHandler.storeToken(KEY_REFRESH_TOKEN, apiRequest.data.result.refreshToken || null);

        response.redirect('/dashboard');
    } catch (e) {
        console.log(e.response.data);
        return false;
    }
}

export const Logout = async function (request: Request, response: Response) {
    const tokenHandler = new TokenHandler(request, response);

    tokenHandler.clearToken();

    return response.redirect('/login');
}

export const SessionRefresh = async function (request: Request, response: Response, next: NextFunction) {
    // do the authentication here
    const tokenHandler = new TokenHandler(request, response);
    // try to refresh the token
    await tokenHandler.refreshToken();

    response.locals._user = await tokenHandler.getUserToken();
    next();
}

export const Authenticate = async function (request: Request, response: Response, next: NextFunction) {
    const tokenHandler = new TokenHandler(request, response);

    if (tokenHandler.getToken(KEY_REFRESH_TOKEN) === null) {
        return response.redirect('/login');
    }

    next();
}
