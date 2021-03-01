<?php

namespace App\Http\Controllers;

use App\Models\Sensor;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;

class DeviceController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return Application|Factory|View
     */
    public function index()
    {
        $sensors = Sensor::all();
        return view('dashboard.device', ['sensors' => $sensors]);
    }

}
