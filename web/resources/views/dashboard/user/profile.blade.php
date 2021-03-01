@extends('dashboard.base')

@section('content')

    <div class="container-fluid">
        <div class="animated fadeIn">
            <div class="row">
                <div class="col-sm-12 col-md-10 col-lg-8 col-xl-6">
                    <div class="card">
                        <h4 class="card-header">
                            <i class="cil-user"></i> Profile
                        </h4>
                        <div class="card-body">
                            <div class="">

                                <div class="c-avatar c-avatar-xl border-primary mb-3">
                                    <img class="c-avatar-img"
                                         src="{{ url('/assets/img/avatars/' . $currentAuthenticatedUser->image) }}"
                                         alt="{{$currentAuthenticatedUser->email}}"/>
                                </div>

                                <div><strong>First Name:</strong> {{ $currentAuthenticatedUser->first_name }}</div>
                                <div><strong>Last Name:</strong> {{ $currentAuthenticatedUser->last_name }}</div>
                                <div><strong>Mobile Number:</strong> {{ $currentAuthenticatedUser->mobile }}</div>
                                <div><strong>Roles:</strong> {{ $currentAuthenticatedUser->menuroles }}</div>
                                <div><strong>E-mail:</strong> {{ $currentAuthenticatedUser->email }}</div>
                                <div>
                                    <strong>Zones:</strong> @foreach($currentAuthenticatedUser->zones as $zone)   {{ $zone->name }} @endforeach
                                </div>
                                <div>
                                    <strong>Companies:</strong> @foreach($currentAuthenticatedUser->zones as $zone)   {{ $zone->company->name }} @endforeach
                                </div>
                            </div>
                            <br>
                            <hr>
                            <a href="{{ route('user.profile.edit') }}"
                               class="btn btn-block btn-primary">{{ __('Edit Profile') }}</a>
                            <a href="{{ route('dashboard.home.index') }}"
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
