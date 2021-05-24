<div class="container">
    <div class="row justify-content-md-center">
        <div class="col col-md-12 col-lg-12">
            <div class="animated fadeIn">
                <form id="edit<?php echo e($role); ?>Form" autocomplete="off" method="POST" class="needs-validation"
                    novalidate>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text">
                                <svg class="c-icon c-icon-sm">
                                    <use xlink:href="/assets/icons/coreui/free-symbol-defs.svg#cui-user"></use>
                                </svg>
                            </span>
                        </div>
                        <input class="form-control" type="text" placeholder="<?php echo e(__('First Name')); ?>" id="firstName"
                            name="firstName" value="" required>
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
                        <input class="form-control" type="text" placeholder="<?php echo e(__('Last Name')); ?>" id="lastName"
                            name="lastName" value="" required>
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
                        <input class="form-control" type="text" placeholder="<?php echo e(__('Mobile')); ?>" id="mobile"
                            name="mobile" value="" required>
                        <div class="invalid-feedback">
                            Please provide a valid mobile number.
                        </div>
                    </div>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text">@</span>
                        </div>
                        <input class="form-control" type="email" placeholder="<?php echo e(__('E-Mail Address')); ?>" id="email"
                            name="email" value="" required>
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
                                <select multiple class="form-control" id="zones" name="zones[]" required>
                                </select>
                                <div class="invalid-feedback">
                                    Zone is required.
                                </div>
                            </div>
                        </div>
                    <?php endif; ?>
                    <button id="edit<?php echo e($role); ?>Button" class="btn btn-block btn-success"
                        type="submit"><?php echo e(__('Save')); ?></button>
                    <a class="btn btn-block btn-secondary" data-dismiss="modal"><?php echo e(__('Return')); ?></a>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
    $(document).ready(function() {
        let editForm = "edit<?php echo e($role); ?>Form";

        $('#edit<?php echo e($role); ?>Modal').on('show.coreui.modal', function(event) {
            var button = $(event.relatedTarget) // Button that triggered the modal
            var id = button.data('id') // Extract info from data-* attributes
            let modal = $(this)

            api.get('/companies/').then((res) => {
                let options = '<option>- select company -</option>';
                $.each(res.data.result, function() {
                    options += '<option value="' + $(this)[0].id + '">' + $(this)[0]
                        .name + '</option>';
                });
                $("#" + editForm).find('[name="company"]').html(options).trigger("change");
            }).catch((error) => {
                console.error(error)
            });

            api.get('/<?php echo e($role); ?>s/' + id, {
                "query": {
                    "relations": ["company", "zones"]
                },
            }).then((res) => {
                let dt = res.data.result;
                modal.find("#image").val("src", '/assets/img/avatars/' + dt.image);
                modal.find("#firstName").val(dt.firstName);
                modal.find("#lastName").val(dt.lastName);
                modal.find("#mobile").val(dt.mobile);
                modal.find("#email").val(dt.email);

                if ("<?php echo e($role); ?>" != "admin") {
                    $.each(dt.zones, function(i, e) {
                        console.log(e.id)
                        modal.find("#zones option[value='" + e.id + "']").prop(
                            "selected", true);
                    });
                    modal.find("#company").val(dt.company.id);
                }
            }).catch((error) => {
                console.error(error)
            });


            $("#" + editForm).on("submit", function(e) {
                e.preventDefault();
                e.stopPropagation();
                api.put('/<?php echo e($role); ?>s/' + id, {
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
                            showAlert('Successfully added user', 'success');
                            $("#edit<?php echo e($role); ?>Modal").modal('hide');
                            $('.needs-validation').removeClass('was-validated');
                            $("#" + editForm).find('input:text, input:password, select')
                                .each(function() {
                                    $(this).val('');
                                });
                        }
                    }, (error) => {
                        $.each(error.response.data.error, function(i, v) {
                            // $('.needs-validation').removeClass('was-validated');
                            $("#" + i).addClass('is-invalid').next().text(v)
                        });
                        // error.response.data.error
                    });
            });
        });
        $("#" + editForm).find('[name="company"]').on("change", function() {
            let query = {
                "relations": ["users"]
            };
            query = encodeURI(JSON.stringify(query));
            console.log(query)
            api.get('/companies/' + $(this).val() + '/zones?query=' + query).then((res) => {
                let options = '';
                $.each(res.data.result, function() {
                    options += '<option value="' + $(this)[0].id + '">' + $(this)[0]
                        .name + '</option>';
                })
                $("#" + editForm).find('[name="zones[]"]').html(options);
            }).catch((error) => {
                console.error(error)
            })
        })
    });

</script>
<?php /**PATH /var/www/html/resources/views/dashboard/user/edit.blade.php ENDPATH**/ ?>