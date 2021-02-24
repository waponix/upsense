<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::group(['middleware' => ['get.menu']], function () {
//    Route::get('/profile', function () {
//        return view('dashboard.user.profile');
//    });
    Route::get('/profile', 'UsersController@profile')->name('user.profile');
    Route::get('/profile/edit', 'UsersController@profileEdit')->name('user.profile.edit');


//    Route::get('/', function () {           return view('dashboard.homepage'); });
    Route::get('/', 'HomeController@index')->name('dashboard.homepage.index');
//    Route::get('/', [
//        'middleware' => ['auth'],
//        'uses'=>'HomeController@index',
//    ]);

    Route::group(['middleware' => ['role:user']], function () {
        Route::get('/reports', function () {
            return view('dashboard.reports');
        });
        Route::get('/404', function () {
            return view('dashboard.404');
        });
        Route::get('/500', function () {
            return view('dashboard.500');
        });
        Route::prefix('base')->group(function () {
            Route::get('/breadcrumb', function () {
                return view('dashboard.base.breadcrumb');
            });
            Route::get('/forms', function () {
                return view('dashboard.base.forms');
            });
        });
    });


    Auth::routes();

    Route::resource('resource/{table}/resource', 'ResourceController')->names([
        'index' => 'resource.index',
        'create' => 'resource.create',
        'store' => 'resource.store',
        'show' => 'resource.show',
        'edit' => 'resource.edit',
        'update' => 'resource.update',
        'destroy' => 'resource.destroy'
    ]);

    Route::group(['middleware' => ['role:admin']], function () {
        Route::resource('bread', BreadController::class);   //create BREAD (resource)
        Route::resource('users', UsersController::class);
        Route::resource('roles', RolesController::class);
        Route::resource('mail', MailController::class);

        Route::get('/roles/move/move-up', 'RolesController@moveUp')->name('roles.up');
        Route::get('/roles/move/move-down', 'RolesController@moveDown')->name('roles.down');
        Route::prefix('menu/element')->group(function () {
            Route::get('/', 'MenuElementController@index')->name('menu.index');
            Route::get('/move-up', 'MenuElementController@moveUp')->name('menu.up');
            Route::get('/move-down', 'MenuElementController@moveDown')->name('menu.down');
            Route::get('/create', 'MenuElementController@create')->name('menu.create');
            Route::post('/store', 'MenuElementController@store')->name('menu.store');
            Route::get('/get-parents', 'MenuElementController@getParents');
            Route::get('/edit', 'MenuElementController@edit')->name('menu.edit');
            Route::post('/update', 'MenuElementController@update')->name('menu.update');
            Route::get('/show', 'MenuElementController@show')->name('menu.show');
            Route::get('/delete', 'MenuElementController@delete')->name('menu.delete');
        });
        Route::prefix('menu/menu')->group(function () {
            Route::get('/', 'MenuController@index')->name('menu.menu.index');
            Route::get('/create', 'MenuController@create')->name('menu.menu.create');
            Route::post('/store', 'MenuController@store')->name('menu.menu.store');
            Route::get('/edit', 'MenuController@edit')->name('menu.menu.edit');
            Route::post('/update', 'MenuController@update')->name('menu.menu.update');
            Route::get('/delete', 'MenuController@delete')->name('menu.menu.delete');
        });

        Route::resource('zones', ZoneController::class);
        Route::resource('hubs', HubController::class);
        Route::resource('sensors', SensorController::class);
        Route::resource('company', CompanyController::class);
        Route::resource('branch', BranchController::class);

    });
});
