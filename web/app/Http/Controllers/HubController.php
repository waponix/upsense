<?php

namespace App\Http\Controllers;

use App\Models\Hub;
use App\Models\Zone;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class HubController extends Controller
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
        // $hubs = Hub::all();
        // return view('dashboard.hub.index', ['hubs' => $hubs]);
        return view('dashboard.hub.index');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Application|Factory|View
     */
    public function create()
    {

        // $zones = Zone::all();

        // return view('dashboard.hub.create', compact('zones'));
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

        // $hub = new Hub();
        // $hub->serial = $request->input('serial');
        // $hub->hw_version = $request->input('hw_version');
        // $hub->sw_version = $request->input('sw_version');
        // $hub->fw_version = $request->input('fw_version');
        // $hub->min_temp = $request->input('min_temp');
        // $hub->max_temp = $request->input('max_temp');
        // $hub->type = $request->input('type');
        // $hub->imei = $request->input('imei');
        // $hub->zone_id = $request->input('zone_id');
        // $hub->save();


        // $request->session()->flash('message', 'Successfully created hub');
        // return redirect()->route('hubs.index');
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return Application|Factory|View
     */
    public function show($id)
    {
        $hub = Hub::find($id);
        return view('dashboard.hub.show', ['hub' => $hub]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param int $id
     * @return Application|Factory|View
     */
    public function edit($id)
    {
        // $hub = Hub::find($id);
        // $zones = Zone::all();

        return view('dashboard.hub.edit');
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

        // $hub = Hub::find($id);
        // $hub->serial = $request->input('serial');
        // $hub->hw_version = $request->input('hw_version');
        // $hub->sw_version = $request->input('sw_version');
        // $hub->fw_version = $request->input('fw_version');
        // $hub->type = $request->input('type');
        // $hub->imei = $request->input('imei');
        // $hub->min_temp = $request->input('min_temp');
        // $hub->max_temp = $request->input('max_temp');
        // $hub->zone_id = $request->input('zone_id');
        // $hub->save();

        // $request->session()->flash('message', 'Successfully edited hub');
        // return redirect()->route('hubs.index');
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
        // $hub = Hub::find($id);
        // if ($hub) {
        //     $hub->delete();
        // }
        // $request->session()->flash('message', 'Successfully deleted hub');
        // return redirect()->route('hubs.index');
    }
}
