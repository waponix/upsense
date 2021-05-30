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
                                <i class="cil-location-pin"></i> {{ __('Zones') }}
                            </h4>
                        </div>
                        <div class="card-body">
                            <div class="col-lg-12 col-md-12">
                                <div class="form-group row">
                                    <div class="col-md-4 col-lg-4">
                                        <label></label>
                                        <div class="input-group mb-3">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text">
                                                <svg class="c-icon c-icon-sm">
                                                  <use
                                                      xlink:href="/assets/icons/coreui/free-symbol-defs.svg#cui-building"></use>
                                                </svg>
                                                </span>
                                            </div>
                                            <select class="form-control" name="company" id="company" required>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <table id="zone-table"
                                       class="table table-responsive-sm table-sm table-hover table-outline mb-0">
                                    <thead>
                                    <tr>
                                        <th>Zone</th>
                                        <th>Created At</th>
                                        <th>Updated At</th>
                                        <th class="text-right actions"></th>
                                    </tr>
                                    </thead>
                                    <tbody>

                                    </tbody>
                                </table>

                                <button type="button" class="btn btn-primary" data-toggle="modal"
                                        data-target="#createZoneModal">
                                    <i class="cil-plus"></i> Create Zone
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="createZoneModal" tabindex="-1" role="dialog"
         aria-labelledby="createZoneModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-md" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Create Zone</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>

                </div>
                <div class="modal-body">
                    @include('dashboard.zone.create')
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="editZoneModal" tabindex="-1"
         role="dialog" aria-labelledby="editZoneModalLabel"
         aria-hidden="true">
        <div class="modal-dialog modal-md" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Edit Zone</h5>
                    <button type="button" class="close" data-dismiss="modal"
                            aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    @include('dashboard.zone.edit')
                </div>
            </div>
        </div>
    </div>
@endsection

@section('javascript')

    <script>
        $(document).ready(function () {
            let query = {"relations": ["zones"]};
            query = encodeURI(JSON.stringify(query));
            api.get('/companies?query=' + query).then((res) => {
                let options = '<option>- select company -</option>';
                $.each(res.data.result, function () {
                    options += '<option value="' + $(this)[0].id + '">' + $(this)[0].name + '</option>';
                })

                $("#company").html(options).on("change", function () {
                    getData($(this).val());
                });

            }).catch((error) => {
                console.error(error)
            });

            getData();

        });

        function getData(cid) {
            let uTable = $("#zone-table").DataTable();
            uTable.clear().draw();

            let zoneQuery = {"relations": ["users"]};
            zoneQuery = encodeURI(JSON.stringify(zoneQuery));
            if (typeof cid === 'undefined') return false;

            api.get('/companies/' + cid + '/zones?query=' + zoneQuery).then((res) => {
                uTable.clear().draw();
                $.each(res.data.result, function () {
                    let dt = $(this)[0];
                    uTable.row.add([
                        dt.name,
                        moment.unix(dt.createdAt).format('YYYY-MM-DD HH:mm:ss'),
                        moment.unix(dt.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
                        // '<a href="companies/' + '/zones/' + dt.id + '"\n' +
                        // '   class="btn inline-block btn-primary"\n' +
                        // '   data-toggle="modal"\n' +
                        // '   data-target="#showZoneModal" ' +
                        // '   data-id="' + dt.id + '">\n' +
                        // '   <i class="cil-magnifying-glass"></i>\n' +
                        // '</a>\n' +
                        '<a href="/companies/' + dt.id + '/zones/' + dt.id + '/edit"\n' +
                        '   class="btn inline-block btn-primary"\n' +
                        '   data-toggle="modal"\n' +
                        '   data-id="' + dt.id + '"\n' +
                        '   data-target="#editZoneModal">\n' +
                        '   <i class="cil-pencil"></i>\n' +
                        '</a>' +
                        '<button class="btn btn-danger" style="margin-left: 4px;" ' +
                        'onclick="deleteZone(' + dt.id + ', ' + cid + ', `' + dt.name + '`)">\n' +
                        '    <i class="cil-trash"></i>\n' +
                        '</button>\n'
                    ]);
                });

                uTable.draw();
            }).catch((error) => {
                console.error(error)
            });
        }

        function deleteZone(id, cid, name) {
            let confirmDelete = confirm('Are you sure you want to delete ' + name + '?');

            if (confirmDelete) {
                api.delete("/companies/" + cid + "/zones/" + id).then((res) => {
                    getData(cid);
                    showAlert(name + ' has been deleted.', 'success')
                }).catch((error) => {
                    console.error(error)
                });
            }
        }
    </script>
@endsection

