<?php $__env->startSection('content'); ?>

    <div class="container-fluid">
        <div class="animated fadeIn">
            <div class="row">
                <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">

                    <?php if(Session::has('message')): ?>
                        <div class="row">
                            <div class="col-12">
                                <div class="alert alert-success" role="alert"><?php echo e(Session::get('message')); ?></div>
                            </div>
                        </div>
                    <?php endif; ?>
                    <div class="card">
                        <div class="card-header">
                            <h4><i class="fa fa-align-justify"></i><?php echo e(__('Users')); ?></h4>
                        </div>
                        <div class="card-body">
                            <div class="col-lg-12 col-md-12">
                                <a class="btn btn-md btn-primary" href="<?php echo e(route('users.create')); ?>">Add User</a>

                                <table class="table table-responsive table-striped">
                                    <thead>
                                    <tr>
                                        <th>Username</th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Mobile</th>
                                        <th>E-mail</th>
                                        <th>Roles</th>
                                        <th>Created at</th>
                                        <th>Updated at</th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <?php $__currentLoopData = $users; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $user): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                        <tr>
                                            <td><?php echo e($user->username); ?></td>
                                            <td><?php echo e($user->first_name); ?></td>
                                            <td><?php echo e($user->last_name); ?></td>
                                            <td><?php echo e($user->mobile); ?></td>
                                            <td><?php echo e($user->email); ?></td>
                                            <td><?php echo e($user->menuroles); ?></td>
                                            <td><?php echo e($user->created_at); ?></td>
                                            <td><?php echo e($user->updated_at); ?></td>
                                            <td>
                                                <a href="<?php echo e(url('/users/' . $user->id)); ?>"
                                                   class="btn btn-block btn-primary">View</a>
                                            </td>
                                            <td>
                                                <a href="<?php echo e(url('/users/' . $user->id . '/edit')); ?>"
                                                   class="btn btn-block btn-primary">Edit</a>
                                            </td>
                                            <td>
                                                <?php if($me->id !== $user->id ): ?>
                                                    <form action="<?php echo e(route('users.destroy', $user->id )); ?>"
                                                          method="POST">
                                                        <?php echo method_field('DELETE'); ?>
                                                        <?php echo csrf_field(); ?>
                                                        <button class="btn btn-block btn-danger">Delete</button>
                                                    </form>
                                                <?php endif; ?>
                                            </td>
                                        </tr>
                                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

<?php $__env->stopSection(); ?>


<?php $__env->startSection('javascript'); ?>

<?php $__env->stopSection(); ?>


<?php echo $__env->make('dashboard.base', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /mnt/d/Personal/Projects/upsense/resources/views/dashboard/admin/index.blade.php ENDPATH**/ ?>