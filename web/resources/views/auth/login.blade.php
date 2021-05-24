@extends('dashboard.authBase')

@section('content')

    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card-group">
                    <div class="card p-4">
                        <div class="card-body">
                            <h1>Login</h1>
                            {{$JWT_ISSUER}}
                            <p class="text-muted">Sign In to your account </p>
                            <form method="POST" action="{{ route('login') }}">
                                @csrf
                                <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                      <span class="input-group-text">
                                        <svg class="c-icon">
                                          <use xlink:href="assets/icons/coreui/free-symbol-defs.svg#cui-user"></use>
                                        </svg>
                                      </span>
                                    </div>
                                    <input class="form-control" type="text" placeholder="{{ __('E-Mail Address') }}"
                                           name="email" value="{{ old('email') }}" required autofocus>
                                </div>
                                <div class="input-group mb-4">
                                    <div class="input-group-prepend">
                                      <span class="input-group-text">
                                        <svg class="c-icon">
                                          <use xlink:href="assets/icons/coreui/free-symbol-defs.svg#cui-lock-locked"></use>
                                        </svg>
                                      </span>
                                    </div>
                                    <input class="form-control" type="password" placeholder="{{ __('Password') }}"
                                           name="password" required>
                                </div>
                                @if(Session::has('errors'))
                                    <div class="row">
                                        <div class="col-12">
                                            <div class="alert alert-danger" role="alert">{{ trim(Session::get('errors'), '[""]') }}</div>
                                        </div>
                                    </div>
                                @endif
                                <div class="row">
                                    <div class="col-6">
                                        <button class="btn btn-primary px-4" type="submit">{{ __('Login') }}</button>
                                        {{--                        <button id="btn-login" class="btn btn-primary px-4" type="button">{{ __('Login') }}</button>--}}

                                    </div>

                                    <div class="col-6 text-right">
                                        {{--                        <a href="{{ route('password.request') }}" class="btn btn-link px-0">{{ __('Forgot Your Password?') }}</a>--}}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="card text-white bg-primary py-5 d-md-down-none" style="width:44%">
                        <div class="card-body text-center">
                            <div>
                                <h2>Welcome to Upsense</h2>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua.</p>
                                {{--                  @if (Route::has('password.request'))--}}
                                {{--                    <a href="{{ route('register') }}" class="btn btn-primary active mt-3">{{ __('Register') }}</a>--}}
                                {{--                  @endif--}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

@endsection

@section('javascript')
    <!-- <script src="{{ asset('js/jquery.min.js') }}"></script>
    <script src="{{ asset('js/axios.min.js') }}"></script>

    <script>
        $("#btn-login").on("click", function () {
            axios.post('http://240be64a4489.ngrok.io/v1/auth/login', {}, {
                auth: {
                    username: "admin",
                    password: "admin"
                }
            }).then(function (response) {
                console.log(response);
                // window.location = "/";

            }).catch(function (error) {
                console.error('Error on Authentication');
            });
        });

    </script> -->
@endsection
