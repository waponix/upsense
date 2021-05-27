<div class="container">
    <div class="row justify-content-md-center">
        <div class="col col-md-12 col-lg-12">
            <div class="animated fadeIn">
                <form id="editCompanyForm" autocomplete="off" method="POST" class="needs-validation" novalidate>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text">
                                <svg class="c-icon c-icon-sm">
                                    <use xlink:href="/assets/icons/coreui/free-symbol-defs.svg#cui-building"></use>
                                </svg>
                            </span>
                        </div>
                        <input class="form-control" type="text" placeholder="{{ __('Company Name') }}" id="name"
                            name="name" required>
                        <div class="invalid-feedback">
                            Please enter company name.
                        </div>
                    </div>

                    <button id="editCompanyButton" class="btn btn-block btn-success"
                        type="submit">{{ __('Save') }}</button>
                    <a class="btn btn-block btn-secondary" data-dismiss="modal">{{ __('Return') }}</a>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
    $(document).ready(function() {
        let editForm = "editCompanyForm";

        $('#editCompanyModal').on('show.coreui.modal', function(event) {
            var button = $(event.relatedTarget) // Button that triggered the modal
            var id = button.data('id') // Extract info from data-* attributes
            let modal = $(this)

            api.get('/companies/' + id).then((res) => {
                let dt = res.data.result;
                modal.find("#name").val(dt.name);

            }).catch((error) => {
                console.error(error)
            });

            $("#" + editForm).on("submit", function(e) {
                e.preventDefault();
                e.stopPropagation();
                api.put('/companies/' + id, {
                        data: {
                            "name": $(this).find('[name="name"]').val(),
                        }
                    })
                    .then((response) => {
                        if (response.error) {
                            showAlert(response.error, 'error')
                        } else {
                            getData();
                            showAlert('Successfully added user', 'success');
                            $("#editCompanyModal").modal('hide');
                            $('.needs-validation').removeClass('was-validated');
                            $("#" + editForm).find('input:text, input:password, select')
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
                        } else {
                            console.error(error);
                        }
                    });
            });
        });
    });

</script>
