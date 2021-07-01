$(() => {
    const socket = io();

    const sensorTable = $('#sensor-list-table').DataTable(getTableOptions());

    $('div.datatable-extra')
        .addClass('float-left')
        .html('<button class="mr-2 btn btn-sm btn-danger btn-icon-split btn-delete-selection" style="display: none">\n' +
            '                        <span class="icon text-white-50">\n' +
            '                            <i class="fas fa-trash"></i>\n' +
            '                        </span>\n' +
            '                        <span class="text">Delete selection</span>\n' +
            '                    </button>\n' +
            '<a href="/devices/sensor/new" class="btn btn-sm btn-primary btn-icon-split btn-add-sensor">\n' +
            '                        <span class="icon text-white-50">\n' +
            '                            <i class="fas fa-plus"></i>\n' +
            '                        </span>\n' +
            '                        <span class="text">Add sensor</span>\n' +
            '                    </a>');

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

        options.sAjaxSource = '/devices/sensor/list';
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
            sEmptyTable: '<a href="/devices/sensor/new" class="btn btn-light btn-icon-split btn-sm btn-add-sensor">\n' +
                '                        <span class="icon text-white-50">\n' +
                '                            <i class="fas fa-plus"></i>\n' +
                '                        </span>\n' +
                '                        <span class="text">Please add a Sensor</span>\n' +
                '         </a>',
            sInfoEmpty: 'No entries to show'
        };
        options.columnDefs = [
            {
                targets: 0,
                sortable: false,
                className: "text-center"
            },
            {
                targets: 11,
                sortable: false,
                className: "text-center"
            }
        ];
        options.order = [[1, 'asc']];
        options.aoColumns = [
            {mData: null, sDefaultContent: '<div class="form-check">\n' +
                    '                                <input class="form-check-input position-static select-item" type="checkbox">\n' +
                    '                            </div>'},
            {mData: 'name', sDefaultContent: 'N/A'},
            {mData: 'deviceName', sDefaultContent: 'N/A'},
            {mData: 'serial'},
            {mData: 'currentTemp'},
            {mData: 'minTemp', sDefaultContent: 'N/A'},
            {mData: 'maxTemp', sDefaultContent: 'N/A'},
            {mData: 'batteryStatus', sDefaultContent: 'N/A', createdCell: (cell, cellData) => { if (cellData) {
                    $(cell).html(`<div class="row no-gutters align-items-center">
                                        <div class="col-auto">
                                            <div class="mb-0 mr-3 font-weight-bold text-gray-800 battery-text">${cellData}%</div>
                                        </div>
                                        <div class="col">
                                            <div class="progress progress-sm mr-2 w-100">
                                                <div class="progress-bar bg-info battery-bar" role="progressbar" style="width: ${cellData}%" aria-valuenow="${cellData}" aria-valuemin="0" aria-valuemax="${cellData}"></div>
                                            </div>
                                        </div>
                                    </div>`)}
                }},
            {mData: 'hub.name', sDefaultContent: 'Unassigned'},
            {mData: 'isConnected', sDefaultContent: 'Offline', createdCell: (td, cellData) => { $(td).text(cellData ? 'Online': 'Offline') }},
            {mData: 'lastSeen', sDefaultContent: 'N/A', createdCell: (td, cellData) => { $(td).text(moment(cellData * 1000).format('MMMM Do YYYY, h:mm:ss a')) }},
            {mData: null, sDefaultContent: '<a href="#" class="btn btn-edit-sensor btn-primary btn-circle btn-sm" data-toggle="tooltip" data-placement="top" title="Configure">\n' +
                    '                                    <i class="fas fa-cog"></i>\n' +
                    '                                </a>\n' +
                    '                                <a href="#" class="btn btn-delete-hub btn-outline-dark btn-circle btn-sm" data-toggle="tooltip" data-placement="top" title="Delete">\n' +
                    '                                    <i class="fas fa-trash"></i>\n' +
                    '                                </a>'}
        ];
        options.fnCreatedRow = (row, data) => {
            $(row).attr({id: `sensor-${data.serial}`});

            if (!!data.currentTemp) {
                $(row).find('td:nth-child(5)').addClass('text-success font-weight-bold').append('°C');
            }
            if (!!data.maxTemp) {
                $(row).find('td:nth-child(6)').append('°C');
            }
            if (!!data.minTemp) {
                $(row).find('td:nth-child(7)').append('°C');
            }

            $(row).find('input.select-item').data({id: data.id});
            $(row).find('a.btn-edit-sensor').attr({href: `/devices/sensor/${data.id}/edit`});
            $(row).find('a.btn-delete-sensor').attr({href: `/devices/sensor/${data.id}/delete`});
        };

        return options;
    }

    socket
        .on(`sdu`, data => {
            sensorTable.ajax.reload();
            data = JSON.parse(data);
            const row = $(`table#sensor-list-table tr#sensor-${data.serial}`);
            row.find('td:nth-child(5)').text(`${data.temperature}°C`);
            row.find('td:nth-child(11)').text(moment(data.timestamp * 1000).format('MMMM Do YYYY, h:mm:ss a'));
            if (data.battery) {
                row.find('td:nth-child(8) .battery-text').text(`${data.battery}%`);
                row.find('td:nth-child(8) .battery-bar').attr({
                    style: `width: ${data.battery}%`,
                    'aria-valuenow': data.battery,
                    'aria-valuemax': data.battery
                });
            }
        });
});
