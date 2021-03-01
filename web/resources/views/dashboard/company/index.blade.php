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
                            <h4><i class="cil-building"></i> {{ __('Company') }}</div></h4>
                        <div class="card-body">
                            <div class="col-lg-12 col-md-12">
                                <a class="btn btn-md btn-primary" href="{{ route('company.create') }}"><i
                                        class="cil-plus"></i> {{__('Add Company') }}</a>
                                <hr>

                                <table id="company-table" class="table table-responsive table-hover table-outline mb-0">
                                    <thead>
                                    <tr>
                                        <th class="col-lg-8 col-md-6">Company Name</th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    @foreach($companies as $company)
                                        <tr>
                                            <td>{{ $company->name }}</td>
                                            <td>
                                                <a href="{{ url('/company/' . $company->company_id) }}"
                                                   class="btn btn-block btn-primary">View</a>
                                            </td>
                                            <td>
                                                <a href="{{ url('/company/' . $company->company_id . '/edit') }}"
                                                   class="btn btn-block btn-primary">Edit</a>
                                            </td>
                                            <td>
                                                <form action="{{ route('company.destroy', $company->company_id ) }}"
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

