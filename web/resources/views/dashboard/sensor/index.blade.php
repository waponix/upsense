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
                            <h4><i class="cil-blur-circular"></i> {{ __('Sensors') }}</h4>
                        </div>
                        <div class="card-body">
                            <div class="col-lg-12 col-md-12">

                                <a class="btn btn-md btn-primary" href="{{ route('sensors.create') }}"><i
                                        class="cil-plus"></i> {{__('Add Sensor') }}</a>
                                <hr>
                                <table class="table table-responsive-md table-hover table-outline mb-0">
                                    <thead>
                                    <tr>
                                        <th>Serial Number</th>
                                        <th>Description</th>
{{--                                        <th>Current Temp</th>--}}
{{--                                        <th>Status</th>--}}
{{--                                        <th>Last Seen</th>--}}
                                        <th>Type</th>
                                        <th>Zone</th>
                                        <th>Company</th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    @foreach($sensors as $sensor)
                                        <tr>
                                            <td><strong>{{ $sensor->serial }}</strong></td>
                                            <td>{{ $sensor->description }}</td>
{{--                                            <td>{{ $sensor->current_temp }}</td>--}}
{{--                                            <td>--}}
{{--                                                <strong>--}}
{{--                                                    @if($sensor->is_connected)--}}
{{--                                                        <svg class="c-icon c-icon-xl">--}}
{{--                                                            <use--}}
{{--                                                                xlink:href="assets/icons/coreui/free-symbol-defs.svg#cui-link"></use>--}}
{{--                                                        </svg>--}}

{{--                                                    @else--}}
{{--                                                        <svg class="c-icon c-icon-xl blink-danger">--}}
{{--                                                            <use--}}
{{--                                                                xlink:href="assets/icons/coreui/free-symbol-defs.svg#cui-link-broken"></use>--}}
{{--                                                        </svg>--}}
{{--                                                    @endif--}}
{{--                                                </strong>--}}
{{--                                            </td>--}}
{{--                                            <td>{{ \Carbon\Carbon::parse($sensor->last_seen)->diffForHumans([ 'parts' => 2 ]) }}</td>--}}
                                            <td>{{ $sensor->type }}</td>
                                            <td>{{ $sensor->hub->zone->name }}</td>
                                            <td>{{ $sensor->hub->zone->company->name }}</td>
                                            <td>
                                                <a href="{{ url('/sensors/' . $sensor->sensor_id) }}"
                                                   class="btn btn-block btn-primary">View</a>
                                            </td>
                                            <td>
                                                <a href="{{ url('/sensors/' . $sensor->sensor_id . '/edit') }}"
                                                   class="btn btn-block btn-primary">Edit</a>
                                            </td>
                                            <td>
                                                <form action="{{ route('sensors.destroy', $sensor->sensor_id ) }}"
                                                      method="POST">
                                                    @method('DELETE')
                                                    @csrf
                                                    <button class="btn btn-block btn-danger">Delete</button>
                                                </form>
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

