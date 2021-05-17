<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class CompanyController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
//        $this->middleware('admin');
    }

    /**
     * @param Request $request
     * @return Application|Factory|View
     */
    public function index(Request $request)
    {
//        $response = Http::withToken($request->session()->get('accessToken'))
//            ->get(env('JWT_ISSUER') . '/companies');
//        $companies = [];
//        if ($response->successful()) {
//            $companies = $response->json()['result'];
//        }
        return view('dashboard.company.index');
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
//        $body = json_encode([
//            "data" => [
//                "name" => $request->input('name')
//            ]
//        ]);
//
//        $response = Http::withToken($request->session()->get('accessToken'))
//            ->withBody($body, 'application/json')
//            ->post(env('JWT_ISSUER') . '/companies');
//
//        if ($response->successful()) {
//            $request->session()->flash('message', 'Successfully created company');
//            return redirect()->route('company.index');
//        }

    }

    /**
     * Display the specified resource.
     *
     * @param Request $request
     * @param int $id
     * @return Application|Factory|View
     */
    public function show(Request $request, $id)
    {
//        $response = Http::withToken($request->session()->get('accessToken'))
//            ->get(env('JWT_ISSUER') . '/companies/' . $id);
//
//        $company = '';
//        if ($response->successful()) {
//            $company = $response->json()['result'];
//        }
        return view('dashboard.company.show');
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param int $id
     * @param Request $request
     * @return Application|Factory|View
     */
    public function edit(Request $request, $id)
    {
//        $response = Http::withToken($request->session()->get('accessToken'))
//            ->get(env('JWT_ISSUER') . '/companies/' . $id);
//
//        if ($response->successful()) {
//            $company = $response->json()['result'];
//        }

        return view('dashboard.company.edit');
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
//        $body = json_encode([
//            "data" => [
//                "name" => $request->input('name')
//            ]
//        ]);
//
//        $response = Http::withToken($request->session()->get('accessToken'))
//            ->withBody($body, 'application/json')
//            ->put(env('JWT_ISSUER') . '/companies/' . $id);
//
//        if ($response->successful()) {
//            $request->session()->flash('message', 'Successfully edited company');
//            return redirect()->route('company.index');
//        }
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
//        $response = Http::withToken($request->session()->get('accessToken'))
//            ->delete(env('JWT_ISSUER') . '/companies/' . $id);
//
//        if ($response->successful()) {
//            $request->session()->flash('message', 'Successfully deleted company');
//
//            return redirect()->route('company.index');
//        }
    }
}
