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
                            <h4><i class="fa fa-align-justify"></i>{{ __('Company') }}</div></h4>
                        <div class="card-body">
                            <div class="col-lg-12 col-md-12">

                                <a class="btn btn-md btn-primary" href="{{ route('company.create') }}"><i
                                        class="cil-plus"></i> {{__('Add Company') }}</a>
                                <hr>

                                <table class="table table-responsive-sm table-hover table-outline mb-0">
                                    <thead>
                                    <tr>
                                        <th>Company Name</th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    @foreach($companies as $company)
                                        <tr>
                                            <td><strong>{{ $company->name }}</strong></td>

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
