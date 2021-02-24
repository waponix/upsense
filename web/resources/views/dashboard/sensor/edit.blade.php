@extends('dashboard.base')

@section('content')

    <div class="container-fluid">
        <div class="animated fadeIn">
            <div class="row">
                <div class="col-sm-12 col-md-10 col-lg-8 col-xl-6">
                    <div class="card">
                        <div class="card-header">
                            <h4>
                                 {{ __('Edit Sensor') }}
                            </h4>
                        </div>
                        <div class="card-body">
                            <form method="POST" action="/sensors/{{ $sensor->sensor_id }}">
                                @csrf
                                @method('PUT')
                                <div class="form-group row">
                                    <div class="col">
                                        <label>Serial</label>
                                        <input class="form-control" type="text" placeholder="{{ __('Serial') }}"
                                               name="serial" value="{{ $sensor->serial }}" required autofocus>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <div class="col">
                                        <label>Description</label>
                                        <input class="form-control" type="text" placeholder="{{ __('Description') }}"
                                               name="description" value="{{ $sensor->description }}" autofocus>
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <div class="col">
                                        <label>Assign to Hub</label>
                                        <select class="form-control" name="hub_id">
                                            @foreach($hubs as $hub)
                                                @if( $hub->hub_id == $hub->hub_id )
                                                    <option value="{{ $hub->hub_id }}"
                                                            selected="true">{{ $hub->serial }}</option>
                                                @else
                                                    <option value="{{ $hub->hub_id }}">{{ $hub->serial }}</option>
                                                @endif
                                            @endforeach
                                        </select>
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <div class="col">
                                        <label>Type</label>
                                        <input class="form-control" type="text" placeholder="{{ __('Type') }}"
                                               name="type" value="{{ $sensor->type }}" required>
                                    </div>
                                </div>

                                <button class="btn btn-block btn-success" type="submit">{{ __('Save') }}</button>
                                <a href="{{ route('sensors.index') }}"
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
