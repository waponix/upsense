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
                            <h4>
                                <i class="cil-memory"></i> {{ __('Devices') }}
                            </h4>
                        </div>
                        <div class="card-body">
                            <div class="col-lg-12 col-md-12">

                                <hr>
                                <table class="table table-responsive table-hover table-outline mb-0">
                                    <thead>
                                    <tr>
                                        <th>
                                            Device
                                        </th>
                                        <th>Serial</th>
                                        <th>Hub</th>
                                        <th>Current Temp</th>
                                        <th>Max Temp</th>
                                        <th>Min Temp</th>
                                        <th>Allowed Range</th>
                                        <th>Zone</th>
                                        <th>Company</th>
                                        <th>
                                            <svg class="c-icon">
                                                <use
                                                    xlink:href="assets/icons/coreui/free-symbol-defs.svg#cui-bolt"></use>
                                            </svg>
                                        </th>
                                        <th>
                                            Status
                                        </th>
                                        <th>Wi-Fi</th>
                                        <th>Radio</th>
                                        <th>Uptime</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    @foreach($sensors as $sensor)
                                        <tr>
                                            <td>
                                                <strong><a href="#" onclick="loadSensorModal({{$sensor->id}})">{{$sensor->description}}</a></strong>
                                            </td>
                                            <td>
                                                {{$sensor->serial}}
                                            </td>
                                            <td>
                                                <a href="#">{{$sensor->hub->serial}}</a>
                                            </td>
                                            <td class="sensor-temp">
                                                <strong>{{$sensor->current_temp}}°C</strong>
                                            </td>
                                            <td class="max-temp text-warning">
                                                <strong>{{$sensor->logs->max->max_temp}}°C</strong>
                                            </td>
                                            <td class="min-temp text-info">
                                                <strong>{{$sensor->logs->min->min_temp}}°C</strong>
                                            </td>
                                            <td>
                                                <strong>(<span
                                                        class="text-info">{{$sensor->hub->min_temp}}</span> <span
                                                        class="text-warning">{{$sensor->hub->max_temp}}</span>)°C</strong>
                                            </td>
                                            <td>
                                                {{$sensor->hub->zone->name}}
                                            </td>
                                            <td>
                                                {{$sensor->hub->zone->company->name}}

                                            </td>
                                            <td>
                                                @if($sensor->battery_status > 70)

                                                    <svg class="c-icon c-icon-xl">
                                                        <use
                                                            xlink:href="assets/icons/coreui/free-symbol-defs.svg#cui-battery-5"></use>
                                                    </svg>
                                                @elseif($sensor->battery_status > 20 && $sensor->battery_status < 70 )

                                                    <svg class="c-icon c-icon-xl">
                                                        <use
                                                            xlink:href="assets/icons/coreui/free-symbol-defs.svg#cui-battery-3"></use>
                                                    </svg>
                                                @else

                                                    <svg class="c-icon c-icon-xl blink-danger">
                                                        <use
                                                            xlink:href="assets/icons/coreui/free-symbol-defs.svg#cui-battery-0"></use>
                                                    </svg>
                                                @endif

                                            </td>
                                            <td>
                                                @if($sensor->is_connected)
                                                    <svg class="c-icon c-icon-xl">
                                                        <use
                                                            xlink:href="assets/icons/coreui/free-symbol-defs.svg#cui-link"></use>
                                                    </svg>

                                                @else
                                                    <svg class="c-icon c-icon-xl blink-danger">

                                                        <use
                                                            xlink:href="assets/icons/coreui/free-symbol-defs.svg#cui-link-broken"></use>
                                                    </svg>

                                                @endif
                                            </td>
                                            <td>

                                                @if($sensor->signal_strength > 70)

                                                    <svg class="c-icon c-icon-xl">
                                                        <use
                                                            xlink:href="assets/icons/coreui/free-symbol-defs.svg#cui-wifi-signal-4"></use>
                                                    </svg>

                                                @elseif($sensor->signal_strength > 30 && $sensor->signal_strength < 70 )

                                                    <svg class="c-icon c-icon-xl">
                                                        <use
                                                            xlink:href="assets/icons/coreui/free-symbol-defs.svg#cui-wifi-signal-2"></use>
                                                    </svg>
                                                @else

                                                    <svg class="c-icon c-icon-xl blink-danger">
                                                        <use
                                                            xlink:href="assets/icons/coreui/free-symbol-defs.svg#cui-wifi-signal-off"></use>
                                                    </svg>

                                                @endif
                                            </td>
                                            <td>
                                                <svg class="c-icon c-icon-xl">
                                                    <use
                                                        xlink:href="assets/icons/coreui/free-symbol-defs.svg#cui-signal-cellular-4"></use>
                                                </svg>
                                            </td>

                                            <td>
                                                <strong>{{ \Carbon\Carbon::parse($sensor->last_seen)->diffForHumans([ 'parts' => 2 ]) }}</strong>
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
    <!-- /.modal-->
    <div class="modal fade" id="sensorModal" tabindex="-1" role="dialog" aria-labelledby="sensorModalLabel" aria-hidden="true">
        <div class="modal-dialog  modal-dialog-centered modal-info" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">Sensor</h4>
                    <button class="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                </div>
                <div class="modal-body">
                    <p>One fine body…</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-dismiss="modal">Close</button>
                    <button class="btn btn-info" type="button">Save changes</button>
                </div>
            </div>
            <!-- /.modal-content-->
        </div>
@endsection

@section('javascript')
    <script src="{{ asset('js/devices.js') }}" defer></script>
@endsection

