<?php

namespace App\Http\Controllers;

use App\Models\Hub;
use App\Models\Sensor;
use App\Models\Zone;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class SensorController extends Controller
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
     * Display a listing of the resource.
     *
     * @return Application|Factory|View
     */
    public function index()
    {
        // $sensors = Sensor::all();
        return view('dashboard.sensor.index');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Application|Factory|View
     */
    public function create()
    {

    //     $hubs = Hub::all();
    //     $zones = Zone::all();

    //     return view('dashboard.sensor.create', compact('hubs'), compact('zones'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function store(Request $request)
    {

//        $validatedData = $request->validate([
//            'description' => 'required|min:1|max:64',
//            'serial' => 'max:64',
//            'hw_version' => 'max:64',
//            'sw_version' => 'max:64',
//            'fw_version' => 'max:64',
//            'type' => 'max:64',
//            'imei' => 'max:64',
//        ]);
        // $sensor = new Sensor();
        // $sensor->serial = $request->input('serial');
        // $sensor->description = $request->input('description');
        // $sensor->type = $request->input('type');
        // $sensor->hub_id = $request->input('hub_id');
        // $sensor->save();


        // $request->session()->flash('message', 'Successfully created sensor');
        // return redirect()->route('sensors.index');
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return Application|Factory|View
     */
    public function show($id)
    {
        // $sensor = Sensor::find($id);
        // return view('dashboard.sensor.show', ['sensor' => $sensor]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param int $id
     * @return Application|Factory|View
     */
    public function edit($id)
    {
        // $sensor = Sensor::find($id);
        // $hubs = Hub::all();

        // return view('dashboard.sensor.edit', ['sensor' => $sensor, 'hubs'=> $hubs]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param int $id
     * @return RedirectResponse
     */
    public function update(Request $request, $id)
    {
//        $validatedData = $request->validate([
//            'description' => 'required|min:1|max:64',
//            'serial' => 'max:64',
//            'hw_version' => 'max:64',
//            'sw_version' => 'max:64',
//            'fw_version' => 'max:64',
//            'type' => 'max:64',
//            'imei' => 'max:64',
//        ]);

        // $sensor = Sensor::find($id);
        // $sensor->serial = $request->input('serial');
        // $sensor->description = $request->input('description');
        // $sensor->type = $request->input('type');
        // $sensor->hub_id = $request->input('hub_id');
        // $sensor->save();

        // $request->session()->flash('message', 'Successfully edited sensor');
        // return redirect()->route('sensors.index');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Request $request
     * @param int $id
     * @return RedirectResponse
     */
    public function destroy(Request $request, $id)
    {
        // $sensor = Sensor::find($id);
        // if ($sensor) {
        //     $sensor->delete();
        // }
        // $request->session()->flash('message', 'Successfully deleted sensor');
        // return redirect()->route('sensors.index');
    }
}
