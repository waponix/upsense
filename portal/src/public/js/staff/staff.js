$(() => {
    const staffTable = $('#staff-list-table').DataTable(getTableOptions());
    const staffCreateUrl = '/accounts/staff/new';
    const staffIndexUrl = '/accounts/staff/list';

    let zoneDataLoadAjax = null;
    let staffDataLoadAjax = null;

    $('div.datatable-extra')
        .addClass('float-left')
        .html('<button class="mr-2 btn btn-sm btn-danger btn-icon-split btn-delete-selection" style="display: none">\n' +
            '                        <span class="icon text-white-50">\n' +
            '                            <i class="fas fa-trash"></i>\n' +
            '                        </span>\n' +
            '                        <span class="text">Delete selection</span>\n' +
            '                    </button>\n' +
            '<button class="btn btn-sm btn-primary btn-icon-split btn-add-staff">\n' +
            '                        <span class="icon text-white-50">\n' +
            '                            <i class="fas fa-plus"></i>\n' +
            '                        </span>\n' +
            '                        <span class="text">Add staff</span>\n' +
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

        options.sAjaxSource = '/accounts/staff/list';
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
            emptyTable: '<button class="btn btn-light btn-icon-split btn-sm btn-add-staff">\n' +
                '                        <span class="icon text-white-50">\n' +
                '                            <i class="fas fa-plus"></i>\n' +
                '                        </span>\n' +
                '                        <span class="text">Please add a Staff</span>\n' +
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
                targets: 7,
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
            {mData: 'company.name'},
            {mData: null, sDefaultContent: '<button class="btn btn-edit-staff btn-primary btn-circle btn-sm">\n' +
                    '                                    <i class="fas fa-pen"></i>\n' +
                    '                                </button>\n' +
                    '                                <button class="btn btn-delete-staff btn-outline-dark btn-circle btn-sm">\n' +
                    '                                    <i class="fas fa-trash"></i>\n' +
                    '                                </button>'}
        ];
        options.fnCreatedRow = (row, data) => {
            $(row).find('input.select-item').data({id: data.id});
            $(row).find('button.btn-edit-staff').data({href: `/accounts/staff/${data.id}/edit`});
            $(row).find('button.btn-delete-staff').data({href: `/accounts/staff/${data.id}/delete`});
        };

        return options;
    }

    // staff add related scripts
    $(document)
        .on('click', 'button.btn-add-staff', function () {
            // display the form modal
            $.ajax({
                url: staffCreateUrl,
                method: 'get',
                success: response => {
                    const formModal = $('#form-modal');

                    //prepare the modal contents
                    formModal.find('.modal-content').html(response.toString());
                    loadCompanyOptions($('form select[name="company"]'));

                    // show the modal
                    formModal.modal('show');
                }
            });
        })
        .on('submit', 'form#staff-add-form', function (e) {
            // manage form submit
            e.preventDefault();

            let formData = {
                username: $(this).find('input[name="username"]').val(),
                password: $(this).find('input[name="password"]').val(),
                firstName: $(this).find('input[name="firstName"]').val(),
                lastName: $(this).find('input[name="lastName"]').val(),
                email: $(this).find('input[name="email"]').val(),
                mobile: $(this).find('input[name="mobile"]').val() || null
            };

            if ($(this).find('select[name="company"]').val() != 0) {
                formData.company = parseInt($(this).find('select[name="company"]').val())
            }

            let selectedZones = [];

            $(this).find('input.zone-select:checked').each(function () {
                selectedZones.push(parseInt($(this).val()));
            });

            if (selectedZones.length) {
                formData.zones = selectedZones;
            }

            $.ajax({
                url: staffCreateUrl,
                method: 'post',
                data: {data: formData},
                success: response => {
                    console.log(response);
                    $('.is-invalid').removeClass('is-invalid');

                    if (response.status === 'error') {
                        const errorKeys = Object.keys(response.error)
                        for (let errorField of errorKeys) {
                            $(`#staff-${errorField}`).addClass('is-invalid');
                            $(`#error-staff-${errorField}`).text(response.error[errorField][0]);
                        }
                    } else {
                        location.replace(staffIndexUrl);
                    }
                }
            });
        })
        .on('change', 'form select[name="company"]', function (e) {
            if ($(this).val() != 0) {
                loadZoneChoices($(this).val(), $('section#zone-section div.zone-selection > div'), null, function () {
                    $('section#zone-section').show();
                });
            } else {
                $(this).find('section#zone-section').hide();
            }
        });

    function loadZoneChoices(target, companyId, currentZones = null, callback = null)
    {
        if (zoneDataLoadAjax !== null) {
            zoneDataLoadAjax.abort();
        }
        zoneDataLoadAjax = $.ajax({
            url: `/company/${companyId}/zone/list`,
            method: 'post',
            data: {data: 'raw'},
            success: response => {
                const zones = response.aaData;

                target.html('');

                for (const zone of zones) {
                    let checked = false;

                    if (currentZones !== null) {
                        for(const z of currentZones) {
                            if (z.id === zone.id) {
                                checked = true;
                                break;
                            }
                        }
                    }

                    const option = $(`
                        <div class="form-check form-check-inline mr-5">
                          <input class="form-check-input zone-select ${checked ? 'zone-selected' : ''}" type="checkbox" value="${zone.id}" id="zone-${zone.id}" ${checked ? 'checked' : ''}>
                          <label class="form-check-label" for="zone-${zone.id}">
                            ${zone.name}
                          </label>
                        </div>
                    `);
                    target.append(option);
                }

                if (callback) callback();
            }
        })
    }

    function loadCompanyOptions(target)
    {
        $.ajax({
            url: '/company/list',
            method: 'post',
            data: {data: 'raw'},
            success: response => {
                const companies = response.aaData;

                for (const company of companies) {
                    const option = $('<option>').text(company.name).val(company.id);
                    target.append(option);
                }
            }
        })
    }

    // staff edit related scripts
    $(document)
        .on('click', 'button.btn-edit-staff', function () {
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
                    loadManagerData(url);

                    // show the modal
                    formModal.modal('show');
                }
            });
        })
        .on('submit', 'form#staff-edit-form', function (e) {
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

            let selectedZones = [];
            let unselectedZones = [];

            $(this).find('input.zone-select:checked').each(function () {
                if (!$(this).hasClass('zone-selected')) {
                    selectedZones.push(parseInt($(this).val()));
                }
            });

            if (selectedZones.length) {
                formData.addZones = selectedZones;
            }

            $(this).find('input.zone-select:not(:checked)').each(function () {
                unselectedZones.push(parseInt($(this).val()));
            });

            if (unselectedZones.length) {
                formData.removeZones = unselectedZones;
            }

            $.ajax({
                url: formModal.data('href'),
                method: 'post',
                data: {data: formData},
                success: response => {
                    $('.is-invalid').removeClass('is-invalid');

                    if (response.status === 'error') {
                        const errorKeys = Object.keys(response.error)
                        for (let errorField of errorKeys) {
                            $(`#staff-${errorField}`).addClass('is-invalid');
                            $(`#error-staff-${errorField}`).text(response.error[errorField][0]);
                        }
                    } else {
                        location.replace(staffIndexUrl);
                    }
                }
            });
        });

    function loadManagerData(url) {
        if (staffDataLoadAjax !== null) {
            staffDataLoadAjax.abort();
        }

        staffDataLoadAjax = $.ajax({
            url,
            method: 'get',
            success: response => {
                const staffData = response.data.result || {};

                for (const field in staffData) {
                    $('form#staff-edit-form').find(`#staff-${field}`).val(staffData[field]);
                }

                loadZoneChoices($('section#zone-section div.zone-selection > div'), staffData.company.id, staffData.zones);
            }
        })
    }
});
