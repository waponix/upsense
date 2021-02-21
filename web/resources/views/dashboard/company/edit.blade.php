@extends('dashboard.base')

@section('content')

    <div class="container-fluid">
        <div class="animated fadeIn">
            <div class="row">
                <div class="col-sm-12 col-md-10 col-lg-8 col-xl-6">
                    <div class="card">
                        <div class="card-header">
                            <h4><i class="fa fa-align-justify"></i> {{ __('Edit Company') }}</div>
                        </h4>
                        <div class="card-body">
                            <form method="POST" action="/company/{{ $company->company_id }}">
                                @csrf
                                @method('PUT')
                                <div class="input-group mb-3">
                                    <div class="col">
                                        <label>Company Name</label>

                                        <input class="form-control" type="text" placeholder="{{ __('Company Name') }}"
                                               name="name" value="{{ $company->name }}" required autofocus>
                                    </div>
                                </div>

                                <button class="btn btn-block btn-success" type="submit">{{ __('Save') }}</button>
                                <a href="{{ route('company.index') }}"
                                   class="btn btn-block btn-primary">{{ __('Return') }}</a>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

@endsection

@section('javascript')

@endsection
