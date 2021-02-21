<?php $__env->startSection('content'); ?>

        <div class="container-fluid">
          <div class="animated fadeIn">
            <div class="row">
              <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <div class="card">
                    <div class="card-header">
                      <i class="fa fa-align-justify"></i><?php echo e(__('Notes')); ?></div>
                    <div class="card-body">
                        <div class="row"> 
                          <a href="<?php echo e(route('notes.create')); ?>" class="btn btn-primary m-2"><?php echo e(__('Add Note')); ?></a>
                        </div>
                        <br>
                        <table class="table table-responsive-sm table-striped">
                        <thead>
                          <tr>
                            <th>Author</th>
                            <th>Title</th>
                            <th>Content</th>
                            <th>Applies to date</th>
                            <th>Status</th>
                            <th>Note type</th>
                            <th></th>
                            <th></th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          <?php $__currentLoopData = $notes; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $note): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <tr>
                              <td><strong><?php echo e($note->user->name); ?></strong></td>
                              <td><strong><?php echo e($note->title); ?></strong></td>
                              <td><?php echo e($note->content); ?></td>
                              <td><?php echo e($note->applies_to_date); ?></td>
                              <td>
                                  <span class="<?php echo e($note->status->class); ?>">
                                      <?php echo e($note->status->name); ?>

                                  </span>
                              </td>
                              <td><strong><?php echo e($note->note_type); ?></strong></td>
                              <td>
                                <a href="<?php echo e(url('/notes/' . $note->id)); ?>" class="btn btn-block btn-primary">View</a>
                              </td>
                              <td>
                                <a href="<?php echo e(url('/notes/' . $note->id . '/edit')); ?>" class="btn btn-block btn-primary">Edit</a>
                              </td>
                              <td>
                                <form action="<?php echo e(route('notes.destroy', $note->id )); ?>" method="POST">
                                    <?php echo method_field('DELETE'); ?>
                                    <?php echo csrf_field(); ?>
                                    <button class="btn btn-block btn-danger">Delete</button>
                                </form>
                              </td>
                            </tr>
                          <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                        </tbody>
                      </table>
                      <?php echo e($notes->links()); ?>

                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>

<?php $__env->stopSection(); ?>


<?php $__env->startSection('javascript'); ?>

<?php $__env->stopSection(); ?>


<?php echo $__env->make('dashboard.base', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /mnt/d/Personal/Projects/upsense/resources/views/dashboard/hub/index.blade.php ENDPATH**/ ?>