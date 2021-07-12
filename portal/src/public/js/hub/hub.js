$(() => {
    const hubTable = $('#hub-list-table').DataTable(getTableOptions());
    const hubCreateUrl = '/devices/hub/new';
    const hubIndexUrl = '/devices/hub/list';

    $('div.datatable-extra')
        .addClass('float-left')
        .html('<button class="mr-2 btn btn-sm btn-danger btn-icon-split btn-delete-selection" style="display: none">\n' +
            '                        <span class="icon text-white-50">\n' +
            '                            <i class="fas fa-trash"></i>\n' +
            '                        </span>\n' +
            '                        <span class="text">Delete selection</span>\n' +
            '                    </button>\n' +
            '<button class="btn btn-sm btn-primary btn-icon-split btn-add-hub">\n' +
            '                        <span class="icon text-white-50">\n' +
            '                            <i class="fas fa-plus"></i>\n' +
            '                        </span>\n' +
            '                        <span class="text">Add hub</span>\n' +
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

        options.sAjaxSource = '/devices/hub/list';
        options.fnServerData = function (sSource, aoData, fnCallback, oSettings) {
            oSettings.jqXHR = $.ajax({
                dataType: 'json',
                type: 'post',
                url: sSource,
                data: aoData,
                success: fnCallback
            });
        }
        options.language = {
            sZeroRecords: 'No records matched the your search',
            sEmptyTable: '<button class="btn btn-light btn-icon-split btn-sm btn-add-hub">\n' +
                '                        <span class="icon text-white-50">\n' +
                '                            <i class="fas fa-plus"></i>\n' +
                '                        </span>\n' +
                '                        <span class="text">Please add a Hub</span>\n' +
                '         </button>',
            sInfoEmpty: 'No entries to show'
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
        options.order = [[1, 'asc']];
        options.aoColumns = [
            {
                mData: null, sDefaultContent: '<div class="form-check">\n' +
                    '                                <input class="form-check-input position-static select-item" type="checkbox">\n' +
                    '                            </div>'
            },
            {mData: 'name', sDefaultContent: 'N/A'},
            {mData: 'deviceName', sDefaultContent: 'N/A'},
            {mData: 'serial'},
            {
                mData: 'zone.name', sDefaultContent: 'Unassigned', createdCell: (td, cellData) => {
                    $(td).text(cellData === 'Default' ? 'Unassigned' : cellData)
                }
            },
            {
                mData: 'isConnected', sDefaultContent: 'Offline', createdCell: (td, cellData) => {
                    $(td).text(cellData ? 'Online' : 'Offline')
                }
            },
            {
                mData: 'lastSeen', sDefaultContent: 'N/A', createdCell: (td, cellData) => {
                    if (cellData) {
                        $(td).text(moment(cellData * 1000).format('MMMM Do YYYY, h:mm:ss a'))
                    }
                }
            },
            {
                mData: null,
                sDefaultContent: '<button class="btn btn-edit-hub btn-primary btn-circle btn-sm" data-toggle="tooltip" data-placement="top" title="Configure">\n' +
                    '                                    <i class="fas fa-cog"></i>\n' +
                    '                                </button>\n' +
                    '                                <button class="btn btn-delete-hub btn-outline-dark btn-circle btn-sm" data-toggle="tooltip" data-placement="top" title="Delete">\n' +
                    '                                    <i class="fas fa-trash"></i>\n' +
                    '                                </button>'
            }
        ];
        options.fnCreatedRow = (row, data) => {
            $(row).find('input.select-item').data({id: data.id});
            $(row).find('button.btn-edit-hub').data({href: `/devices/hub/${data.id}/edit`});
            $(row).find('button.btn-delete-hub').data({href: `/devices/hub/${data.id}/delete`});
        };

        return options;
    }

    // hub add related scripts
    $(document)
        .on('click', 'button.btn-add-hub', function () {
            // display the form modal
            $.ajax({
                url: hubCreateUrl,
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
        .on('submit', 'form#hub-add-form', function (e) {
            // manage form submit
            e.preventDefault();

            let formData = {
                name: $(this).find('input[name="name"]').val() || null,
                serial: $(this).find('input[name="serial"]').val() || null,
            };

            let submit = true;

            if (!$(this).find('input[name="name"]').val()) {
                $('#hub-name').addClass('is-invalid');
                $('#error-hub-name').text('The name field is required');
                submit = false;
            }

            if (!$(this).find('input[name="serial"]').val()) {
                $('#hub-serial').addClass('is-invalid');
                $('#error-hub-serial').text('The serial field is required');
                submit = false;
            }

            if (parseInt($(this).find('select[name="company"]').val()) == 0) {
                $('#hub-company').addClass('is-invalid');
                $('#error-hub-company').text('The company field is required');
                submit = false;
            } else {
                formData.company = parseInt($(this).find('select[name="company"]').val());
            }

            if (parseInt($(this).find('select[name="zone"]').val()) != 0) {
                formData.zone = $(this).find('select[name="zone"]').val();
            } //else {
            //     $('#hub-zone').addClass('is-invalid');
            //     $('#error-hub-zone').text('The zone field is required');
            //     submit = false;
            // }

            if (!submit) return false;

            $.ajax({
                url: hubCreateUrl,
                method: 'post',
                data: {data: formData},
                success: response => {
                    $('.is-invalid').removeClass('is-invalid');

                    if (response.status === 'error') {
                        const errorKeys = Object.keys(response.error)
                        for (let errorField of errorKeys) {
                            $(`#hub-${errorField}`).addClass('is-invalid');
                            $(`#error-hub-${errorField}`).text(response.error[errorField][0]);
                        }
                    } else {
                        location.replace(hubIndexUrl);
                    }
                }
            });
        }).on('change', 'form select#hub-company', function (e) {
            if ($(this).val() != 0) {
                loadZoneChoices($(this).val(), $('select#hub-zone'), null, function () {
                    $('form .zone-selection').show();
                });
            } else {
                $('form#hub-form .zone-selection').hide();
            }
        });

    function loadZoneChoices(companyId, target, zoneId = null, callback = null)
    {
        $.ajax({
            url: `/company/${companyId}/zone/list`,
            method: 'post',
            data: {data: 'raw'},
            success: response => {
                const zones = response.aaData;
                const defaultOption = target.find('option:first-child').detach();
                target.html('').append(defaultOption);

                for (const zone of zones) {
                    let option = $('<option>').text(zone.name).val(zone.id);
                    if (zone.id === zoneId) {
                        option.prop({selected: true})
                    }
                    target.append(option);
                }

                $('form#hub-form .zone-selection').prop({disabled: false});

                if (callback) callback();
            }
        })
    }

    function loadCompanyOptions(target, companyId = null, callback = null)
    {
        $.ajax({
            url: '/company/list',
            method: 'post',
            data: {data: 'raw'},
            success: response => {
                const companies = response.aaData;

                for (const company of companies) {
                    let option = $('<option>').text(company.name).val(company.id);
                    if (company.id === companyId) {
                        option.prop({selected: true})
                    }
                    target.append(option);
                }

                if (callback) callback();
            }
        })
    }

    // hub edit related scripts
    $(document)
        .on('click', 'button.btn-edit-hub', function () {
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
                    loadHubData(url,function (hubData, zoneData) {
                        loadCompanyOptions($('form#hub-edit-form select[name="company"]'), zoneData.companyId, function () {
                            loadZoneChoices(zoneData.companyId, $('form#hub-form select#hub-zone'), hubData.zone.id, null);
                            $('form#hub-form .zone-selection').show();
                        });
                    });

                    // show the modal
                    formModal.modal('show');
                }
            });
        })
        .on('submit', 'form#hub-edit-form', function (e) {
            // manage form submit
            e.preventDefault();
            const formModal = $('#form-modal');

            $('.is-invalid').removeClass('is-invalid');

            let formData = {
                name: $(this).find('input[name="name"]').val() || null,
                zone: null
            };

            let submit = true;

            if (!$(this).find('input[name="serial"]').val()) {
                $('#hub-serial').addClass('is-invalid');
                $('#error-hub-serial').text('The serial field is required');
                submit = false;
            }

            if (parseInt($(this).find('select[name="company"]').val()) == 0) {
                $('#hub-company').addClass('is-invalid');
                $('#error-hub-company').text('The company field is required');
                submit = false;
            } else {
                formData.company = parseInt($(this).find('select[name="company"]').val());
            }

            if (parseInt($(this).find('select[name="zone"]').val()) != 0) {
                formData.zone = $(this).find('select[name="zone"]').val();
            } //else {
            //     $('#hub-zone').addClass('is-invalid');
            //     $('#error-hub-zone').text('The zone field is required');
            //     submit = false;
            // }

            if (!submit) return false;

            $.ajax({
                url: formModal.data('href'),
                method: 'post',
                data: {data: formData},
                success: response => {
                    if (response.status === 'error') {
                        const errorKeys = Object.keys(response.error)
                        for (let errorField of errorKeys) {
                            $(`#hub-${errorField}`).addClass('is-invalid');
                            $(`#error-hub-${errorField}`).text(response.error[errorField][0]);
                        }
                    } else {
                        location.replace(hubIndexUrl);
                    }
                }
            });
        });

    function loadHubData(url, callback = null) {
        $.ajax({
            url: url,
            method: 'get',
            success: response => {
                const hubData = response.data.result || {};
                if (hubData.zone && hubData.zone.id) {
                    getZoneData(hubData.zone.id, function (zoneData) {
                        if (callback) callback(hubData, zoneData);
                    });
                } else {
                    loadCompanyOptions($('form#hub-edit-form select[name="company"]'));
                }

                for (const field in hubData) {
                    $('form#hub-edit-form').find(`#hub-${field}`).val(hubData[field]);
                }
            }
        })
    }

    function getZoneData(zoneId, callback = null) {
        $.ajax({
            url: `/devices/hub/${hubId}/edit`,
            method: 'get',
            success: response => {
                const zoneData = response.data.result || {};

                if (callback) callback(zoneData);
            }
        })
    }
});
