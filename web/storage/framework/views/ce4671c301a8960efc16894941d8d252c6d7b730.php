<?php $__env->startSection('content'); ?>

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
                            <div class="text-value-lg">30</div>
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
                                <div class="dropdown-menu dropdown-menu-right"><a class="dropdown-item"
                                        href="#">Action</a><a class="dropdown-item" href="#">Another action</a><a
                                        class="dropdown-item" href="#">Something else
                                        here</a></div>
                            </div>
                            <div class="text-value-lg">90</div>
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
                                <div class="dropdown-menu dropdown-menu-right"><a class="dropdown-item"
                                        href="#">Action</a><a class="dropdown-item" href="#">Another action</a><a
                                        class="dropdown-item" href="#">Something else
                                        here</a></div>
                            </div>
                            <div class="text-value-lg">2.5%</div>
                            <div>System Downtime</div>
                            <small class="text-muted">Downtime frequency</small>
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
                            
                            <button id="addDataset" class="btn btn-primary">Add Sensor</button>
                            <button id="removeDataset" class="btn btn-primary">Remove Sensor</button>
                            
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
                                    <th>Zone</th>
                                    <th>Company</th>
                                    <th>
                                        <svg class="c-icon">
                                            <use xlink:href="assets/icons/coreui/free-symbol-defs.svg#cui-bolt"></use>
                                        </svg>
                                    </th>
                                    <th>
                                        Status
                                    </th>
                                    <th>Uptime</th>
                                </tr>
                            </thead>
                            <tbody>
                                

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
                                        <div class="text-value-lg">10</div>
                                    </div>
                                </div>
                                <!-- /.col-->
                                <div class="col-6">
                                    <div class="c-callout c-callout-info"><small class="text-muted">Longest
                                            Uptime</small>
                                        <div class="text-value-lg">120 hours</div>
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
                                        <div class="progress-bar bg-warning" role="progressbar" style="width: 60%"
                                            aria-valuenow="43" aria-valuemin="0" aria-valuemax="100"></div>
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
                                        <div class="progress-bar bg-warning" role="progressbar" style="width: 40%"
                                            aria-valuenow="43" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                            </div>
                            
                            
                            
                            
                        </div>
                        <!-- /.col-->
                        <div class="col-sm-6">
                            <div class="row">
                                <div class="col-6">
                                    <div class="c-callout c-callout-success"><small class="text-muted">Connected</small>
                                        <div class="text-value-lg">95</div>
                                    </div>
                                </div>
                                <!-- /.col-->
                                <div class="col-6">
                                    <div class="c-callout c-callout-danger"><small class="text-muted">Disconnected</small>
                                        <div class="text-value-lg">5</div>
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
                                        <div class="progress-bar bg-success" role="progressbar" style="width: 95%"
                                            aria-valuenow="95" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                    <div class="progress progress-xs">
                                        <div class="progress-bar bg-danger" role="progressbar" style="width: 5%"
                                            aria-valuenow="5" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="progress-group mb-4">
                                <div class="progress-group-prepend"><span class="progress-group-text">Tuesday</span>
                                </div>
                                <div class="progress-group-bars">
                                    <div class="progress progress-xs">
                                        <div class="progress-bar bg-success" role="progressbar" style="width: 96%"
                                            aria-valuenow="96" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                    <div class="progress progress-xs">
                                        <div class="progress-bar bg-danger" role="progressbar" style="width: 4%"
                                            aria-valuenow="4" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="progress-group mb-4">
                                <div class="progress-group-prepend"><span class="progress-group-text">Wednesday</span></div>
                                <div class="progress-group-bars">
                                    <div class="progress progress-xs">
                                        <div class="progress-bar bg-success" role="progressbar" style="width: 93%"
                                            aria-valuenow="93" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                    <div class="progress progress-xs">
                                        <div class="progress-bar bg-danger" role="progressbar" style="width: 7%"
                                            aria-valuenow="7" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="progress-group mb-4">
                                <div class="progress-group-prepend"><span class="progress-group-text">Thursday</span></div>
                                <div class="progress-group-bars">
                                    <div class="progress progress-xs">
                                        <div class="progress-bar bg-success" role="progressbar" style="width: 92%"
                                            aria-valuenow="92" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                    <div class="progress progress-xs">
                                        <div class="progress-bar bg-danger" role="progressbar" style="width: 8%"
                                            aria-valuenow="8" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="progress-group mb-4">
                                <div class="progress-group-prepend"><span class="progress-group-text">Friday</span>
                                </div>
                                <div class="progress-group-bars">
                                    <div class="progress progress-xs">
                                        <div class="progress-bar bg-success" role="progressbar" style="width: 94%"
                                            aria-valuenow="94" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                    <div class="progress progress-xs">
                                        <div class="progress-bar bg-danger" role="progressbar" style="width: 6%"
                                            aria-valuenow="6" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="progress-group mb-4">
                                <div class="progress-group-prepend"><span class="progress-group-text">Saturday</span></div>
                                <div class="progress-group-bars">
                                    <div class="progress progress-xs">
                                        <div class="progress-bar bg-success" role="progressbar" style="width: 93%"
                                            aria-valuenow="93" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                    <div class="progress progress-xs">
                                        <div class="progress-bar bg-danger" role="progressbar" style="width: 7%"
                                            aria-valuenow="7" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="progress-group mb-4">
                                <div class="progress-group-prepend"><span class="progress-group-text">Sunday</span>
                                </div>
                                <div class="progress-group-bars">
                                    <div class="progress progress-xs">
                                        <div class="progress-bar bg-success" role="progressbar" style="width: 96%"
                                            aria-valuenow="96" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                    <div class="progress progress-xs">
                                        <div class="progress-bar bg-danger" role="progressbar" style="width: 4%"
                                            aria-valuenow="4" aria-valuemin="0" aria-valuemax="100"></div>
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

<?php $__env->stopSection(); ?>

<?php $__env->startSection('javascript'); ?>
    <script src="<?php echo e(asset('js/moment.min.js')); ?>"></script>
    <script src="<?php echo e(asset('js/Chart.min.js')); ?>"></script>
    <script src="<?php echo e(asset('js/coreui-chartjs.bundle.js')); ?>"></script>
    <script src="<?php echo e(asset('js/chartjs-plugin-streaming.min.js')); ?>"></script>

    <script>
        let socket = new WebSocket("<?php echo e($WS_ISSUER); ?>/sensors/data");

        socket.onopen = function(e) {
            alert("[open] Connection established");
            alert("Sending to server");
            socket.send("My name is John");
        };

        socket.onmessage = function(event) {
            alert(`[message] Data received from server: ${event.data}`);
        };

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
    <script src="<?php echo e(asset('js/dashboard.js')); ?>" defer></script>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('dashboard.base', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /home/kevin/upsense/web/resources/views/dashboard/home.blade.php ENDPATH**/ ?>