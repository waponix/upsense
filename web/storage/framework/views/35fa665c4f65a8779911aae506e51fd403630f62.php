<div class="container">
    <div class="row justify-content-md-center">
        <div class="col col-md-12 col-lg-12">
            <div class="animated fadeIn">
                <form id="createCompanyForm" method="POST" autocomplete="off" class="needs-validation" novalidate>
                    <div class="form-group">
                        <input class="form-control" type="text" placeholder="<?php echo e(__('Company Name')); ?>"
                               name="name"
                               required>
                    </div>

                    <button id="createCompanyButton" class="btn btn-block btn-success"
                            type="submit"><?php echo e(__('Save')); ?></button>
                    <a class="btn btn-block btn-secondary" data-dismiss="modal"><?php echo e(__('Return')); ?></a>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
    $("#createCompanyForm").on("submit", function (e) {
        e.preventDefault();
        e.stopPropagation();
        api.post('/companies', {
            data: {
                "name": $(this).find('[name="name"]').val(),
            }
        })
            .then((response) => {
                if (response.error) {
                    showAlert(response.error, 'error')
                } else {
                    getData();
                    showAlert('Successfully added company', 'success');
                    $("#createCompanyModal").modal('hide');
                    $('.needs-validation').removeClass('was-validated');
                    $("#createCompanyForm").find('input:text, input:password, select')
                        .each(function () {
                            $(this).val('');
                        });
                }
            }, (error) => {
                $.each(error.response.data.error, function (i, v) {
                    // $('.needs-validation').removeClass('was-validated');
                    $("#" + i).addClass('is-invalid').next().text(v)
                });

                // error.response.data.error
            });
    });
</script>
<?php /**PATH /var/www/html/resources/views/dashboard/company/create.blade.php ENDPATH**/ ?>