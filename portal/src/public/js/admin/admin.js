$(() => {
    const adminTable = $('#admin-list-table').DataTable(getTableOptions());
    const adminCreateUrl = '/accounts/admin/new';
    const adminIndexUrl = '/accounts/admin/list';

    $('div.datatable-extra')
        .addClass('float-left')
        .html('<button class="mr-2 btn btn-sm btn-danger btn-icon-split btn-delete-selection" style="display: none">\n' +
            '                        <span class="icon text-white-50">\n' +
            '                            <i class="fas fa-trash"></i>\n' +
            '                        </span>\n' +
            '                        <span class="text">Delete selection</span>\n' +
            '                    </button>\n' +
            '<button class="btn btn-sm btn-primary btn-icon-split btn-add-admin">\n' +
            '                        <span class="icon text-white-50">\n' +
            '                            <i class="fas fa-plus"></i>\n' +
            '                        </span>\n' +
            '                        <span class="text">Add admin</span>\n' +
            '                    </button>');

    $('table').on('change', 'input.select-item', function (e) {
        e.stopPropagation();

        let hasSelection = !!$('input.select-item:checked').length;
        let notAllSelected = !!$('input.select-item:not(:checked)').length;

        if (hasSelection) {
            $('button.btn-delete-selection').show();
        } else {
            $('button.btn-delete-selection').hide();
        }

        if (notAllSelected) {
            $('input#select-all-items').prop('checked', false);
        } else {
            $('input#select-all-items').prop('checked', true);
        }
    }).on('change', 'input#select-all-items', function () {
        let isChecked = $(this).is(':checked');

        if (isChecked) {
            $('input.select-item:not(:checked)').prop('checked', true);
        } else {
            $('input.select-item:checked').prop('checked', false)
        }

        $('input.select-item').trigger('change');
    });

    function getTableOptions() {
        let options = dataTableGlobalOptions;

        options.sAjaxSource = '/accounts/admin/list';
        options.fnServerData = function ( sSource, aoData, fnCallback, oSettings ) {
            oSettings.jqXHR = $.ajax( {
                dataType: 'json',
                type: 'post',
                url: sSource,
                data: aoData,
                success: fnCallback
            } );
        }
        options.language = {
            zeroRecords: 'No record matched your search',
            emptyTable: '<button class="btn btn-light btn-icon-split btn-sm btn-add-admin">\n' +
                '                        <span class="icon text-white-50">\n' +
                '                            <i class="fas fa-plus"></i>\n' +
                '                        </span>\n' +
                '                        <span class="text">Please add an Admin</span>\n' +
                '         </button>',
            infoEmpty: 'No entries to show'
        };
        options.columnDefs = [
            {
                targets: 0,
                sortable: false,
                className: "text-center"
            },
            {
                targets: 6,
                sortable: false,
                className: "text-center"
            }
        ];
        options.order= [[1, 'asc']];
        options.aoColumns = [
            {mData: null, sDefaultContent: '<div class="form-check">\n' +
                    '                                <input class="form-check-input position-static select-item" type="checkbox">\n' +
                    '                            </div>'},
            {mData: 'firstName'},
            {mData: 'lastName'},
            {mData: 'username'},
            {mData: 'email'},
            {mData: 'mobile', sDefaultContent: 'N/A'},
            {mData: null, sDefaultContent: '<button class="btn btn-edit-admin btn-primary btn-circle btn-sm">\n' +
                    '                                    <i class="fas fa-pen"></i>\n' +
                    '                                </button>\n' +
                    '                                <button class="btn btn-delete-admin btn-outline-dark btn-circle btn-sm">\n' +
                    '                                    <i class="fas fa-trash"></i>\n' +
                    '                                </button>'}
        ];
        options.fnCreatedRow = (row, data) => {
            $(row).find('input.select-item').data({id: data.id});
            $(row).find('button.btn-edit-admin').data({href: `/accounts/admin/${data.id}/edit`});
            $(row).find('button.btn-delete-admin').data({href: `/accounts/admin/${data.id}/delete`});
        };

        return options;
    }

    // add admin related scripts
    $(document)
        .on('click', 'button.btn-add-admin', function () {
            // display the form modal
            $.ajax({
                url: adminCreateUrl,
                method: 'get',
                success: response => {
                    const formModal = $('#form-modal');

                    //prepare the modal contents
                    formModal.find('.modal-content').html(response.toString());

                    // show the modal
                    formModal.modal('show');
                }
            });
        })
        .on('submit', 'form#admin-add-form', function (e) {
            // manage form submit
            e.preventDefault();

            const formData = {
                username: $(this).find('input[name="username"]').val().trim(),
                password: $(this).find('input[name="password"]').val().trim(),
                firstName: $(this).find('input[name="firstName"]').val().trim(),
                lastName: $(this).find('input[name="lastName"]').val().trim(),
                email: $(this).find('input[name="email"]').val().trim(),
                mobile: $(this).find('input[name="mobile"]').val().trim() || null
            };

            $.ajax({
                url: adminCreateUrl,
                method: 'post',
                data: {data: formData},
                success: response => {
                    $('.is-invalid').removeClass('is-invalid');

                    if (response.status === 'error') {
                        const errorKeys = Object.keys(response.error)
                        for (let errorField of errorKeys) {
                            $(`#admin-${errorField}`).addClass('is-invalid');
                            $(`#error-admin-${errorField}`).text(response.error[errorField][0]);
                        }
                    } else {
                        location.replace(adminIndexUrl);
                    }
                }
            });
        });

    // edit admin related scripts
    $(document)
        .on('click', 'button.btn-edit-admin', function () {
            const url = $(this).data('href');
            // display the form modal
            $.ajax({
                url: `${url}?resource=form`,
                method: 'get',
                success: response => {
                    const formModal = $('#form-modal');

                    //prepare the modal contents
                    formModal.find('.modal-content').html(response.toString());
                    formModal.data({href: url});
                    loadAdminData(url);

                    // show the modal
                    formModal.modal('show');
                }
            });
        })
        .on('submit', 'form#admin-edit-form', function (e) {
            e.preventDefault();
            const formModal = $('#form-modal');

            let formData = {
                firstName: $(this).find('input[name="firstName"]').val().trim(),
                lastName: $(this).find('input[name="lastName"]').val().trim(),
                email: $(this).find('input[name="email"]').val().trim(),
                mobile: $(this).find('input[name="mobile"]').val().trim() || null
            };

            if (!!$(this).find('input[name="password"]').val().trim()) {
                formData.password = $(this).find('input[name="password"]').val().trim()
            }

            $.ajax({
                url: formModal.data('href'),
                method: 'post',
                data: {data: formData},
                success: response => {
                    console.log(response);
                    $('.is-invalid').removeClass('is-invalid');

                    if (response.status === 'error') {
                        const errorKeys = Object.keys(response.error)
                        for (let errorField of errorKeys) {
                            $(`#admin-${errorField}`).addClass('is-invalid');
                            $(`#error-admin-${errorField}`).text(response.error[errorField][0]);
                        }
                    } else {
                        location.replace(adminIndexUrl);
                    }
                }
            });
        });

    function loadAdminData(url) {
        $.ajax({
            url: url,
            method: 'get',
            success: response => {
                const adminData = response.data.result || {};

                for (const field in adminData) {
                    $('form#admin-edit-form').find(`#admin-${field}`).val(adminData[field]);
                }
            }
        })
    }
});
