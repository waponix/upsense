@extends('dashboard.base')

@section('content')

        <div class="container-fluid">
          <div class="animated fadeIn">
            <div class="row">
              <div class="col-sm-12 col-md-10 col-lg-8 col-xl-6">
                <div class="card">
                    <div class="card-header">
                      <i class="fa fa-align-justify"></i> {{ __('Edit') }}: {{ $zone->name }}</div>
                    <div class="card-body">
                        <form method="POST" action="/zones/{{ $zone->id }}">
                            @csrf
                            @method('PUT')
                            <div class="form-group row">
                                <div class="col">
                                    <label>Name</label>
                                    <input class="form-control" type="text" placeholder="{{ __('Zone Name') }}" name="name" value="{{ $zone->name }}" required autofocus>
                                </div>
                            </div>

                            <div class="form-group row">
                                <div class="col">
                                    <label>Company</label>
                                    <select class="form-control" name="status_id">
                                        @foreach($companies as $company)
                                            @if( $company->company_id == $zone->company_id )
                                                <option value="{{ $company->company_id }}" selected="true">{{ $company->name }}</option>
                                            @else
                                                <option value="{{ $company->company_id }}">{{ $company->name }}</option>
                                            @endif
                                        @endforeach
                                    </select>
                                </div>
                            </div>

                            <button class="btn btn-block btn-success" type="submit">{{ __('Save') }}</button>
                            <a href="{{ route('zones.index') }}" class="btn btn-block btn-primary">{{ __('Return') }}</a>
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
