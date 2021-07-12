$(() => {
    const managerTable = $('#manager-list-table').DataTable(getTableOptions());
    const managerCreateUrl = '/accounts/manager/new';
    const managerIndexUrl = '/accounts/manager/list';

    $('div.datatable-extra')
        .addClass('float-left')
        .html('<button class="mr-2 btn btn-sm btn-danger btn-icon-split btn-delete-selection" style="display: none">\n' +
            '                        <span class="icon text-white-50">\n' +
            '                            <i class="fas fa-trash"></i>\n' +
            '                        </span>\n' +
            '                        <span class="text">Delete selection</span>\n' +
            '                    </button>\n' +
            '<button class="btn btn-sm btn-primary btn-icon-split btn-add-manager">\n' +
            '                        <span class="icon text-white-50">\n' +
            '                            <i class="fas fa-plus"></i>\n' +
            '                        </span>\n' +
            '                        <span class="text">Add manager</span>\n' +
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

        options.sAjaxSource = '/accounts/manager/list';
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
            emptyTable: '<button class="btn btn-light btn-icon-split btn-sm btn-add-manager">\n' +
                '                        <span class="icon text-white-50">\n' +
                '                            <i class="fas fa-plus"></i>\n' +
                '                        </span>\n' +
                '                        <span class="text">Please add a Manager</span>\n' +
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
            {mData: null, sDefaultContent: '<button class="btn btn-edit-manager btn-primary btn-circle btn-sm">\n' +
                    '                                    <i class="fas fa-pen"></i>\n' +
                    '                                </button>\n' +
                    '                                <button class="btn btn-delete-manager btn-outline-dark btn-circle btn-sm">\n' +
                    '                                    <i class="fas fa-trash"></i>\n' +
                    '                                </button>'}
        ];
        options.fnCreatedRow = (row, data) => {
            $(row).find('input.select-item').data({id: data.id});
            $(row).find('button.btn-edit-manager').data({href: `/accounts/manager/${data.id}/edit`});
            $(row).find('button.btn-delete-manager').data({href: `/accounts/manager/${data.id}/delete`});
        };

        return options;
    }

    // manager add related scripts
    // add admin related scripts
    $(document)
        .on('click', 'button.btn-add-manager', function () {
            // display the form modal
            $.ajax({
                url: managerCreateUrl,
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
        .on('submit', 'form#manager-add-form', function (e) {
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
                url: managerCreateUrl,
                method: 'post',
                data: {data: formData},
                success: response => {
                    console.log(response);
                    $('.is-invalid').removeClass('is-invalid');

                    if (response.status === 'error') {
                        const errorKeys = Object.keys(response.error)
                        for (let errorField of errorKeys) {
                            $(`#manager-${errorField}`).addClass('is-invalid');
                            $(`#error-manager-${errorField}`).text(response.error[errorField][0]);
                        }
                    } else {
                        location.replace(managerIndexUrl);
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
        $.ajax({
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
                          <input class="form-check-input zone-select ${checked ? 'zone-selected' : ''}" type="checkbox" value="${zone.id}" id="zone-${zone.id}">
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

    // manager edit related scripts
    $(document)
        .on('click', 'button.btn-edit-manager', function () {
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
        .on('submit', 'form#manager-edit-form', function (e) {
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
                            $(`#manager-${errorField}`).addClass('is-invalid');
                            $(`#error-manager-${errorField}`).text(response.error[errorField][0]);
                        }
                    } else {
                        location.replace(managerIndexUrl);
                    }
                }
            });
        });

    function loadManagerData(url) {
        $.ajax({
            url,
            method: 'get',
            success: response => {
                const managerData = response.data.result || {};

                for (const field in managerData) {
                    $('form#manager-edit-form').find(`#manager-${field}`).val(managerData[field]);
                }

                loadZoneChoices($('section#zone-section div.zone-selection > div'), managerData.company.id, managerData.zones);
            }
        })
    }
});
