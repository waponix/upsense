<div class="container">
    <div class="row justify-content-md-center">
        <div class="col col-md-12 col-lg-12">
            <div class="animated fadeIn">
                <form id="editZoneForm" autocomplete="off"
                      method="POST" class="needs-validation" novalidate>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text">
                              <svg class="c-icon c-icon-sm">
                                  <use xlink:href="/assets/icons/coreui/free-symbol-defs.svg#cui-user"></use>
                              </svg>
                            </span>
                        </div>
                        <input class="form-control" type="text" placeholder="{{ __('Zone') }}"
                               id="name" name="name" value="" required>
                        <div class="invalid-feedback">
                            Please provide zone name.
                        </div>
                    </div>

                    <button id="editZoneButton" class="btn btn-block btn-success"
                            type="submit">{{ __('Save') }}</button>
                    <a class="btn btn-block btn-secondary" data-dismiss="modal">{{ __('Return') }}</a>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
    $(document).ready(function () {
        $("#createZoneForm").on("submit", function (e) {
            e.preventDefault();
            e.stopPropagation();
            api.post('/companies/' + $("#company").val() + '/zones', {
                data: {
                    "name": $(this).find('[name="name"]').val()
                }
            })
                .then((response) => {
                    if (response.error) {
                        showAlert(response.error, 'error')
                    } else {
                        getData($("#company").val());
                        showAlert('Successfully added zone', 'success');
                        $("#createZoneModal").modal('hide');
                        $('.needs-validation').removeClass('was-validated');
                        $("#createZoneForm").find('input:text, input:password, select')
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
    });



    $(document).ready(function () {
        let editForm = "editZoneForm";

        $('#editZoneModal').on('show.coreui.modal', function (event) {
            var button = $(event.relatedTarget) // Button that triggered the modal
            var id = button.data('id') // Extract info from data-* attributes
            let modal = $(this)

            let zoneQuery = {"relations": ["users"]};
            zoneQuery = encodeURI(JSON.stringify(zoneQuery));

            api.get('/companies/' + $("#company").val() + '/zones/' + id + '?query=' + zoneQuery).then((res) => {
                let dt = res.data.result;
                modal.find("#name").val(dt.name);

            }).catch((error) => {
                console.error(error)
            });

            $("#" + editForm).on("submit", function (e) {
                e.preventDefault();
                e.stopPropagation();
                api.put('/companies/' + $("#company").val() + '/zones/' + id, {
                    data: {
                        "name": $(this).find('[name="name"]').val(),
                    }
                })
                    .then((response) => {
                        if (response.error) {
                            showAlert(response.error, 'error')
                        } else {
                            getData($("#company").val());
                            showAlert('Successfully updated zone', 'success');
                            $("#editZoneModal").modal('hide');
                            $('.needs-validation').removeClass('was-validated');
                            $("#" + editForm).find('input:text, input:password, select')
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
        });
    });
</script>
