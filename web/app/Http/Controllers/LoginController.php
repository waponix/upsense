<?php

namespace App\Http\Controllers;

use App\Models\User;
use Firebase\JWT;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Session;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        JWT\JWT::$leeway = 1;
    }

    public function index()
    {
        return view('auth.login');
    }

    /**
     * Handle an authentication attempt.
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function authenticate(Request $request)
    {
        $error = '';
        try {
            $res = Http::withBasicAuth($request->get('email'), $request->get('password'))
                ->post(env('JWT_ISSUER') . '/auth/login');

            if ($res->failed()) {
                if ($res->status() == 401) {
                    $error = 'The provided credentials do not match our records.';
                }
                if ($res->status() == 503) {
                    $error = 'API service unavailable.';
                }
            }

            if ($res->successful()) {
                $accessToken = JWT\JWT::jsonDecode($res->body())->result->accessToken;
                $refreshToken = JWT\JWT::jsonDecode($res->body())->result->refreshToken;

                $decoded = JWT\JWT::decode(
                    $accessToken,
                    env('JWT_SECRET'),
                    [env('JWT_ALGORITHM')]
                );

                $user = new User();
                $user->id = $decoded->user->id;
                $user->email = $decoded->user->email;
                $user->mobile = $decoded->user->mobile;
                $user->first_name = $decoded->user->firstName;
                $user->last_name = $decoded->user->lastName;
                $user->role = $decoded->user->role;

                $request->session()->put('accessToken', $accessToken);
                $request->session()->put('refreshToken', $refreshToken);
//            $request->session()->put('accessTokenExpiry', $decoded->exp);
                $request->session()->put('user', $user);
                $request->session()->regenerate();

                return redirect()->intended('/');
            }
        } catch (\Exception $e) {
            $error = 'There is something wrong with the server. Please contact administrator.';
        }

        if ($error != '') {
            return back()->withErrors([
                $error,
            ]);
        }
    }

    /**
     * @param Request $request
     * @return bool
     */
    public function refreshToken(Request $request)
    {
        $res = Http::post(env('JWT_ISSUER') . '/auth/refresh');
        if ($res->successful()) {
            $accessToken = JWT\JWT::jsonDecode($res->body())->result->accessToken;
            $refreshToken = JWT\JWT::jsonDecode($res->body())->result->refreshToken;
            $decoded = JWT\JWT::decode(
                $accessToken,
                env('JWT_SECRET'),
                [env('JWT_ALGORITHM')]
            );

            $request->session()->put('accessToken', $accessToken);
            $request->session()->put('refreshToken', $refreshToken);
        } else {
            $this->logout($request);
        }

        return true;
    }

    /**
     * Logs out user
     * @param Request $request
     * @return RedirectResponse
     */
    public function logout(Request $request)
    {
        Auth::logout();
        Session::flush();
        return redirect()->intended('/login');
    }
}
