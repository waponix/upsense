<?php $__env->startSection('content'); ?>

        <div class="container-fluid">
          <div class="animated fadeIn">
            <div class="row">
              <div class="col-sm-6 col-md-5 col-lg-4 col-xl-3">
                <div class="card">
                    <div class="card-header">
                      <i class="fa fa-align-justify"></i> <?php echo e(__('Create User')); ?></div>
                    <div class="card-body">
                        <br>
                        <form method="POST" action="<?php echo e(route('users.store')); ?>">
                            <?php echo csrf_field(); ?>
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">
                                      <svg class="c-icon c-icon-sm">
                                          <use xlink:href="/assets/icons/coreui/free-symbol-defs.svg#cui-user"></use>
                                      </svg>
                                    </span>
                                </div>
                                <input class="form-control" type="text" placeholder="<?php echo e(__('First Name')); ?>" name="first_name" value="" required autofocus>
                            </div>
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">
                                      <svg class="c-icon c-icon-sm">
                                          <use xlink:href="/assets/icons/coreui/free-symbol-defs.svg#cui-user"></use>
                                      </svg>
                                    </span>
                                </div>
                                <input class="form-control" type="text" placeholder="<?php echo e(__('Last Name')); ?>" name="last_name" value="" required>
                            </div>
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">@</span>
                                </div>
                                <input class="form-control" type="email" placeholder="<?php echo e(__('E-Mail Address')); ?>" name="email" value="" required>
                            </div>
                            <button class="btn btn-block btn-success" type="submit"><?php echo e(__('Save')); ?></button>
                            <a href="<?php echo e(route('users.index')); ?>" class="btn btn-block btn-primary"><?php echo e(__('Return')); ?></a>
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

<?php echo $__env->make('dashboard.base', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /mnt/d/Personal/Projects/upsense/resources/views/dashboard/admin/create.blade.php ENDPATH**/ ?>