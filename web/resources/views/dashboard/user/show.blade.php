@extends('dashboard.base')

@section('content')

    <div class="container-fluid">
        <div class="animated fadeIn">
            <div class="row">
                <div class="col-sm-12 col-md-10 col-lg-8 col-xl-6">
                    <div class="card">
                        <h4 class="card-header">
                            <i class="cil-user"></i> {{ __('View User') }}
                        </h4>
                        <div class="card-body">
                            <div class="">

                                <div class="c-avatar c-avatar-xl border-primary mb-3">
                                    <img class="c-avatar-img"
                                         src="{{ url('/assets/img/avatars/' . $user->image) }}"
                                         alt="{{$user->email}}"/>
                                </div>

                                <div><strong>First Name:</strong> {{ $user->first_name }}</div>
                                <div><strong>Last Name:</strong> {{ $user->last_name }}</div>
                                <div><strong>Mobile Number:</strong> {{ $user->mobile }}</div>
                                <div><strong>Roles:</strong> {{ $user->menuroles }}</div>
                                <div><strong>E-mail:</strong> {{ $user->email }}</div>
                                <div>
                                    <strong>Zones:</strong> @foreach($user->zones as $zone)   {{ $zone->name }} @endforeach
                                </div>
                                <div>
                                    <strong>Companies:</strong> @foreach($user->zones as $zone)   {{ $zone->company->name }} @endforeach
                                </div>
                            </div>
                            <br>
                            <hr>
                            <a href="{{ url('/users/' . $user->user_id . '/edit') }}"
                               class="btn btn-block btn-primary">{{ __('Edit User') }}</a>
                            <a href="{{ route('users.index') }}"
                               class="btn btn-block btn-light">{{ __('Return') }}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

@endsection


@section('javascript')

@endsection
