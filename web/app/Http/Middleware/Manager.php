<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class Manager
{
    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param \Closure $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $roles = explode(',', $request->user()->menuroles);
        if (!in_array('manager', $roles)) {
            return abort(401);
        }
        return $next($request);
    }
}
