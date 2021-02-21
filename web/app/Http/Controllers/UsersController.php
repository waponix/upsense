<?php

namespace App\Http\Controllers;

use App\Models\Zone;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use App\Models\User;

class UsersController extends Controller
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
        $this->middleware('manager');
    }

    /**
     * Display a listing of the resource.
     *
     * @return Application|Factory|View
     */
    public function index()
    {
        $me = auth()->user();
        $users = User::all();
        return view('dashboard.user.index', compact('users', 'me'));
    }


    /**
     * Display a listing of the resource.
     *
     * @return Application|Factory|View
     */
    public function create()
    {
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
//        $validatedData = $request->validate([
////            'username' => 'required|min:1|max:256',
//            'first_name' => 'required|min:1|max:256',
//            'last_name' => 'max:256',
//            'email' => 'required|email|max:256',
//            'mobile' => 'required|integer|max:20',
//        ]);

        $user = new User();
        $user->first_name = $request->input('first_name');
        $user->last_name = $request->input('last_name');
        $user->email = $request->input('email');
        $user->mobile = $request->input('mobile');
        $user->menuroles = $request->input('menuroles');
        $user->zone_id = $request->input('zone_id');

        $user->save();

        $request->session()->flash('message', 'Successfully created user');
        return redirect()->route('users.index');
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return Application|Factory|View
     */
    public function show($id)
    {
        $user = User::find($id);
        return view('dashboard.user.show', compact('user'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param int $id
     * @return Application|Factory|View
     */
    public function edit($id)
    {
        $user = User::find($id);
        $zones = Zone::all();
        return view('dashboard.user.edit', compact('user' ), compact('zones' ));
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
        $user->menuroles = $request->input('menuroles');
        $user->save();

        $request->session()->flash('message', 'Successfully updated user');
        return redirect()->route('users.index');
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
        $user = User::find($id);
        if ($user) {
            $user->delete();
        }
        $request->session()->flash('message', 'Successfully deleted user');

        return redirect()->route('users.index');
    }
}
