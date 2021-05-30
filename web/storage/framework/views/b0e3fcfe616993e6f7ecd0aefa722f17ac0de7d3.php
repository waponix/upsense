<div class="c-sidebar-brand">
    <img class="c-sidebar-brand-full" src="<?php echo e(url('/assets/brand/logo.png')); ?>" height="42" alt="Upsense">
    <img class="c-sidebar-brand-minimized" src="<?php echo e(url('assets/brand/minimized_logo.png')); ?>" height="46" alt="Upsense">
</div>
<ul class="c-sidebar-nav ps">
    <li class="c-sidebar-nav-item">
        <a class="c-sidebar-nav-link" href="<?php echo e(route('dashboard.home.index')); ?>">
            <i class="cil-speedometer c-sidebar-nav-icon"></i>
            <?php echo e(__('Dashboard')); ?>

        </a>
    </li>
    <?php if(session('user')->role == 'manager' || session('user')->role == 'admin'): ?>
        <li class="c-sidebar-nav-title">
            <?php echo e(__('Management')); ?>

        </li>
        <li class="c-sidebar-nav-dropdown"><a class="c-sidebar-nav-dropdown-toggle" href="#"><i
                    class="cil-settings c-sidebar-nav-icon"></i><?php echo e(__('Maintenance')); ?></a>
            <ul class="c-sidebar-nav-dropdown-items">

                <li class="c-sidebar-nav-item"><a class="c-sidebar-nav-link" href="<?php echo e(route('users.index')); ?>"><span
                            class="c-sidebar-nav-icon"></span><?php echo e(__('Users')); ?></a></li>
                
                
                <?php if(session('user')->role == 'admin'): ?>

                    <li class="c-sidebar-nav-item"><a class="c-sidebar-nav-link" href="<?php echo e(route('zones.index')); ?>"><span
                                class="c-sidebar-nav-icon"></span><?php echo e(__('Zones')); ?></a></li>
                    <li class="c-sidebar-nav-item"><a class="c-sidebar-nav-link"
                                                      href="<?php echo e(route('company.index')); ?>"><span
                                class="c-sidebar-nav-icon"></span><?php echo e(__('Company')); ?></a></li>

                <?php endif; ?>
            </ul>
        </li>
    <?php endif; ?>


    
    <li class="c-sidebar-nav-item">
        <a class="c-sidebar-nav-link" href="<?php echo e(route('hubs.index')); ?>">
            <i class="cil-tablet c-sidebar-nav-icon"></i>
            <?php echo e(__('Hubs')); ?>

        </a>
    </li>
    <li class="c-sidebar-nav-item">
        <a class="c-sidebar-nav-link" href="<?php echo e(route('sensors.index')); ?>">
            <i class="cil-blur-circular c-sidebar-nav-icon"></i>
            <?php echo e(__('Sensors')); ?>

        </a>
    </li>
    <li class="c-sidebar-nav-item">
        <a class="c-sidebar-nav-link" href="#">
            <i class="cil-chart-pie c-sidebar-nav-icon"></i>
            <?php echo e(__('Reports')); ?>

        </a>
    </li>
    <li class="c-sidebar-nav-item">
        <a class="c-sidebar-nav-link" href="#">
            <i class="cil-book c-sidebar-nav-icon"></i>
            <?php echo e(__('Logs')); ?>

        </a>
    </li>
    
    <?php if(session('user')->role == 'admin'): ?>
        <li class="c-sidebar-nav-dropdown"><a class="c-sidebar-nav-dropdown-toggle" href="#"><i
                    class="cil-calculator c-sidebar-nav-icon"></i><?php echo e(__('Settings')); ?></a>
            <ul class="c-sidebar-nav-dropdown-items">
                <li class="c-sidebar-nav-item"><a class="c-sidebar-nav-link"
                                                  href="//192.168.0.111:3000/settings/notifications"><span
                            class="c-sidebar-nav-icon"></span><?php echo e(__('Notifications')); ?></a></li>
            </ul>
        </li>
    <?php endif; ?>
    <div class="ps__rail-x" style="left: 0px; bottom: 0px;">
        <div class="ps__thumb-x" tabindex="0" style="left: 0px; width: 0px;"></div>
    </div>
    <div class="ps__rail-y" style="top: 0px; right: 0px;">
        <div class="ps__thumb-y" tabindex="0" style="top: 0px; height: 0px;"></div>
    </div>
</ul>
<button class="c-sidebar-minimizer c-class-toggler" type="button" data-target="_parent"
        data-class="c-sidebar-minimized"></button>

</div>
<?php /**PATH /home/kevin/upsense/web/resources/views/dashboard/shared/nav-left.blade.php ENDPATH**/ ?>