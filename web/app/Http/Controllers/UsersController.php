<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Zone;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class UsersController extends Controller
{

    const ROLES = [
        'user',
        'manager',
        'admin'
    ];

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * @param Request $request
     * @return Application|Factory|View
     */
    public function index(Request $request)
    {
//        $body = json_encode([
//            "query" => [
//                "relations" => [
//                    "company",
//                    "zones"
//                ]
//            ]
//        ]);
//
//        $response = Http::withToken($request->session()->get('accessToken'))
//            ->withBody($body, 'application/json')
//            ->withOptions([
//                'body' => $body,
//            ])
//            ->get(env('JWT_ISSUER') . '/admins');
//
//        $users = null;
//
//        if ($response->successful()) {
//            $users = $response->json()['result'];
//
//        }

        return view('dashboard.user.index');
    }


    /**
     * Create user
     * @param Request $request
     * @return Application|Factory|View
     */
    public function create(Request $request)
    {
//        $roles = self::ROLES;
//        $response = Http::withToken($request->session()->get('accessToken'))
//            ->get(env('JWT_ISSUER') . '/companies');
//
//        $companies = [];
//        if ($response->successful()) {
//            $companies = $response->json()['result'];
//        }
        return view('dashboard.user.create');
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
//                "password" => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
//                "firstName" => $request->input('first_name'),
//                "lastName" => $request->input('last_name'),
//                "email" => $request->input('email'),
//                "mobile" => $request->input('mobile'),
//                "company" => $request->input('company'),
//                "role" => $request->input('role'),
//                "zones" => $request->input('zone')
//            ]
//        ]);
//
//        $response = Http::withToken($request->session()->get('accessToken'))
//            ->withBody($body, 'application/json')
//            ->withOptions([
//                'body' => $body,
//            ])
////            ->asForm()
//            ->post(env('JWT_ISSUER') . '/users');
//
//        if ($response->successful()) {
//            $request->session()->flash('message', 'Successfully created user');
//            return redirect()->route('users.index');
//        }
    }


    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return Application|Factory|View
     */
    public function show($id)
    {
//        $user = User::find($id);
//        return view('dashboard.user.show', compact('user'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param Request $request
     * @param  $id
     * @return Application|Factory|View
     */
    public function edit(Request $request, $id)
    {
//        $body = json_encode([
//            "query" => [
//                "relations" => [
//                    "company",
//                    "zones"
//                ]
//            ]
//        ]);
//
//        $usersResponse = Http::withToken($request->session()->get('accessToken'))
//            ->withBody($body, 'application/json')
//            ->withOptions([
//                'body' => $body,
//            ])
//            ->get(env('JWT_ISSUER') . '/users/' . $id);
//
//        $users = null;
//        if ($usersResponse->successful()) {
//            $user = $usersResponse->json()['result'];
//            $zones = Zone::all();
//            $roles = self::ROLES;
//
//            return view('dashboard.user.edit', compact('user', 'zones', 'roles'));
//        }
        return view('dashboard.user.edit');
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
//                "password" => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
//                "firstName" => $request->input('first_name'),
//                "lastName" => $request->input('last_name'),
//                "email" => $request->input('email'),
//                "mobile" => $request->input('mobile'),
////                "company" => $request->input('company'),
////                "role" => $request->input('role'),
//                "zones" => [$request->input('zone_id')]
//            ]
//        ]);
//
//        $response = Http::withToken($request->session()->get('accessToken'))
//            ->withBody($body, 'application/json')
//            ->withOptions([
//                'body' => $body,
//            ])
//            ->put(env('JWT_ISSUER') . '/users');
//
//        if ($response->successful()) {
//            $request->session()->flash('message', 'Successfully created user');
//            return redirect()->route('users.index');
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
//        $user = User::find($id);
//        if ($user) {
//            $user->delete();
//        }
//        $request->session()->flash('message', 'Successfully deleted user');
//
//        return redirect()->route('users.index');
    }

    /**
     *
     * @return Application|Factory|View
     */
    public function profile()
    {
        return view('dashboard.user.profile');
    }


    /**
     *
     * @return Application|Factory|View
     */
    public function profileEdit()
    {
        $zones = Zone::all();
        return view('dashboard.user.profileEdit', compact('zones'));
    }

    /**
     * Update profile
     *
     * @param Request $request
     * @param int $id
     * @return RedirectResponse
     */
    public function profileUpdate(Request $request, $id)
    {
//        $val = $request->validate([
//            'first_name' => 'required|min:1|max:255',
//            'last_name' => 'max:255',
//            'email' => 'required|email|max:255',
//            'mobile' => 'required|integer|max:20'
//        ]);
//        dd($val);

        $user = User::find($id);

        $user->first_name = $request->input('first_name');
        $user->last_name = $request->input('last_name');
        $user->email = $request->input('email');
        $user->mobile = $request->input('mobile');
        $user->save();

        $request->session()->flash('message', 'Successfully updated user');
        return redirect()->route('users.index');
    }
}
