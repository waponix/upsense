<!DOCTYPE html>
<html lang="en">
<head>
    <base href="./">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
    <meta name="description" content="Upsense project">
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
    <?php echo $__env->yieldContent('css'); ?>
    <link href="<?php echo e(asset('css/coreui-chartjs.css')); ?>" rel="stylesheet">
</head>

<body class="c-app">
<div class="c-sidebar c-sidebar-dark c-sidebar-fixed c-sidebar-lg-show" id="sidebar">
    <?php echo $__env->make('dashboard.shared.nav-builder', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
    <?php echo $__env->make('dashboard.shared.header', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>

    <div class="c-body">
        <main class="c-main">
            <?php echo $__env->yieldContent('content'); ?>
        </main>
        <?php echo $__env->make('dashboard.shared.footer', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
    </div>
</div>

<script src="<?php echo e(asset('js/coreui.bundle.min.js')); ?>"></script>
<script src="<?php echo e(asset('js/coreui-utils.js')); ?>"></script>
<script src="<?php echo e(asset('js/jquery.min.js')); ?>"></script>
<?php echo $__env->yieldContent('javascript'); ?>
</body>
</html>
<?php /**PATH /mnt/d/Personal/Projects/upsense/resources/views/dashboard/base.blade.php ENDPATH**/ ?>