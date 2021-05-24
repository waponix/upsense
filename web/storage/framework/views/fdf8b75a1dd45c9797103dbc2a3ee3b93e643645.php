<div class="c-wrapper">
    <header class="c-header c-header-light c-header-fixed c-header-with-subheader">
        <button class="c-header-toggler c-class-toggler d-lg-none mr-auto" type="button" data-target="#sidebar"
                data-class="c-sidebar-show"><span class="c-header-toggler-icon"></span></button>
        <a class="c-header-brand d-sm-none" href="#">
            <img class="c-header-brand" src="<?php echo e(url('/assets/brand/logo.png')); ?>" width="97" height="46" alt="Upsense">
        </a>
        <button class="c-header-toggler c-class-toggler ml-3 d-md-down-none" type="button" data-target="#sidebar"
                data-class="c-sidebar-lg-show" responsive="true"><span class="c-header-toggler-icon"></span></button>
        <ul class="c-header-nav ml-auto mr-4">
            <li class="c-header-nav-item d-md-down-none mx-2">
                <a class="c-header-nav-link">
                    <svg class="c-icon">
                        <use xlink:href="<?php echo e(url('/icons/sprites/free.svg#cil-bell')); ?>"></use>
                    </svg>
                </a>
            </li>
            <li class="c-header-nav-item d-md-down-none mx-2">
                <a class="c-header-nav-link">
                    <svg class="c-icon">
                        <use xlink:href="<?php echo e(url('/icons/sprites/free.svg#cil-list-rich')); ?>"></use>
                    </svg>
                </a>
            </li>
            <li class="c-header-nav-item d-md-down-none mx-2">
                <a class="c-header-nav-link">
                    <svg class="c-icon">
                        <use xlink:href="<?php echo e(url('/icons/sprites/free.svg#cil-envelope-open')); ?>"></use>
                    </svg>
                </a>
            </li>

            <li class="c-header-nav-item dropdown">
                <a class="c-header-nav-link" data-toggle="dropdown" href="#" role="button" aria-haspopup="true"
                   aria-expanded="false">
                    <div class="c-avatar">
                        <?php if(session('user')->image): ?>
                            <img class="c-avatar-img" src="<?php echo e(url('/assets/img/avatars/' . session('user')->image)); ?>"
                                 alt="">
                        <?php else: ?>
                            <img class="c-avatar-img" src="<?php echo e(url('/assets/img/avatars/0.png')); ?>"
                                 alt="">
                        <?php endif; ?>
                    </div>
                </a>
                <div class="dropdown-menu dropdown-menu-right pt-0">
                    <div class="dropdown-header bg-light py-2"><strong>Account</strong></div>
                    <a class="dropdown-item" href="#">
                        <svg class="c-icon mr-2">
                            <use xlink:href="<?php echo e(url('/icons/sprites/free.svg#cil-bell')); ?>"></use>
                        </svg>
                        Updates<span class="badge badge-info ml-auto">42</span>
                    </a>

                    <div class="dropdown-header bg-light py-2"><strong>Settings</strong></div>
                    <a class="dropdown-item" href="<?php echo e(url('/profile')); ?>">
                        <svg class="c-icon mr-2">
                            <use xlink:href="<?php echo e(url('/icons/sprites/free.svg#cil-user')); ?>"></use>
                        </svg>
                        Profile
                    </a>
                    <a class="dropdown-item" href="#">
                        <svg class="c-icon mr-2">
                            <use xlink:href="<?php echo e(url('/icons/sprites/free.svg#cil-settings')); ?>"></use>
                        </svg>
                        Settings
                    </a>
                    <a class="dropdown-item" href="<?php echo e(route('logout')); ?>">
                        <svg class="c-icon mr-2">
                            <use xlink:href="<?php echo e(url('/icons/sprites/free.svg#cil-account-logout')); ?>"></use>
                        </svg>
                        <?php echo e(__('Logout')); ?>

                    </a>
                </div>
            </li>
        </ul>
        <div class="c-subheader px-3">
            <ol class="breadcrumb border-0 m-0">
                <li class="breadcrumb-item"><a href="/">Home</a></li>
                <?php $segments = ''; ?>
                <?php for($i = 1,$iMax = count(Request::segments()); $i <= $iMax; $i++): ?>
                    <?php $segments .= '/' . Request::segment($i); ?>
                    <?php if($i < count(Request::segments())): ?>
                        <li class="breadcrumb-item"><?php echo e(Request::segment($i)); ?></li>
                    <?php else: ?>
                        <li class="breadcrumb-item active"><?php echo e(Request::segment($i)); ?></li>
                    <?php endif; ?>
                <?php endfor; ?>
            </ol>
        </div>

    </header>
<?php /**PATH /var/www/html/resources/views/dashboard/shared/header.blade.php ENDPATH**/ ?>