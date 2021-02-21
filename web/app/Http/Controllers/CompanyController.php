<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CompanyController extends Controller
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
        $companies = Company::paginate(20);
        return view('dashboard.company.index', ['companies' => $companies]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Application|Factory|View
     */
    public function create()
    {
        return view('dashboard.company.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|min:1|max:64'
        ]);

        $company = new Company();
        $company->name = $request->input('name');
        $company->save();

        $request->session()->flash('message', 'Successfully created company');
        return redirect()->route('company.index');
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return Application|Factory|View
     */
    public function show($id)
    {
        $company = Company::find($id);
        return view('dashboard.company.show', ['company' => $company]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param int $id
     * @return Application|Factory|View
     */
    public function edit($id)
    {
        $company = Company::find($id);

        return view('dashboard.company.edit', ['company' => $company]);
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
        $validatedData = $request->validate([
            'name' => 'required|min:1|max:64',
        ]);
        $company = Company::find($id);
        $company->name = $request->input('name');
        $company->save();
        $request->session()->flash('message', 'Successfully edited company');
        return redirect()->route('company.index');
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
        $company = Company::find($id);
        if ($company) {
            $company->delete();
        }
        $request->session()->flash('message', 'Successfully deleted company');

        return redirect()->route('company.index');
    }
}
