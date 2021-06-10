import {Request, Response} from "express";
import {KEY_REFRESH_TOKEN, Login, TokenHandler} from "../middlewares/Security";

class LoginController
{
    public async loginView(request: Request, response: Response)
    {
        const tokenHandler: TokenHandler = new TokenHandler(request, response);

        if (tokenHandler.getToken(KEY_REFRESH_TOKEN) !== null) {
            return response.redirect('/dashboard');
        }

        let viewData: any = {
            title: 'Upsense Portal | Sign In'
        }

        if (request.method === 'POST') {
            if (!await Login(request, response)) {
                viewData.loginError = 'Invalid credential';
            }
        }

        return response.render('login.html.twig', viewData);
    }
}

export default new LoginController();
