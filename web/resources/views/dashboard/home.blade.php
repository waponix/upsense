@extends('dashboard.base')

@section('content')

    <div class="container-fluid">
        <div class="fade-in">
            <div class="row">
                <div class="col-sm-6 col-lg-4">
                    <div class="card text-white bg-info">
                        <div class="card-body pb-0">
                            <button class="btn btn-transparent p-0 float-right" type="button">
                                <svg class="c-icon">
                                    <use xlink:href="assets/icons/coreui/free-symbol-defs.svg#cui-location-pin"></use>
                                </svg>
                            </button>
                            <div id="no-of-active-sensors" class="text-value-lg">0</div>
                            <div>Active Sensors</div>
                            <small class="text-muted">Number of sensors connected</small>
                        </div>
                        <div class="c-chart-wrapper mt-3 mx-3" style="height:70px;">
                            <canvas class="chart" id="card-chart1" height="70"></canvas>
                        </div>
                    </div>
                </div>
                <!-- /.col-->
                <div class="col-sm-6 col-lg-4">
                    <div class="card text-white bg-warning">
                        <div class="card-body pb-0">
                            <div class="btn-group float-right">
                                <button class="btn btn-transparent dropdown-toggle p-0" type="button" data-toggle="dropdown"
                                    aria-haspopup="true" aria-expanded="false">
                                    <svg class="c-icon">
                                        <use xlink:href="assets/icons/coreui/free-symbol-defs.svg#cui-settings"></use>
                                    </svg>
                                </button>
                                <div class="dropdown-menu dropdown-menu-right">
                                    <a class="dropdown-item" href="#">Show All</a>
                                </div>
                            </div>
                            <div class="text-value-lg">0</div>
                            <div>Alerts</div>
                            <small class="text-muted">no. of alerts over the past week</small>
                        </div>
                        <div class="c-chart-wrapper mt-3" style="height:70px;">
                            <canvas class="chart" id="card-chart2" height="70"></canvas>
                        </div>
                    </div>
                </div>
                <!-- /.col-->
                <div class="col-sm-6 col-lg-4">
                    <div class="card text-white bg-danger">
                        <div class="card-body pb-0">
                            <div class="btn-group float-right">
                                <button class="btn btn-transparent dropdown-toggle p-0" type="button" data-toggle="dropdown"
                                    aria-haspopup="true" aria-expanded="false">
                                    <svg class="c-icon">
                                        <use xlink:href="assets/icons/coreui/free-symbol-defs.svg#cui-settings"></use>
                                    </svg>
                                </button>
                                <div class="dropdown-menu dropdown-menu-right"><a class="dropdown-item" href="#">View
                                        Logs</a>
                                </div>
                            </div>
                            <div class="text-value-lg">0%</div>
                            <div>System Downtime</div>
                            <small class="text-muted">Downtime frequency over past months</small>
                        </div>
                        <div class="c-chart-wrapper mt-3 mx-3" style="height:70px;">
                            <canvas class="chart" id="card-chart3" height="70"></canvas>
                        </div>
                    </div>
                </div>
                <!-- /.col-->
            </div>
            <!-- /.row-->
            <div class="card">
                <div class="card-body">
                    <div class="row">
                        <div class="col-sm-5">
                            <h4 class="card-title mb-0">Realtime Temperatures</h4>
                            <div class="small text-muted">Today</div>
                        </div>
                        <!-- /.col-->
                        <div class="col-sm-7 d-none d-md-block">
                            <button class="btn btn-primary float-right" type="button">
                                <svg class="c-icon">
                                    <use xlink:href="assets/icons/coreui/free-symbol-defs.svg#cui-cloud-download"></use>
                                </svg>
                            </button>
                        </div>
                        <!-- /.col-->
                    </div>
                    <!-- /.row-->
                    <div class="c-chart-wrapper" style="height:450px;margin-top:40px;">
                        <div class="pull-right">
                            {{-- <button id="randomizeData" class="btn btn-primary">Randomize Data</button> --}}
                            {{-- <button id="addDataset" class="btn btn-primary">Add Sensor</button>
                            <button id="removeDataset" class="btn btn-primary">Remove Sensor</button> --}}
                            {{-- <button id="addData" class="btn btn-primary">Add Data</button> --}}
                        </div>
                        <canvas class="chart" id="main-chart" height="400"></canvas>

                    </div>
                </div>
                <div class="card-footer">
                    <div class="row text-center">

                        <div class="col-sm-12 col-md mb-sm-2 mb-0" id="highest-point">
                            <div class="text-muted">Highest Point</div>
                            <span class="text-warning"><strong>0</strong><strong>°C</strong></span>
                            <div class="progress progress-xs mt-2">
                                <div class="progress-bar bg-warning" role="progressbar" style="width: 0%" aria-valuenow="60"
                                    aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md mb-sm-2 mb-0" id="lowest-point">
                            <div class="text-muted">Lowest Point</div>
                            <span class="text-info"><strong>0</strong><strong>°C</strong></span>
                            <div class="progress progress-xs mt-2">
                                <div class="progress-bar bg-info" role="progressbar" style="width: 0%" aria-valuenow="80"
                                    aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- /.row-->
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <svg class="c-icon progress-group-icon">
                            <use xlink:href="assets/icons/coreui/free-symbol-defs.svg#cui-heart"></use>
                        </svg>
                        Devices Health
                    </div>
                    <div class="card-body">
                        <!-- /.row-->
                        <table id="devices-table" class="table table-responsive-sm table-hover table-outline mb-0">
                            <thead class="thead-light">
                                <tr>
                                    <th>
                                        Device
                                    </th>
                                    <th>Serial</th>
                                    <th>Hub</th>
                                    <th>Current Temp</th>
                                    <th>Max Temp</th>
                                    <th>Min Temp</th>
                                    <th>Battery</th>
                                    <th>
                                        Status
                                    </th>
                                    <th>Uptime</th>
                                </tr>
                            </thead>
                            <tbody>
                                {{-- @foreach ($sensors as $sensor)
                                <tr>
                                    <td>
                                        {{$sensor->description}}
                                    </td>
                                    <td>
                                        {{$sensor->serial}}
                                    </td>
                                    <td>
                                        {{$sensor->hub->serial}}
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
                                        @if ($sensor->battery_status > 70)

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
                                        @if ($sensor->is_connected)
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

                                        @if ($sensor->signal_strength > 70)

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
                            @endforeach --}}

                            </tbody>
                        </table>
                    </div>
                    <div class="row col-xl-12 col-md-12 col-lg-12">
                        <!-- /.col-->
                        <div class="col-sm-6">
                            <div class="row">
                                <div class="col-6">
                                    <div class="c-callout c-callout-warning"><small class="text-muted">Critical
                                            Status</small>
                                        <div class="text-value-lg">0</div>
                                    </div>
                                </div>
                                <!-- /.col-->
                                <div class="col-6">
                                    <div class="c-callout c-callout-info"><small class="text-muted">Longest
                                            Uptime</small>
                                        <div class="text-value-lg">0 hours</div>
                                    </div>
                                </div>
                                <!-- /.col-->
                            </div>
                            <!-- /.row-->
                            <hr class="mt-0">
                            <div class="progress-group">
                                <div class="progress-group-header">
                                    <svg class="c-icon progress-group-icon">
                                        <use xlink:href="assets/icons/coreui/free-symbol-defs.svg#cui-battery-slash"></use>
                                    </svg>
                                    <div>No Battery</div>
                                    <div class="ml-auto font-weight-bold">6</div>
                                </div>
                                <div class="progress-group-bars">
                                    <div class="progress progress-xs">
                                        <div class="progress-bar bg-warning" role="progressbar" style="width: 0%"
                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="progress-group mb-5">
                                <div class="progress-group-header">
                                    <svg class="c-icon progress-group-icon">
                                        <use xlink:href="assets/icons/coreui/free-symbol-defs.svg#cui-wifi-signal-off">
                                        </use>
                                    </svg>
                                    <div>No Wifi</div>
                                    <div class="ml-auto font-weight-bold">4</div>
                                </div>
                                <div class="progress-group-bars">
                                    <div class="progress progress-xs">
                                        <div class="progress-bar bg-warning" role="progressbar" style="width: 0%"
                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                            </div>
                            {{-- @foreach ($sensors as $sensor)
                                <div class="progress-group">
                                    <div class="progress-group-header align-items-end">
                                        {{--                              <svg class="c-icon progress-group-icon"> --}}
                            {{-- <use xlink:href="assets/icons/coreui/free-symbol-defs.svg#cui-globe-alt"></use> --}}
                            {{-- </svg> --}}
                            {{-- <div>{{$sensor->description}}</div>
                                        <div class="ml-auto font-weight-bold mr-2">120</div>
                                        <div class="text-muted small">(56%)</div>
                                    </div>
                                    <div class="progress-group-bars">
                                        <div class="progress progress-xs">
                                            <div class="progress-bar bg-info" role="progressbar" style="width: 56%"
                                                 aria-valuenow="56" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                    </div>
                                </div>
                            @endforeach --}}
                        </div>
                        <!-- /.col-->
                        <div class="col-sm-6">
                            <div class="row">
                                <div class="col-6">
                                    <div class="c-callout c-callout-success"><small class="text-muted">Connected</small>
                                        <div class="text-value-lg">0</div>
                                    </div>
                                </div>
                                <!-- /.col-->
                                <div class="col-6">
                                    <div class="c-callout c-callout-danger"><small class="text-muted">Disconnected</small>
                                        <div class="text-value-lg">0</div>
                                    </div>
                                </div>
                                <!-- /.col-->
                            </div>
                            <!-- /.row-->
                            <hr class="mt-0">
                            <div class="progress-group mb-4">
                                <div class="progress-group-prepend"><span class="progress-group-text">Monday</span>
                                </div>
                                <div class="progress-group-bars">
                                    <div class="progress progress-xs">
                                        <div class="progress-bar bg-success" role="progressbar" style="width: 0%"
                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                    <div class="progress progress-xs">
                                        <div class="progress-bar bg-danger" role="progressbar" style="width: 0%"
                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="progress-group mb-4">
                                <div class="progress-group-prepend"><span class="progress-group-text">Tuesday</span>
                                </div>
                                <div class="progress-group-bars">
                                    <div class="progress progress-xs">
                                        <div class="progress-bar bg-success" role="progressbar" style="width: 0%"
                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                    <div class="progress progress-xs">
                                        <div class="progress-bar bg-danger" role="progressbar" style="width: 0%"
                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="progress-group mb-4">
                                <div class="progress-group-prepend"><span class="progress-group-text">Wednesday</span></div>
                                <div class="progress-group-bars">
                                    <div class="progress progress-xs">
                                        <div class="progress-bar bg-success" role="progressbar" style="width: 0%"
                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                    <div class="progress progress-xs">
                                        <div class="progress-bar bg-danger" role="progressbar" style="width: 0%"
                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="progress-group mb-4">
                                <div class="progress-group-prepend"><span class="progress-group-text">Thursday</span></div>
                                <div class="progress-group-bars">
                                    <div class="progress progress-xs">
                                        <div class="progress-bar bg-success" role="progressbar" style="width: 0%"
                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                    <div class="progress progress-xs">
                                        <div class="progress-bar bg-danger" role="progressbar" style="width: 0%"
                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="progress-group mb-4">
                                <div class="progress-group-prepend"><span class="progress-group-text">Friday</span>
                                </div>
                                <div class="progress-group-bars">
                                    <div class="progress progress-xs">
                                        <div class="progress-bar bg-success" role="progressbar" style="width: 0%"
                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                    <div class="progress progress-xs">
                                        <div class="progress-bar bg-danger" role="progressbar" style="width: 0%"
                                            aria-valuenow="6" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="progress-group mb-4">
                                <div class="progress-group-prepend"><span class="progress-group-text">Saturday</span></div>
                                <div class="progress-group-bars">
                                    <div class="progress progress-xs">
                                        <div class="progress-bar bg-success" role="progressbar" style="width: 0%"
                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                    <div class="progress progress-xs">
                                        <div class="progress-bar bg-danger" role="progressbar" style="width: 0%"
                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="progress-group mb-4">
                                <div class="progress-group-prepend"><span class="progress-group-text">Sunday</span>
                                </div>
                                <div class="progress-group-bars">
                                    <div class="progress progress-xs">
                                        <div class="progress-bar bg-success" role="progressbar" style="width: 0%"
                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                    <div class="progress progress-xs">
                                        <div class="progress-bar bg-danger" role="progressbar" style="width: 0%"
                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
            <!-- /.col-->
        </div>
        <!-- /.row-->
    </div>

@endsection

@section('javascript')
    <script src="{{ asset('js/moment.js') }}"></script>
    <script src="{{ asset('js/Chart.min.js') }}"></script>
    <script src="{{ asset('js/coreui-chartjs.bundle.js') }}"></script>
    <script src="{{ asset('js/chartjs-plugin-streaming.min.js') }}"></script>

    <script>
        //       var socket = io.connect("http://192.168.0.111:1884");
        // // use your socket
        // socket.on("connect", function(data) {
        //     console.log("connected")
        //     socket.emit('sensors/data', 'Hello World from client');
        // })

        // socket.on('sensors/data', function(data) {
        //     alert(data)
        // });

        let ws = new WebSocket("{{ $WS_ISSUER }}");

        ws.onopen = function() {
            console.log('Connected to websocket')
            //Subscribe to the channel
            const msg = {
                type: 'subscribe',
                channel: 'sensors/data',
                interval: 500,
            };
            ws.send(JSON.stringify(msg))
        }

        ws.onmessage = function(msg) {
            console.log(msg)
            console.log(JSON.parse(msg.data).message);
        }

        // ws.onmessage = function(event) {
        //     consoel.log(event)
        //     alert(`[message] Data received from server: ${event.data}`);
        // };

        // let socket = new WebSocket("{{ $WS_ISSUER }}");

        // socket.onopen = function(e) {
        //     alert("[open] Connection established");
        //     alert("Sending to server");
        //     socket.send("My name is John");
        // };

        // socket.onmessage = function(event) {
        //     consoel.log(event)
        //     alert(`[message] Data received from server: ${event.data}`);
        // };

        // socket.onclose = function(event) {
        //     if (event.wasClean) {
        //         alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        //     } else {
        //         // e.g. server process killed or network down
        //         // event.code is usually 1006 in this case
        //         alert('[close] Connection died');
        //     }
        // };

        // socket.onerror = function(error) {
        //     alert(`[error] ${error.message}`);
        // };

    </script>
    <script src="{{ asset('js/dashboard.js') }}" defer></script>
@endsection
