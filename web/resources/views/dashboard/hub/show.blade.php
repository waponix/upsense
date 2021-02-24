@extends('dashboard.base')

@section('content')

    <div class="container-fluid">
        <div class="animated fadeIn">
            <div class="row">
                <div class="col-sm-12 col-md-10 col-lg-8 col-xl-6">
                    <div class="card">
                        <div class="card-header">
                            <h4>
                                {{ __('View Hub Details') }}
                            </h4>
                        </div>
                        <div class="card-body">

                            <div class="form-group row">
                                <label class="col-md-3 col-form-label"><strong>Serial:</strong></label>
                                <p class="form-control-static">
                                    {{ $hub->serial }}
                                </p>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label"><strong>Zone:</strong></label>
                                <p class="form-control-static">
                                    {{ $hub->zone->name }}
                                </p>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label"><strong>Company:</strong></label>
                                <p class="form-control-static">
                                    {{ $hub->zone->company->name }}
                                </p>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label"><strong>Hardware Version:</strong></label>
                                <p class="form-control-static">
                                    {{ $hub->hw_version }}
                                </p>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label"><strong>Software Version:</strong></label>
                                <p class="form-control-static">
                                    {{ $hub->sw_version }}
                                </p>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label"><strong>Firmware Version:</strong></label>
                                <p class="form-control-static">
                                    {{ $hub->fw_version }}
                                </p>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label"><strong>Status:</strong></label>
                                <p class="form-control-static">
                                    <strong
                                        class="@if ($hub->is_connected) text-success @else text-danger @endif">{{$hub->is_connected? 'Connected' : 'Disconnected' }}</strong>
                                </p>
                            </div>

                            <div class="form-group row">
                                <label class="col-md-3 col-form-label"><strong>IMEI:</strong></label>
                                <p class="form-control-static">
                                    {{$hub->imei }}
                                </p>
                            </div>

                            <div class="form-group row">
                                <label class="col-md-3 col-form-label"><strong>Type:</strong></label>
                                <p class="form-control-static">
                                    {{$hub->type }}
                                </p>
                            </div>
                        </div>
                        <div class="card-footer">
                            <a href="{{ route('hubs.index') }}" class="btn btn-block btn-primary">{{ __('Return') }}</a>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

@endsection


@section('javascript')

@endsection
