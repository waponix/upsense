<?php

namespace App\Http\Controllers;

use App\Models\Sensor;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Http;

class HomeController extends Controller
{

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
//        $this->middleware('auth');
    }

    /**
     * Display the dashboard homepage
     * @return Application|Factory|View
     */
    public function index()
    {
        // $sensors = Sensor::all();
        return view('dashboard.home');
    }

}
