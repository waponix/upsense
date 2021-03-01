@extends('dashboard.base')

@section('content')

    <div class="container-fluid">
        <div class="animated fadeIn">
            <div class="row">
                <div class="col-sm-12 col-md-10 col-lg-8 col-xl-6">
                    <div class="card">
                        <h4 class="card-header">
                            <i class="cil-user"></i> {{ __('Edit User') }}
                        </h4>
                        <div class="card-body">
                            <br>
                            <form method="POST" action="{{route('users.update', $user->user_id) }}">
                                @csrf
                                @method('PUT')

                                <div class="input-group mb-3">
                                    <div class="c-avatar c-avatar-xl border-primary mb-3">
                                        <img class="c-avatar-img"
                                             src="{{ url('/assets/img/avatars/' . $user->image) }}"
                                             alt="{{$user->email}}"/>
                                    </div>
                                </div>
                                <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                    <span class="input-group-text">
                                      <svg class="c-icon c-icon-sm">
                                          <use xlink:href="/assets/icons/coreui/free-symbol-defs.svg#cui-user"></use>
                                      </svg>
                                    </span>
                                    </div>
                                    <input class="form-control" type="text" placeholder="{{ __('First Name') }}"
                                           name="first_name" value="{{ $user->first_name }}" required autofocus>
                                </div>
                                <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">
                                                      <svg class="c-icon c-icon-sm">
                                          <use xlink:href="/assets/icons/coreui/free-symbol-defs.svg#cui-user"></use>
                                      </svg>
                                        </span>
                                    </div>
                                    <input class="form-control" type="text" placeholder="{{ __('Last Name') }}"
                                           name="last_name" value="{{ $user->last_name }}">
                                </div>
                                <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">@</span>
                                    </div>
                                    <input class="form-control" type="email" placeholder="{{ __('E-Mail Address') }}"
                                           name="email" value="{{ $user->email }}" required>
                                </div>
                                <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">          <svg class="c-icon c-icon-sm">
                                          <use xlink:href="/assets/icons/coreui/free-symbol-defs.svg#cui-mobile"></use>
                                      </svg></span>
                                    </div>
                                    <input class="form-control" type="text" placeholder="{{ __('Mobile') }}"
                                           name="mobile" value="{{ $user->mobile }}" required>
                                </div>
                                <div class="form-group row">
                                    <div class="col">
                                        <label>Assign Role</label>
                                        <div class="input-group mb-3">
                                            <div class="input-group-prepend">
                                        <span class="input-group-text">          <svg class="c-icon c-icon-sm">
                                          <use xlink:href="/assets/icons/coreui/free-symbol-defs.svg#cui-user"></use>
                                      </svg></span>
                                            </div>
                                            <select class="form-control" name="role">
                                                @foreach($roles as $role)
                                                    @if($role == $user->role)
                                                        <option value="{{ $role }}"
                                                                selected="true">{{ $role }}</option>
                                                    @else
                                                        <option value="{{ $role }}">{{ $role }}</option>
                                                    @endif
                                                @endforeach
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <div class="col">
                                        <label>Assign to Zone</label>
                                        <select class="form-control" name="zone_id">
                                            @foreach($zones as $zone)
                                                @if( $zone->zone_id == $user->zone_id )
                                                    <option value="{{ $zone->zone_id }}"
                                                            selected="true">{{ $zone->name }}</option>
                                                @else
                                                    <option value="{{ $zone->zone_id }}">{{ $zone->name }}</option>
                                                @endif
                                            @endforeach
                                        </select>
                                    </div>
                                </div>
                                <button class="btn btn-block btn-success" type="submit">{{ __('Save') }}</button>
                                <a href="{{ route('users.index') }}"
                                   class="btn btn-block btn-primary">{{ __('Return') }}</a>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

@endsection

@section('javascript')

@endsection
