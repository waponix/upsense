<?php $__env->startSection('content'); ?>

    <div class="container-fluid">
        <div class="animated fadeIn">
            <div class="row">
                <div class="col-sm-12 col-md-10 col-lg-8 col-xl-6">
                    <div class="card">
                        <div class="card-header">
                            <i class="fa fa-align-justify"></i> <?php echo e(__('Edit')); ?> <?php echo e($user->username); ?></div>
                        <div class="card-body">
                            <br>
                            <form method="POST" action="/users/<?php echo e($user->id); ?>">
                                <?php echo csrf_field(); ?>
                                <?php echo method_field('PUT'); ?>
                                <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                    <span class="input-group-text">
                                      <svg class="c-icon c-icon-sm">
                                          <use xlink:href="/assets/icons/coreui/free-symbol-defs.svg#cui-user"></use>
                                      </svg>
                                    </span>
                                    </div>
                                    <input class="form-control" type="text" placeholder="<?php echo e(__('First Name')); ?>"
                                           name="first_name" value="<?php echo e($user->first_name); ?>" required autofocus>
                                </div>
                                <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">
                                                      <svg class="c-icon c-icon-sm">
                                          <use xlink:href="/assets/icons/coreui/free-symbol-defs.svg#cui-user"></use>
                                      </svg>
                                        </span>
                                    </div>
                                    <input class="form-control" type="text" placeholder="<?php echo e(__('Last Name')); ?>"
                                           name="last_name" value="<?php echo e($user->last_name); ?>">
                                </div>
                                <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">@</span>
                                    </div>
                                    <input class="form-control" type="email" placeholder="<?php echo e(__('E-Mail Address')); ?>"
                                           name="email" value="<?php echo e($user->email); ?>" required>
                                </div>
                                <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">          <svg class="c-icon c-icon-sm">
                                          <use xlink:href="/assets/icons/coreui/free-symbol-defs.svg#cui-mobile"></use>
                                      </svg></span>
                                    </div>
                                    <input class="form-control" type="text" placeholder="<?php echo e(__('Mobile')); ?>"
                                           name="mobile" value="<?php echo e($user->mobile); ?>" required>
                                </div>
                                <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">          <svg class="c-icon c-icon-sm">
                                          <use xlink:href="/assets/icons/coreui/free-symbol-defs.svg#cui-user"></use>
                                      </svg></span>
                                    </div>
                                    <input class="form-control" type="text" placeholder="<?php echo e(__('Roles')); ?>"
                                           name="menuroles" value="<?php echo e($user->menuroles); ?>" required>
                                </div>
                                <button class="btn btn-block btn-success" type="submit"><?php echo e(__('Save')); ?></button>
                                <a href="<?php echo e(route('users.index')); ?>"
                                   class="btn btn-block btn-primary"><?php echo e(__('Return')); ?></a>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

<?php $__env->stopSection(); ?>

<?php $__env->startSection('javascript'); ?>

<?php $__env->stopSection(); ?>

<?php echo $__env->make('dashboard.base', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /mnt/d/Personal/Projects/upsense/resources/views/dashboard/admin/edit.blade.php ENDPATH**/ ?>