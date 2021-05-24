<!DOCTYPE html>
<html lang="en">
<head>
    <base href="./">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
    <meta name="description" content="Upsense">
    <meta name="author" content="Upsense">
    <title>Upsense</title>
    <link rel="apple-touch-icon" sizes="57x57" href="assets/favicon/apple-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="60x60" href="assets/favicon/apple-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="72x72" href="assets/favicon/apple-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="76x76" href="assets/favicon/apple-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="114x114" href="assets/favicon/apple-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="120x120" href="assets/favicon/apple-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="assets/favicon/apple-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="assets/favicon/apple-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="assets/favicon/apple-icon-180x180.png">
    <link rel="icon" type="image/png" sizes="192x192" href="assets/favicon/android-icon-192x192.png">
    <link rel="icon" type="image/png" sizes="32x32" href="assets/favicon/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="96x96" href="assets/favicon/favicon-96x96.png">
    <link rel="icon" type="image/png" sizes="16x16" href="assets/favicon/favicon-16x16.png">
    <link rel="manifest" href="assets/favicon/manifest.json">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="msapplication-TileImage" content="assets/favicon/ms-icon-144x144.png">
    <meta name="theme-color" content="#ffffff">
    <!-- Icons-->
    <link href="<?php echo e(asset('css/free.min.css')); ?>" rel="stylesheet"> <!-- icons -->
    <link href="<?php echo e(asset('css/style.css')); ?>" rel="stylesheet">
    <link href="<?php echo e(asset('css/coreui-chartjs.css')); ?>" rel="stylesheet">
    <link href="<?php echo e(asset('css/jquery.dataTables.css')); ?>" rel="stylesheet">
    <?php echo $__env->yieldContent('css'); ?>
    <script src="<?php echo e(asset('js/jquery.min.js')); ?>"></script>

    <script>

        function showAlert(msg, type) {
            let alertHtml = '<div id="alert-flash" class="alert alert-' + type + ' alert-dismissible fade show" role="alert">\n' +
                '                    <strong>' + type.toUpperCase() + '! </strong> <span id="alert-msg">' + msg + '</span>\n' +
                '                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">\n' +
                '                        <span aria-hidden="true">&times;</span>\n' +
                '                    </button>\n' +
                '                </div>';

            $('#alert-flash').append(alertHtml);
        }
    </script>
</head>

<body class="c-app">
<div class="c-sidebar c-sidebar-dark c-sidebar-fixed c-sidebar-lg-show" id="sidebar">
    <?php echo $__env->make('dashboard.shared.nav-left', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
    
    <?php echo $__env->make('dashboard.shared.header', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>

    <div class="c-body">
        <main class="c-main">

            <div class="col-lg-12" id="alert-container">

            </div>
            <?php echo $__env->yieldContent('content'); ?>
        </main>
        <?php echo $__env->make('dashboard.shared.footer', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
    </div>
</div>

<script src="<?php echo e(asset('js/coreui.bundle.min.js')); ?>"></script>
<script src="<?php echo e(asset('js/coreui-utils.js')); ?>"></script>
<script src="<?php echo e(asset('js/axios.min.js')); ?>"></script>
<script src="<?php echo e(asset('js/jquery.dataTables.js')); ?>"></script>
<script src="<?php echo e(asset('js/moment.min.js')); ?>"></script>

<script>
    $(document).ready(function () {
        $('.data-table').DataTable();
    });
    function showAlert(msg, type) {
        let alertHtml = '<div id="alert-flash" class="alert alert-' + type + ' alert-dismissible fade show" role="alert">\n' +
            '                    <strong>' + type.toUpperCase() + '! </strong> <span id="alert-msg">' + msg + '</span>\n' +
            '                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">\n' +
            '                        <span aria-hidden="true">&times;</span>\n' +
            '                    </button>\n' +
            '                </div>';

        $('#alert-flash').append(alertHtml);
    }

</script>

<script>
    // Example starter JavaScript for disabling form submissions if there are invalid fields
    (function () {
        'use strict';
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.querySelectorAll('.needs-validation');

        // Loop over them and prevent submission
        Array.prototype.slice.call(forms)
            .forEach(function (form) {
                form.addEventListener('submit', function (event) {
                    if (!form.checkValidity()) {
                        event.preventDefault();
                        event.stopPropagation();
                    }

                    form.classList.add('was-validated');
                }, false);
            });
    })();
</script>

<script>
    'use strict';
    let api = axios.create({
        baseURL: "<?php echo e($JWT_ISSUER); ?>",
        timeout: 3000,
        headers: {
            'Authorization': 'Bearer  `<?php echo e(session('accessToken')); ?>`',
            'Content-Type': 'application/json',
            'accept': 'application/json'
        }
    });

    const token = "<?php echo e(session('accessToken')); ?>";

    api.interceptors.request.use(function (config) {
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config;
    }, function (error) {
        Promise.reject(error);
    });

    api.interceptors.response.use(function (response) {
        return response;
    }, function (error) {
        var originalRequest = error.config;
        if (typeof error !== 'undefined' && typeof error.response !== 'undefined' &&
            error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            refreshToken();

            api.defaults.headers.common['Authorization'] = `Bearer "<?php echo e(session('accessToken')); ?>"`;
            return api(originalRequest);
        }

        return Promise.reject(error);
    });


    function refreshToken() {

        console.log("<?php echo e(session('refreshToken')); ?>")
        api.post('/auth/refresh', {
            headers: {
                'Authorization': `Bearer "<?php echo e(session('refreshToken')); ?>"`
            }
        }).then((response) => {
            if (response.resultCode === 0) {
                console.log(response)
                alert()
                // axios.post('/refreshToken', {
                //     headers: {
                //         'Authorization': `Bearer ${refreshToken}`
                //     }
                // }).then((response) => {
                //     console.log(response);
                // });
                // window.reload();

            } else {
                window.location.href = "/login";
            }
        }, (error) => {
            window.location.href = "/login";
            console.error(error);
        });
    }



    
    
    
    
    
    
    
    
    

    
    
    
    

    
    
    
    
    

    
    
    
    

    
    

    
    
    

    
    
    
    
    
    
    
    
    
    

    
    
    
    
    

    
    
    
    
    
    
    
    
    
    
    
    
    
    


    
    
    
    

</script>
<?php echo $__env->yieldContent('javascript'); ?>
</body>
</html>
<?php /**PATH /var/www/html/resources/views/dashboard/base.blade.php ENDPATH**/ ?>