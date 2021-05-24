<?php $__env->startSection('content'); ?>

    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card-group">
                    <div class="card p-4">
                        <div class="card-body">
                            <h1>Login</h1>
                            <?php echo e($JWT_ISSUER); ?>

                            <p class="text-muted">Sign In to your account </p>
                            <form method="POST" action="<?php echo e(route('login')); ?>">
                                <?php echo csrf_field(); ?>
                                <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                      <span class="input-group-text">
                                        <svg class="c-icon">
                                          <use xlink:href="assets/icons/coreui/free-symbol-defs.svg#cui-user"></use>
                                        </svg>
                                      </span>
                                    </div>
                                    <input class="form-control" type="text" placeholder="<?php echo e(__('E-Mail Address')); ?>"
                                           name="email" value="<?php echo e(old('email')); ?>" required autofocus>
                                </div>
                                <div class="input-group mb-4">
                                    <div class="input-group-prepend">
                                      <span class="input-group-text">
                                        <svg class="c-icon">
                                          <use xlink:href="assets/icons/coreui/free-symbol-defs.svg#cui-lock-locked"></use>
                                        </svg>
                                      </span>
                                    </div>
                                    <input class="form-control" type="password" placeholder="<?php echo e(__('Password')); ?>"
                                           name="password" required>
                                </div>
                                <?php if(Session::has('errors')): ?>
                                    <div class="row">
                                        <div class="col-12">
                                            <div class="alert alert-danger" role="alert"><?php echo e(trim(Session::get('errors'), '[""]')); ?></div>
                                        </div>
                                    </div>
                                <?php endif; ?>
                                <div class="row">
                                    <div class="col-6">
                                        <button class="btn btn-primary px-4" type="submit"><?php echo e(__('Login')); ?></button>
                                        

                                    </div>

                                    <div class="col-6 text-right">
                                        
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
                                
                                
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

<?php $__env->stopSection(); ?>

<?php $__env->startSection('javascript'); ?>
    <!-- <script src="<?php echo e(asset('js/jquery.min.js')); ?>"></script>
    <script src="<?php echo e(asset('js/axios.min.js')); ?>"></script>

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
<?php $__env->stopSection(); ?>

<?php echo $__env->make('dashboard.authBase', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/auth/login.blade.php ENDPATH**/ ?>