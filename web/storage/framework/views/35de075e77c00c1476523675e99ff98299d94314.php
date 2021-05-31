<div class="container">
    <div class="row justify-content-md-center">
        <div class="col col-md-12 col-lg-12">
            <div class="animated fadeIn">
                <form id="create<?php echo e($role); ?>Form" autocomplete="off" method="POST" class="needs-validation"
                    novalidate>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text">
                                <svg class="c-icon c-icon-sm">
                                    <use xlink:href="/assets/icons/coreui/free-symbol-defs.svg#cui-user"></use>
                                </svg>
                            </span>
                        </div>
                        <input class="form-control" type="text" placeholder="<?php echo e(__('First Name')); ?>" 
                          id="firstName"  name="firstName" value="" required>
                        <div class="invalid-feedback">
                            Please provide first name.
                        </div>
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
                        id="lastName"  name="lastName" value="" required>
                        <div class="invalid-feedback">
                            Please provide last name.
                        </div>
                    </div>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text">
                                <svg class="c-icon c-icon-sm">
                                    <use xlink:href="/assets/icons/coreui/free-symbol-defs.svg#cui-mobile"></use>
                                </svg>
                            </span>
                        </div>
                        <input class="form-control" type="text" placeholder="<?php echo e(__('Mobile')); ?>"
                        id="mobile"   name="mobile" value="" required>
                        <div class="invalid-feedback">
                            Please provide a valid mobile number.
                        </div>
                    </div>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text">@</span>
                        </div>
                        <input class="form-control" type="email" placeholder="<?php echo e(__('E-Mail Address')); ?>"
                        id="email"    name="email" value="" required>
                        <div class="invalid-feedback">
                            Please provide a valid email.
                        </div>
                    </div>
                    <?php if($role != 'admin'): ?>
                        <div class="form-group row">
                            <div class="col">
                                <label>Assign to company</label>
                                <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">
                                            <svg class="c-icon c-icon-sm">
                                                <use
                                                    xlink:href="/assets/icons/coreui/free-symbol-defs.svg#cui-building">
                                                </use>
                                            </svg>
                                        </span>
                                    </div>
                                    <select class="form-control" name="company" id="company" required>
                                    </select>
                                    <div class="invalid-feedback">
                                        Company is required.
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="form-group row">
                            <div class="col">
                                <label>Assign to Zones</label>
                                <select multiple class="form-control" name="zones[]" id="zones" required>
                                </select>
                                <div class="invalid-feedback">
                                    Zone is required.
                                </div>
                            </div>
                        </div>
                    <?php endif; ?>
                    <button id="create<?php echo e($role); ?>Button" class="btn btn-block btn-success"
                        type="submit"><?php echo e(__('Save')); ?></button>
                    <a class="btn btn-block btn-secondary" data-dismiss="modal"><?php echo e(__('Return')); ?></a>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
    $(document).ready(function() {
        let createForm = "create<?php echo e($role); ?>Form";
        $("#" + createForm).off("submit").on("submit", function(e) {
            e.preventDefault();
            e.stopPropagation();
            api.post('/<?php echo e($role); ?>s', {
                    data: {
                        "username": $(this).find('[name="email"]').val(),
                        "password": "admin",
                        "firstName": $(this).find('[name="firstName"]').val(),
                        "lastName": $(this).find('[name="lastName"]').val(),
                        "mobile": $(this).find('[name="mobile"]').val(),
                        "email": $(this).find('[name="email"]').val(),
                        "role": "<?php echo e($role); ?>",
                        "company": $(this).find('[name="company"]').val(),
                        "zones": $(this).find('[name="zones[]"]').val()
                    }
                })
                .then((response) => {
                    if (response.error) {
                        showAlert(response.error, 'error')
                    } else {
                        getData("<?php echo e($role); ?>s");
                        showAlert('User added', 'success');
                        $("#create<?php echo e($role); ?>Modal").modal('hide');
                        $('.needs-validation').removeClass('was-validated');
                        $("#" + createForm).find('input:text, input:password, select')
                            .each(function() {
                                $(this).val('');
                            });
                    }
                }, (error) => {
                    if (typeof error.response !== 'undefined') {
                        $.each(error.response.data.error, function(i, v) {
                            // $('.needs-validation').removeClass('was-validated');
                            $("#" + i).addClass('is-invalid').next().text(v)
                        });
                    }
                });
        });

        api.get('/companies/').then((res) => {
            let options = '<option value="0">- select company -</option>';
            $.each(res.data.result, function() {
                options += '<option value="' + $(this)[0].id + '">' + $(this)[0].name +
                    '</option>';
            });
            $("#" + createForm).find('[name="company"]').html(options).trigger("change");

        }).catch((error) => {
            console.error(error)
        });

        $("#" + createForm).find('[name="company"]').off("change").on("change", function() {
            let query = {
                "relations": ["users"]
            };
            query = encodeURI(JSON.stringify(query));

            if($(this).val() == 0) return false;

            api.get('/companies/' + $(this).val() + '/zones?query=' + query)
            .then((res) => {
                let options = '';
                $.each(res.data.result, function() {
                    options += '<option value="' + $(this)[0].id + '">' + $(this)[0]
                        .name + '</option>';
                })
                $("#" + createForm).find('[name="zones[]"]').html(options);
            }, (error) => {
                console.error(error)
            })
        })
    });

</script>
<?php /**PATH /home/kevin/upsense/web/resources/views/dashboard/user/create.blade.php ENDPATH**/ ?>