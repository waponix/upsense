@extends('dashboard.base')

@section('content')

    <div class="container-fluid">
        <div class="animated fadeIn">
            <div class="row">
                <div class="col-sm-12 col-md-10 col-lg-8 col-xl-6">
                    <div class="card">
                        <div class="card-header">
                            <h4><i class="fa fa-align-justify"></i> {{ __('View Company') }}</div>
                        <div class="card-body">
                            <h4>Company Name:</h4>
                            <p> {{ $company->name }}</p>
                            <a href="{{ route('company.index') }}"
                               class="btn btn-block btn-primary">{{ __('Return') }}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

@endsection


@section('javascript')

@endsection
