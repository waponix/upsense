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
                                <i class="cil-tablet"></i> {{ __('Hubs') }}
                            </h4>
                        </div>
                        <div class="card-body">
                            <div class="col-lg-12 col-md-12">

                                <a class="btn btn-md btn-primary" href="{{ route('hubs.create') }}"><i
                                        class="cil-plus"></i> {{__('Add Hub') }}</a>
                                <hr>
                                <table class="table table-responsive-sm table-hover table-outline mb-0">
                                    <thead>
                                    <tr>
                                        <th>Serial Number</th>
                                        {{--                            <th>Description</th>--}}
                                        <th>HW Version</th>
                                        <th>SW Version</th>
                                        <th>FW Version</th>
                                        <th>Min Temp</th>
                                        <th>Max Temp</th>
                                        <th>Status</th>
                                        <th>Last Seen</th>
                                        <th>Type</th>
                                        <th>IMEI</th>
                                        <th>Zone</th>
                                        <th>Company</th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    @foreach($hubs as $hub)
                                        <tr>
                                            <td><strong>{{ $hub->serial }}</strong></td>
                                            {{--                              <td><strong>{{ $hub->description }}</strong></td>--}}
                                            <td>{{ $hub->hw_version }}</td>
                                            <td>{{ $hub->sw_version }}</td>
                                            <td>{{ $hub->fw_version }}</td>
                                            <td>{{ $hub->min_temp }}</td>
                                            <td>{{ $hub->max_temp }}</td>
                                            <td>{{ $hub->is_connected }}</td>
                                            <td>{{ \Carbon\Carbon::parse($hub->last_seen)->diffForHumans([ 'parts' => 2 ]) }}</td>
                                            <td>{{ $hub->type }}</td>
                                            <td>{{ $hub->imei }}</td>
                                            <td>{{ $hub->zone->name }}</td>
                                            <td>{{ $hub->zone->company->name }}</td>
                                            <td>
                                                <a href="{{ url('/hubs/' . $hub->hub_id) }}"
                                                   class="btn btn-block btn-primary">View</a>
                                            </td>
                                            <td>
                                                <a href="{{ url('/hubs/' . $hub->hub_id . '/edit') }}"
                                                   class="btn btn-block btn-primary">Edit</a>
                                            </td>
                                            <td>
                                                <form action="{{ route('hubs.destroy', $hub->hub_id ) }}" method="POST">
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

