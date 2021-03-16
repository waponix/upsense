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
//        $this->middleware('user')->except('logout');
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
        $res = Http::withBasicAuth($request->get('email'), $request->get('password'))
            ->post(env('JWT_ISSUER') . '/auth/login');
        if ($res->successful()) {
            $accessToken = JWT\JWT::jsonDecode($res->body())->result->accessToken;
            $decoded = JWT\JWT::decode(
                $accessToken,
                env('JWT_SECRET'),
                [env('JWT_ALGORITHM')]
            );

            $user = new User();
            $user->id = $decoded->user->id;
            $user->email = $decoded->user->email;
            $user->mobile = $decoded->user->mobileNumber;
            $user->first_name = $decoded->user->firstName;
            $user->last_name = $decoded->user->lastName;
            $user->role = $decoded->user->role;

            Auth::login($user);

            $request->session()->put('accessToken', $accessToken);
            $request->session()->regenerate();

            return redirect()->intended('/');
        }


        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }

    /**
     * Logs out user
     * @return RedirectResponse
     */
    public function logout()
    {
        Auth::logout();
        Session::flush();

        return redirect()->intended('/login');
    }
}
