@extends('dashboard.base')

@section('content')
    <div class="container-fluid">
        <div class="animated fadeIn">
            <div class="row">
                <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <div class="card">
                        <div class="card-header">
                            <h4><i class="cil-blur-circular"></i> {{ __('Sensors') }}</h4>
                        </div>
                        <div class="card-body">
                            <div class="col-lg-12 col-md-12">
                                <div class="table-responsive">
                                    <table id="sensor-table"
                                        class="data-table table table-outline table-fixed table-hover mt-lg-5"
                                        style="margin-top: 20px">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Serial</th>
                                                <th>Status</th>
                                                <th>Current Temp</th>
                                                <th>Battery Status</th>
                                                <th>Min Temp</th>
                                                <th>Max Temp</th>
                                                <th>Last Seen</th>
                                                <th>Created At</th>
                                                <th>Updated At</th>
                                                <th class="text-right actions">
                                                    <i class="cil-options"></i>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody style="text-center">

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>

@endsection


@section('javascript')
    <script>
        $(document).ready(function() {
            getData();
        });

        function getData() {
            let query = {
                "relations": ["zones"]
            };
            query = encodeURI(JSON.stringify(query));
            api.get('/sensors?query=' + query).then((res) => {
                let uTable = $("#sensor-table").DataTable();
                uTable.clear().draw();
                $.each(res.data.result, function() {
                    let dt = $(this)[0];
                    if (typeof dt === 'undefined') return false;
                    console.log(dt)
                    let newData = [
                        dt.name,
                        dt.serial,
                        dt.isConnected == 1 ? '<svg class="c-icon c-icon-xl text-success"><use xlink:href="assets/icons/coreui/free-symbol-defs.svg#cui-link"></use></svg>' :
                        '<svg class="c-icon c-icon-xl text-danger"><use xlink:href="assets/icons/coreui/free-symbol-defs.svg#cui-link-broken"></use></svg>',
                        dt.currentTemp,
                        dt.batteryStatus,
                        dt.minTemp,
                        dt.maxTemp,
                        moment.unix(dt.lastSeen).fromNow(true),
                        moment.unix(dt.createdAt).format('YYYY-MM-DD HH:mm:ss'),
                        moment.unix(dt.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
                        // '<a href="/companies/' + dt.id + '"\n' +
                        // '   class="btn inline-block btn-primary"\n' +
                        // '   data-toggle="modal"\n' +
                        // '   data-target="#showCompanyModal" ' +
                        // '   data-id="' + dt.id + '">\n' +
                        // '   <i class="cil-magnifying-glass"></i>\n' +
                        // '</a>\n' +
                        '<a href="/companies/' + dt.id + '/edit"\n' +
                        '   class="btn inline-block btn-primary"\n' +
                        '   data-toggle="modal"\n' +
                        '   data-id="' + dt.id + '"\n' +
                        '   data-target="#editCompanyModal">\n' +
                        '   <i class="cil-pencil"></i>\n' +
                        '</a>' 
                        // '<button class="btn btn-danger" style="margin-left: 4px;" onclick="deleteCompany(' +
                        // dt.id + ')">\n' +
                        // '    <i class="cil-trash"></i>\n' +
                        // '</button>\n'
                    ];
                    uTable.row.add(newData);
                });

                uTable.draw();
            }).catch((error) => {
                console.error(error)
            });
        }

    </script>

@endsection
