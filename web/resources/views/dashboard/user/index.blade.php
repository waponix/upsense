@extends('dashboard.base')

@section('content')

    <div class="container-fluid">
        <div class="animated fadeIn">
            <div class="row">
                <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">

                    @if(Session::has('message'))
                        <div class="row">
                            <div class="col-12">
                                <div class="alert alert-success" role="alert">{{ Session::get('message') }}</div>
                            </div>
                        </div>
                    @endif
                    <div class="card">
                        <div class="card-header">
                            <h4><i class="fa fa-align-justify"></i>{{ __('Users') }}</h4>
                        </div>
                        <div class="card-body">
                            <div class="col-lg-12 col-md-12">
                                <a class="btn btn-md btn-primary" href="{{ route('users.create') }}"><i
                                        class="cil-plus"></i> {{__('Add User') }}</a>
                                <hr>
                                <table class="table table-responsive-sm table-hover table-outline mb-0">
                                    <thead>
                                    <tr>
                                        <th></th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Mobile</th>
                                        <th>E-mail</th>
                                        <th>Roles</th>
                                        <th>Zone</th>
                                        <th>Company</th>
                                        <th>Created at</th>
                                        <th>Updated at</th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    @foreach($users as $user)
                                        <tr>
                                            <td>
                                                <div class="c-avatar">
                                                    <img class="c-avatar-img"
                                                         src="{{ url('/assets/img/avatars/' . $user->image) }}"
                                                         alt="{{$user->email}}"/>
                                                </div>
                                            </td>
                                            <td>{{ $user->first_name }}</td>
                                            <td>{{ $user->last_name }}</td>
                                            <td>{{ $user->mobile }}</td>
                                            <td>{{ $user->email }}</td>
                                            <td>{{ $user->menuroles }}</td>
                                            <td> @foreach($user->zones as $zone)   {{ $zone->name }} @endforeach</td>
                                            <td> @foreach($user->zones as $zone)   {{ $zone->company->name }} @endforeach</td>
                                            <td>{{ $user->created_at }}</td>
                                            <td>{{ $user->updated_at }}</td>
                                            <td>
                                                <a href="{{ url('/users/' . $user->user_id) }}"
                                                   class="btn btn-block btn-primary">View</a>
                                            </td>
                                            <td>
                                                <a href="{{ url('/users/' . $user->user_id . '/edit') }}"
                                                   class="btn btn-block btn-primary">Edit</a>
                                            </td>
                                            <td>
                                                @if($me->user_id !== $user->user_id )
                                                    <form action="{{ route('users.destroy', $user->user_id ) }}"
                                                          method="POST">
                                                        @method('DELETE')
                                                        @csrf
                                                        <button class="btn btn-block btn-danger">Delete</button>
                                                    </form>
                                                @endif
                                            </td>
                                        </tr>
                                    @endforeach
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

@endsection


@section('javascript')

@endsection

