<?php

namespace App\Providers;

use Illuminate\Contracts\Auth\Guard;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\View;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        // 'App\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @param Guard $auth
     * @return void
     */
    public function boot(Guard $auth)
    {
        $this->registerPolicies();
        // Using Closure based composers
//        View::composer('*', function ($view) use ($auth) {
//            $view->with('currentAuthenticatedUser', $auth->user());
//        });

        //
    }
}
