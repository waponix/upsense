@extends('dashboard.base')

@section('content')

        <div class="container-fluid">
          <div class="animated fadeIn">
            <div class="row">
              <div class="col-sm-12 col-md-10 col-lg-8 col-xl-6">
                <div class="card">
                    <div class="card-header">
                      <i class="fa fa-align-justify"></i> {{ $user->first_name . ' ' . $user->last_name }}</div>
                    <div class="card-body">

                        <div class="c-avatar">
                            <img class="c-avatar-img"
                                 src="{{ url('/assets/img/avatars/' . $user->image) }}"
                                 alt="{{$user->email}}"/>
                        </div>
                        <h4>First Name: {{ $user->first_name }}</h4>
                        <h4>Last Name: {{ $user->last_name }}</h4>
                        <h4>Mobile Number: {{ $user->mobile }}</h4>
                        <h4>Roles: {{ $user->menuroles }}</h4>
                        <h4>E-mail: {{ $user->email }}</h4>
                        <a href="{{ route('users.index') }}" class="btn btn-block btn-primary">{{ __('Return') }}</a>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>

@endsection


@section('javascript')

@endsection
