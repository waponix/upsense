<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Session;

class VerifyAuthToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if(!$request->session()->get('accessToken')) {
            return redirect()->intended('/login');
        }
        return $next($request);

//        if(time() <= $request->session()->get('accessTokenExpiry')) {
//            return $next($request);
//        } else {
//            $refresh = Http::post(env('JWT_ISSUER') . '/auth/refresh');
//            if($refresh->successful()) {
//                $accessToken = JWT\JWT::jsonDecode($refresh->body())->result->accessToken;
//                $decoded = JWT\JWT::decode(
//                    $accessToken,
//                    env('JWT_SECRET'),
//                    [env('JWT_ALGORITHM')]
//                );
//
//                $request->session()->put('accessToken', $accessToken);
//                $request->session()->put('accessTokenExpiry', $decoded->exp);
//                return $next($request);
//            }
//
//            $request->session()->flush();
//            return redirect()->intended('/login');
//        }
    }
}
