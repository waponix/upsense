$(() => {
    const socket = io();

    const sensorTable = $('#sensor-list-table').DataTable({
        bLengthChange: false,
        language: {
            emptyTable: 'No sensor data to show',
            infoEmpty: 'No entries to show'
        },
        dom: '<"datatable-extra">frt<"row"<"col-md-6"i><"col-md-6"p>>',
        order: [[0, 'asc']],
        columnDefs: [
            {
                targets: 9,
                sortable: false,
                className: "text-center"
            }
        ],
        columns: [
            {data: 'name'},
            {data: 'serial'},
            {data: 'currentTemp'},
            {data: 'maxTemp', defaultContent: 'N/A'},
            {data: 'minTemp', defaultContent: 'N/A'},
            {data: 'batteryStatus', defaultContent: 'N/A', createdCell: (cell, cellData) => {
                    $(cell).html(`<div class="row no-gutters align-items-center">
                                        <div class="col-auto">
                                            <div class="mb-0 mr-3 font-weight-bold text-gray-800 battery-text">${cellData}%</div>
                                        </div>
                                        <div class="col">
                                            <div class="progress progress-sm mr-2 w-25">
                                                <div class="progress-bar bg-info battery-bar" role="progressbar" style="width: ${cellData}%" aria-valuenow="${cellData}" aria-valuemin="0" aria-valuemax="${cellData}"></div>
                                            </div>
                                        </div>
                                    </div>`)}},
            {data: 'hub.name', defaultContent: 'Unassigned'},
            {data: 'isConnected', defaultContent: 'Offline', createdCell: (td, cellData) => { $(td).text(cellData ? 'Online': 'Offline') }},
            {data: 'lastSeen', defaultContent: 'N/A', createdCell: (td, cellData) => { $(td).text(moment(cellData * 1000).format('MMMM Do YYYY, h:mm:ss a')) }},
            {data: null, defaultContent: '<a href="#" class="btn btn-edit-sensor btn-primary btn-circle btn-sm" data-toggle="tooltip" data-placement="top" title="Configure">\n' +
                    '                                    <i class="fas fa-cog"></i>\n' +
                    '                                </a>\n'}
        ],
        fnCreatedRow: (row, data) => {
            $(row).attr({id: `sensor-${data.serial}`});

            if (!!data.currentTemp) {
                $(row).find('td:nth-child(3)').addClass('text-success font-weight-bold').append('°C');
            }
            if (!!data.maxTemp) {
                $(row).find('td:nth-child(4)').append('°C');
            }
            if (!!data.minTemp) {
                $(row).find('td:nth-child(5)').append('°C');
            }

            $(row).find('input.select-item').data({id: data.id});
            $(row).find('a.btn-edit-sensor').attr({href: `/devices/sensor/${data.id}/edit`});
            $(row).find('a.btn-delete-sensor').attr({href: `/devices/sensor/${data.id}/delete`});
        }
    });

    function updateHubList()
    {
        $.ajax({
            url: '/devices/sensor/list',
            method: 'post',
            data: {query: {relations: ['hub']}},
            success: (response) => {
                const data = response.data;

                sensorTable
                    .clear()
                    .rows.add(data)
                    .draw(false);
            }
        });
    }

    socket
        .on(`sdu`, data => {
            data = JSON.parse(data);
            console.log(data);
            const row = $(`table#sensor-list-table tr#sensor-${data.serial}`);
            row.find('td:nth-child(3)').text(`${data.temperature}°C`);
            row.find('td:nth-child(9)').text(moment(data.timestamp * 1000).format('MMMM Do YYYY, h:mm:ss a'));
            if (data.battery) {
                row.find('td:nth-child(6) .battery-text').text(`${data.battery}%`);
                row.find('td:nth-child(6) .battery-bar').attr({
                    style: `width: ${data.battery}%`,
                    'aria-valuenow': data.battery,
                    'aria-valuemax': data.battery
                });
            }
        });

    updateHubList();
});
