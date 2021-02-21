@extends('dashboard.base')

@section('content')

        <div class="container-fluid">
          <div class="animated fadeIn">
            <div class="row">
              <div class="col-sm-12 col-md-10 col-lg-8 col-xl-6">
                <div class="card">
                    <div class="card-header">
                      <i class="fa fa-align-justify"></i> Hub: {{ $hub->serial }}</div>
                    <div class="card-body">
                        <h5>Serial:</h5>
                        <p> {{ $hub->serial }}</p>
                        <h5>Zone:</h5>
                        <p> {{ $hub->zone->name }}</p>
                        <h5>Company:</h5>
                        <p> {{ $hub->zone->company->name }}</p>
                        <h5>Hardware Version:</h5>
                        <p>{{ $hub->hw_version }}</p>
                        <h5>Software Version:</h5>
                        <p>{{ $hub->hsw_version }}</p>
                        <h5>Firmware Version:</h5>
                        <p>{{ $hub->fw_version }}</p>
                        <h5>Status:</h5>
                        <p>{{ $hub->is_connected }}</p>
                        <h5>IMEI:</h5>
                        <p>{{ $hub->imei }}</p>
                        <h5>Type:</h5>
                        <p>{{ $hub->type }}</p>
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
