@extends('dashboard.base')

@section('content')

    <div class="container-fluid">
        <div class="animated fadeIn">
            <div class="row">
                <div class="col-sm-12 col-md-6 col-lg-4 col-xl-4">
                    <div class="card">
                        <div class="card-header">
                            <h4><i class="fa fa-align-justify"></i> {{ __('View Company') }}</div>
                        <div class="card-body">
                            <h4>Company Name:</h4>
                            <p> {{ $company->name }}</p>
                        </div>
                        <div class="card-footer">
                            <a href="{{ route('company.index') }}"
                               class="btn btn-primary">{{ __('Return') }}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

@endsection


@section('javascript')

@endsection
