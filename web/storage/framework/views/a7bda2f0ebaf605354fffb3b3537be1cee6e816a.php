<?php $__env->startSection('content'); ?>
    <div class="container-fluid">
        <div class="animated fadeIn">
            <div class="row">
                <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <?php if(Session::has('message')): ?>
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="alert alert-success" role="alert"><?php echo e(Session::get('message')); ?></div>
                            </div>
                        </div>
                    <?php endif; ?>
                    <div class="card">
                        <div class="card-header">
                            <h4><i class="cil-user"></i> <?php echo e(__('Users')); ?></h4>
                        </div>
                        <div class="card-body">
                            <div class="col-lg-12 col-md-12">
                                <ul class="nav nav-tabs" id="myTab" role="tablist">

                                    <?php if(session('user')->role == 'manager' || session('user')->role == 'admin'): ?>
                                        <li class="nav-item">
                                            <a class="nav-link active" id="user-tab" data-toggle="tab" href="#user"
                                               role="tab" aria-controls="home" aria-selected="true">Staffs</a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link" id="manager-tab" data-toggle="tab" href="#manager"
                                               role="tab" aria-controls="profile" aria-selected="false">Managers</a>
                                        </li>
                                    <?php endif; ?>

                                    <?php if(session('user')->role == 'admin'): ?>
                                        <li class="nav-item">
                                            <a class="nav-link" id="admin-tab" data-toggle="tab" href="#admin"
                                               role="tab"
                                               aria-controls="contact" aria-selected="false">Admins</a>
                                        </li>
                                    <?php endif; ?>
                                </ul>

                                <div class="tab-content" id="tabContent">
                                    <?php $__currentLoopData = $ROLES; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $role): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                        <div class="tab-pane fade show <?php echo e($role == 'user'? 'active' : ''); ?>"
                                             id="<?php echo e($role); ?>" role="tabpanel" aria-labelledby="<?php echo e($role); ?>-tab">
                                            <div class="col-sm-12 col-md-12 col-lg-12">
                                                <div class="table-responsive" style="margin-top: 20px;">
                                                    <?php echo $__env->make('dashboard.user._table', ['role' => $role], \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                                                </div>
                                                <button type="button" class="btn btn-primary" data-toggle="modal"
                                                        data-href="<?php echo e(route('users.create')); ?>?role=<?php echo e($role); ?>"
                                                        data-target="#create<?php echo e($role); ?>Modal" data-role="<?php echo e($role); ?>">
                                                    <i class="cil-plus"></i> Create <?php echo e($role == 'user'? 'Staff' : ucfirst($role)); ?>

                                                </button>
                                            </div>

                                            <div class="modal fade" id="create<?php echo e($role); ?>Modal" tabindex="-1"
                                                 role="dialog" aria-labelledby="create<?php echo e($role); ?>ModalLabel"
                                                 aria-hidden="true">
                                                <div class="modal-dialog modal-lg" role="document">
                                                    <div class="modal-content">
                                                        <div class="modal-header">
                                                            <h5 class="modal-title">Create <?php echo e($role); ?></h5>
                                                            <button type="button" class="close" data-dismiss="modal"
                                                                    aria-label="Close">
                                                                <span aria-hidden="true">&times;</span>
                                                            </button>
                                                        </div>
                                                        <div class="modal-body">
                                                            <?php echo $__env->make('dashboard.user.create', ['role' => $role], \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="modal fade" id="show<?php echo e($role); ?>Modal" tabindex="-1"
                                                 role="dialog" aria-labelledby="show<?php echo e($role); ?>ModalLabel"
                                                 aria-hidden="true">
                                                <div class="modal-dialog modal-md" role="document">
                                                    <div class="modal-content">
                                                        <div class="modal-header">
                                                            <h5 class="modal-title">View <?php echo e(ucfirst($role)); ?></h5>
                                                            <button type="button" class="close" data-dismiss="modal"
                                                                    aria-label="Close">
                                                                <span aria-hidden="true">&times;</span>
                                                            </button>
                                                        </div>
                                                        <div class="modal-body">
                                                            <?php echo $__env->make('dashboard.user.show', ['role' => $role], \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="modal fade" id="edit<?php echo e($role); ?>Modal" tabindex="-1"
                                                 role="dialog" aria-labelledby="edit<?php echo e($role); ?>ModalLabel"
                                                 aria-hidden="true">
                                                <div class="modal-dialog modal-lg" role="document">
                                                    <div class="modal-content">
                                                        <div class="modal-header">
                                                            <h5 class="modal-title">Edit <?php echo e(ucfirst($role)); ?></h5>
                                                            <button type="button" class="close" data-dismiss="modal"
                                                                    aria-label="Close">
                                                                <span aria-hidden="true">&times;</span>
                                                            </button>
                                                        </div>
                                                        <div class="modal-body">
                                                            <?php echo $__env->make('dashboard.user.edit', ['role' => $role], \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('javascript'); ?>

    <script>
        $(document).ready(function () {
            let roles = [
                'users',
                'managers',
                'admins'
            ];

            for (i = 0, len = roles.length, text = ""; i < len; i++) {
                let r = roles[i];
                getData(roles[i]);

                // // call create user modal
                // $('#show' + roles[i].slice(0, -1) + 'Modal').on('show.coreui.modal', function (event) {
                //     // var button = $(event.relatedTarget) // Button that triggered the modal
                //     // var role = button.data('role') // Extract info from data-* attributes
                //     //
                //     //
                //     // var modal = $(this)
                // });
            }
        });

        function getData(role) {
            let query = {"relations": ["company", "zones"]};
            query = encodeURI(JSON.stringify(query));
            api.get('/' + role + '?query=' + query).then((res) => {
                role = role.slice(0, -1)
                let uTable = $("#" + role + "-table").DataTable();
                uTable.clear().draw();

                $.each(res.data.result, function () {
                    let dt = $(this)[0];
                    let zonelist = '';
                    if (typeof dt === 'undefined') return false;
                    if (dt.zones !== 'undefined') {
                        $.each(dt.zones, function(i, e) {
                           zonelist += e.name + ' ';
                        });
                    }
                    let newData = [
                        // '<div class="c-avatar">' +
                        // '    <img class="c-avatar-img c-avatar"' +
                        // '         src="/assets/img/avatars/' + dt.image + '"' +
                        // '    />' +
                        // '</div>',
                        dt.firstName,
                        dt.lastName,
                        dt.mobile,
                        dt.email,
                        zonelist? zonelist : 'N/A',
                        typeof dt.company !== 'undefined' ? dt.company.name : 'N/A',
                        moment.unix(dt.createdAt).format('YYYY-MM-DD HH:mm:ss'),
                        moment.unix(dt.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
                        '<a href="/users/' + dt.id + '"\n' +
                        '   class="btn inline-block btn-primary"\n' +
                        '   data-toggle="modal"\n' +
                        '   data-target="#show' + role + 'Modal" ' +
                        '   data-role="' + role + '"\n' +
                        '   data-id="' + dt.id + '">\n' +
                        '   <i class="cil-magnifying-glass"></i>\n' +
                        '</a>\n' +
                        '<a href="/users/' + dt.id + '/edit"\n' +
                        '   class="btn inline-block btn-primary"\n' +
                        '   data-toggle="modal"\n' +
                        '   data-id="' + dt.id + '"\n' +
                        '   data-target="#edit' + role + 'Modal" data-role="' + role + '">\n' +
                        '   <i class="cil-pencil"></i>\n' +
                        '</a>' +
                        '<button class="btn btn-danger" style="margin-left: 4px;" onclick="deleteUser(' + dt.id + ',`' + role + 's`)">\n' +
                        '    <i class="cil-trash"></i>\n' +
                        '</button>\n'
                    ];
                    uTable.row.add(newData);

                });

                uTable.draw();
            }).catch((error) => {
                console.error(error)
            });
        }

        function deleteUser(id, role) {
            let confirmDelete = confirm('Are you sure you want to delete?');

            if (confirmDelete) {
                api.delete("/" + role + "/" + id).then((res) => {
                    getData(role);
                    showAlert(role + ' has been deleted.', 'success')
                }).catch((error) => {
                    console.error(error)
                });
            }
        }
    </script>
<?php $__env->stopSection(); ?>


<?php echo $__env->make('dashboard.base', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/dashboard/user/index.blade.php ENDPATH**/ ?>