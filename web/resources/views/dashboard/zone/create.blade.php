@extends('dashboard.base')

@section('content')

    <div class="container-fluid">
        <div class="animated fadeIn">
            <div class="row">
                <div class="col-sm-12 col-md-10 col-lg-8 col-xl-6">
                    <div class="card">
                        <div class="card-header"><i class="cil-blur-circular"></i>{{ __('Add Zone') }}</div>
                        <div class="card-body">
                            <form method="POST" action="{{ route('zones.store') }}">
                                @csrf
                                <div class="form-group row">
                                    <label>Zone name:</label>
                                    <input class="form-control" type="text" placeholder="{{ __('Zone Name') }}" name="name"
                                           required autofocus>
                                </div>

                                <div class="form-group row">
                                    <div class="col">
                                        <label>Assign to Company: </label>

                                        <select class="form-control" name="company_id">
                                            @foreach($companies as $company)
                                                <option value="{{ $company->company_id }}">{{ $company->name }}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                </div>
                                <button class="btn btn-block btn-success" type="submit">{{ __('Add') }}</button>
                                <a href="{{ route('zones.index') }}"
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
