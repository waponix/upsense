$(() => {
    const hubTable = $('#hub-list-table').DataTable({
        bLengthChange: false,
        language: {
            emptyTable: 'No hub data to show',
            infoEmpty: 'No entries to show'
        },
        dom: '<"datatable-extra">frt<"row"<"col-md-6"i><"col-md-6"p>>',
        order: [[0, 'asc']],
        columns: [
            {data: 'name'},
            {data: 'serial'}
        ]
    });

    function updateHubList()
    {
        $.ajax({
            url: '/devices/hub/list',
            method: 'post',
            success: (response) => {
                console.log(response);
                hubTable
                    .clear()
                    .rows.add(response.data)
                    .draw(false);
            }
        });
    }

    updateHubList();
});
