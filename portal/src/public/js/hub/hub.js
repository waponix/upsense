$(() => {
    const hubTable = $('#hub-list-table').DataTable({
        bLengthChange: false,
        language: {
            emptyTable: '<a href="/devices/hub/new" class="btn btn-light btn-icon-split btn-sm btn-add-hub">\n' +
                '                        <span class="icon text-white-50">\n' +
                '                            <i class="fas fa-plus"></i>\n' +
                '                        </span>\n' +
                '                        <span class="text">Please add a Hub</span>\n' +
                '         </a>',
            infoEmpty: 'No entries to show'
        },
        dom: '<"datatable-extra">frt<"row"<"col-md-6"i><"col-md-6"p>>',
        columnDefs: [
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
        ],
        order: [[1, 'asc']],
        columns: [
            {data: null, defaultContent: '<div class="form-check">\n' +
                    '                                <input class="form-check-input position-static select-item" type="checkbox">\n' +
                    '                            </div>'},
            {data: 'name', defaultContent: 'N/A'},
            {data: 'deviceName', defaultContent: 'N/A'},
            {data: 'serial'},
            {data: 'zone.name', defaultContent: 'Unassigned', createdCell: (td, cellData) => { $(td).text(cellData === 'Default' ? 'Unassigned': cellData) }},
            {data: 'isConnected', defaultContent: 'Offline', createdCell: (td, cellData) => { $(td).text(cellData ? 'Online': 'Offline') }},
            {data: 'lastSeen', defaultContent: 'N/A', createdCell: (td, cellData) => { if (cellData) {$(td).text(moment(cellData * 1000).format('MMMM Do YYYY, h:mm:ss a')) }}},
            {data: null, defaultContent: '<a href="#" class="btn btn-edit-hub btn-primary btn-circle btn-sm" data-toggle="tooltip" data-placement="top" title="Configure">\n' +
                    '                                    <i class="fas fa-cog"></i>\n' +
                    '                                </a>\n' +
                    '                                <a href="#" class="btn btn-delete-hub btn-outline-dark btn-circle btn-sm" data-toggle="tooltip" data-placement="top" title="Delete">\n' +
                    '                                    <i class="fas fa-trash"></i>\n' +
                    '                                </a>'}
        ],
        fnCreatedRow: (row, data) => {
            $(row).find('input.select-item').data({id: data.id});
            $(row).find('a.btn-edit-hub').attr({href: `/devices/hub/${data.id}/edit`});
            $(row).find('a.btn-delete-hub').attr({href: `/devices/hub/${data.id}/delete`});
        }
    });

    $('div.datatable-extra')
        .addClass('float-left')
        .html('<button class="mr-2 btn btn-sm btn-danger btn-icon-split btn-delete-selection" style="display: none">\n' +
            '                        <span class="icon text-white-50">\n' +
            '                            <i class="fas fa-trash"></i>\n' +
            '                        </span>\n' +
            '                        <span class="text">Delete selection</span>\n' +
            '                    </button>\n' +
            '<a href="/devices/hub/new" class="btn btn-sm btn-primary btn-icon-split btn-add-hub">\n' +
            '                        <span class="icon text-white-50">\n' +
            '                            <i class="fas fa-plus"></i>\n' +
            '                        </span>\n' +
            '                        <span class="text">Add hub</span>\n' +
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

    function updateHubList()
    {
        $.ajax({
            url: '/devices/hub/list',
            method: 'post',
            data: {query: {relations: ['zone']}},
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
