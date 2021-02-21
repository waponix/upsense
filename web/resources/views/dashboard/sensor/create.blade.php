@extends('dashboard.base')

@section('content')

    <div class="container-fluid">
        <div class="animated fadeIn">
            <div class="row">
                <div class="col-sm-12 col-md-10 col-lg-8 col-xl-6">
                    <div class="card">
                        <div class="card-header"><i class="cil-tablet"></i> {{ __('Hubs') }}</div>
                        <div class="card-body">
                            <form method="POST" action="{{ route('zones.store') }}">
                                @csrf
                                <div class="form-group row">
                                    <div class="col">
                                        <label>Serial</label>
                                        <input class="form-control" type="text" placeholder="{{ __('Serial') }}"
                                               name="serial" required autofocus>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <div class="col">
                                        <label>Hardware Version</label>
                                        <input class="form-control" type="text"
                                               placeholder="{{ __('Hardware Version') }}"
                                               name="hw_version" autofocus>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <div class="col">
                                        <label>Software Version</label>
                                        <input class="form-control" type="text"
                                               placeholder="{{ __('Software Version') }}"
                                               name="sw_version" autofocus>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <div class="col">
                                        <label>Firmware Version</label>
                                        <input class="form-control" type="text"
                                               placeholder="{{ __('Firmware Version') }}"
                                               name="fw_version" autofocus>
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <div class="col">
                                        <label>Set Minimum Temp</label>
                                        <input class="form-control" type="number" placeholder="{{ __('Min Temp') }}"
                                               name="min_temp" required autofocus>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <div class="col">
                                        <label>Set Maximum Temp</label>
                                        <input class="form-control" type="number" placeholder="{{ __('Max Temp') }}"
                                               name="max_temp" required autofocus>
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <div class="col">
                                        <label>Assign to Zone</label>
                                        <select class="form-control" name="zone_id">
                                            @foreach($zones as $zone)
                                                <option value="{{ $zone->zone_id }}">{{ $zone->name }}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <div class="col">
                                        <label>IMEI</label>
                                        <input class="form-control" type="text" placeholder="{{ __('IMEI') }}"
                                               name="imei" required>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <div class="col">
                                        <label>Type</label>
                                        <input class="form-control" type="text" placeholder="{{ __('Type') }}"
                                               name="type" required>
                                    </div>
                                </div>
                                <button class="btn btn-block btn-success" type="submit">{{ __('Add') }}</button>
                                <a href="{{ route('zones.index') }}"
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
