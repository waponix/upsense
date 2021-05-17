<?php

namespace App\Providers;

use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;
use Illuminate\Pagination\Paginator;

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
        View::share('JWT_ISSUER', env('JWT_ISSUER'));
        View::share('ROLES', self::ROLES);
        Paginator::useBootstrap();
    }
}
