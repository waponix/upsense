$(() => {
    const managerTable = $('#manager-list-table').DataTable({
        bLengthChange: false,
        language: {
            emptyTable: '<a href="/accounts/manager/new" class="btn btn-light btn-icon-split btn-sm btn-add-manager">\n' +
                '                        <span class="icon text-white-50">\n' +
                '                            <i class="fas fa-plus"></i>\n' +
                '                        </span>\n' +
                '                        <span class="text">Please add a Manager</span>\n' +
                '         </a>',
            infoEmpty: 'No entries to show'
        },
        dom: '<"datatable-extra">frtip',
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
            {data: 'firstName'},
            {data: 'lastName'},
            {data: 'username'},
            {data: 'email'},
            {data: 'mobile', defaultContent: 'n/a'},
            {data: 'company.name'},
            {data: null, defaultContent: '<a href="#" class="btn btn-edit-manager btn-primary btn-circle btn-sm">\n' +
                    '                                    <i class="fas fa-pen"></i>\n' +
                    '                                </a>\n' +
                    '                                <a href="#" class="btn btn-delete-manager btn-outline-dark btn-circle btn-sm">\n' +
                    '                                    <i class="fas fa-trash"></i>\n' +
                    '                                </a>'}
        ],
        fnCreatedRow: (row, data) => {
            $(row).find('input.select-item').data({id: data.id});
            $(row).find('a.btn-edit-manager').attr({href: `/accounts/manager/${data.id}/edit`});
            $(row).find('a.btn-delete-manager').attr({href: `/accounts/manager/${data.id}/delete`});
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
            '<a href="/accounts/manager/new" class="btn btn-sm btn-primary btn-icon-split btn-add-manager">\n' +
            '                        <span class="icon text-white-50">\n' +
            '                            <i class="fas fa-plus"></i>\n' +
            '                        </span>\n' +
            '                        <span class="text">Add manager</span>\n' +
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

    function updateManagerList()
    {
        $.ajax({
            url: '/accounts/manager/list',
            data: {query: {relations: ['company']}},
            method: 'post',
            success: (response) => {
                console.log(response);
                managerTable
                    .clear()
                    .rows.add(response.data)
                    .draw(false);
            }
        });
    }

    updateManagerList();
});
