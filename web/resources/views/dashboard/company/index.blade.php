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
                            <h4><i class="cil-building"></i> {{ __('Company') }}</div>
                        </h4>
                        <div class="card-body">
                            <div class="col-lg-12 col-md-12">
                                <div class="table-responsive">
                                    <table id="company-table"
                                           class="data-table table table-outline table-fixed table-hover mt-lg-5"
                                           style="margin-top: 20px">
                                        <thead>
                                        <tr>
                                            <th>Company Name</th>
                                            <th>Created At</th>
                                            <th>Updated At</th>
                                            <th class="text-right actions">
                                                <i class="cil-options"></i>
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        </tbody>
                                    </table>
                                </div>
                                <button type="button" class="btn btn-primary" data-toggle="modal"
                                        data-target="#createCompanyModal">
                                    <i class="cil-plus"></i> Create Company
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <div class="modal fade" id="createCompanyModal" tabindex="-1" role="dialog"
         aria-labelledby="createCompanyModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-md" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Create Company</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>

                </div>
                <div class="modal-body">
                    @include('dashboard.company.create')
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="editCompanyModal" tabindex="-1"
         role="dialog" aria-labelledby="editCompanyModalLabel"
         aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Edit Company</h5>
                    <button type="button" class="close" data-dismiss="modal"
                            aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    @include('dashboard.company.edit')
                </div>
            </div>
        </div>
    </div>
    </div>
@endsection

@section('javascript')
    <script>
        $(document).ready(function () {
            getData();
        });
        function getData() {
            let query = {"relations": ["zones"]};
            query = encodeURI(JSON.stringify(query));
            api.get('/companies?query=' + query).then((res) => {
                let uTable = $("#company-table").DataTable();
                uTable.clear().draw();

                $.each(res.data.result, function () {
                    let dt = $(this)[0];
                    if (typeof dt === 'undefined') return false;
                    let newData = [
                        dt.name,
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
                        '</a>' +
                        '<button class="btn btn-danger" style="margin-left: 4px;" onclick="deleteCompany(' + dt.id + ')">\n' +
                        '    <i class="cil-trash"></i>\n' +
                        '</button>\n'
                    ];
                    uTable.row.add(newData);
                });

                uTable.draw();
            }).catch((error) => {
                console.error(error)
            });
        }

        function deleteCompany(id) {
            let confirmDelete = confirm('Are you sure you want to delete this company?');

            if (confirmDelete) {
                api.delete("/companies/" + id).then((res) => {
                    showAlert('Company deleted', 'success');
                    getData();
                    // showAlert(role + ' has been deleted.', 'success')
                }).catch((error) => {
                    console.error(error)
                });
            }
        }
    </script>
@endsection

