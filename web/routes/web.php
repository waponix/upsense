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
//Auth::routes();
Route::get('/login', 'LoginController@index')->name('login');
Route::post('/login', 'LoginController@authenticate')->name('authenticate');
Route::get('/logout', 'LoginController@logout')->name('logout');
Route::post('/refreshToken', 'LoginController@refreshToken')->name('refreshToken');

Route::group(['middleware' => ['verifiedAuthToken']], function () {
    Route::get('/', 'HomeController@index')->name('dashboard.home.index');
    Route::get('/profile', 'UsersController@profile')->name('user.profile');
    Route::get('/profile/edit', 'UsersController@profileEdit')->name('user.profile.edit');
    Route::put('/profile/update', 'UsersController@profileEdit')->name('user.profile.update');
    Route::get('/devices', 'DeviceController@index')->name('dashboard.devices');

    Route::get('/reports', function () {
        return view('dashboard.reports');
    });

    Route::get('/404', function () {
        return view('dashboard.404');
    });
    Route::get('/500', function () {
        return view('dashboard.500');
    });

//    Route::group(['middleware' => 'nonUserRole'], function () {
    Route::resource('users', UsersController::class);
    Route::resource('mail', MailController::class);
    //        Route::resource('notifications', NotificationsController::class);

//    });

    Route::group(['middleware' => 'admin'], function () {
        Route::resource('zones', ZoneController::class);
        Route::resource('company', CompanyController::class);
        Route::resource('hubs', HubController::class);
        Route::resource('sensors', SensorController::class);
    });
});
