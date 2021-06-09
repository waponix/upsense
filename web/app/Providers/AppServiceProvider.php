<?php

namespace App\Providers;

use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Config;

class AppServiceProvider extends ServiceProvider
{

    const ROLES = [
        'user',
        'manager',
        'admin'
    ];

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        View::share('JWT_ISSUER', Config::get('app.JWT_ISSUER'));
        View::share('JWT_SSL_ISSUER', Config::get('app.JWT_SSL_ISSUER'));
        View::share('WS_ISSUER', Config::get('app.WS_ISSUER'));
        View::share('ROLES', self::ROLES);
        Paginator::useBootstrap();
    }
}
