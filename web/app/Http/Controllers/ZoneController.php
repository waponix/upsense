<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Zone;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ZoneController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('admin');
    }

    /**
     * Display a listing of the resource.
     *
     * @return Application|Factory|View
     */
    public function index()
    {
        $zones = Zone::all();
        return view('dashboard.zone.index', ['zones' => $zones]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Application|Factory|View
     */
    public function create()
    {
        $companies = Company::all();
        return view('dashboard.zone.create', compact('companies'));
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
//            'name' => 'required|min:1|max:64'
//        ]);

        $zone = new Zone();
        $zone->name = $request->input('name');
        $zone->company_id = $request->input('company_id');
        $zone->save();

        $request->session()->flash('message', 'Successfully created zone');
        return redirect()->route('zones.index');
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return Application|Factory|View
     */
    public function show($id)
    {
        $zone = Zone::find($id);
        return view('dashboard.zone.show', ['zone' => $zone]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param int $id
     * @return Application|Factory|View
     */
    public function edit($id)
    {
        $zone = Zone::find($id);
        $companies = Company::all();

        return view('dashboard.zone.edit', ['zone' => $zone, 'companies' => $companies]);
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
//            'name' => 'required|min:1|max:64',
//        ]);
        $zone = Zone::find($id);
        $zone->name = $request->input('name');
        $zone->company_id = $request->input('company_id');
        $zone->save();

        $request->session()->flash('message', 'Successfully edited zone');
        return redirect()->route('zones.index');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return RedirectResponse
     */
    public function destroy($id)
    {
        $zone = Zone::find($id);
        if ($zone) {
            $zone->delete();
        }
        return redirect()->route('zones.index');
    }
}
