<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Icons-->
    <link href="{{ asset('css/free.min.css') }}" rel="stylesheet">
    <!-- icons -->
    <link href="{{ asset('css/style.css') }}" rel="stylesheet">
    @yield('css')
</head>

<body class="c-app">
<div class="col-lg-12">
    <main>
        @yield('modal.content')
    </main>
</div>

<script src="{{ asset('js/coreui.bundle.min.js') }}"></script>
<script src="{{ asset('js/coreui-utils.js') }}"></script>
<script src="{{ asset('js/jquery.min.js') }}"></script>
<script src="{{ asset('js/axios.min.js') }}"></script>

@yield('modal.javascript')
</body>
</html>
