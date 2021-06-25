$(() => {
    let socket = io();

    const notificationTable = $('#notification-list-table').DataTable({
        bLengthChange: false,
        language: {
            emptyTable: 'No entries to show'
        },
        dom: '<"datatable-extra">frt<"row"<"col-md-6"i><"col-md-6"p>>',
        order: [[0, 'asc']],
        ordering: false,
        searching: false,
        paging: false,
        info: false,
        columns: [
            {data: 'message'},
            {data: 'sensor'},
            {data: 'zone'},
            {data: 'company'},
            {data: 'recordedTemp'},
            {data: 'minTemp'},
            {data: 'maxTemp'},
            {data: 'createdAt', createdCell (td, cellData) {
                    $(td).text(moment(cellData * 1000).format('MMMM Do YYYY, h:mm:ss a'));
                }}
        ]
    });

    socket.on('sensor_update', e => {
        refreshDasboard();
    });

    let dashboardDataAjax = null;
    function refreshDasboard() {
        if (dashboardDataAjax !== null) {
            dashboardDataAjax.abort();
        }

        dashboardDataAjax = $.ajax({
            url: '/dashboard',
            success: response => {
                if (response.status === 'success') {
                    $('#total-sensor-count').text(response.data.totalSensors);
                    $('#healthy-sensor-count').text(response.data.healthy);
                    $('#warning-sensor-count').text(response.data.warning);

                    notificationTable
                        .clear()
                        .rows.add(response.data.notifications)
                        .draw(false);
                }
            }
        });
    }

    refreshDasboard();
});
