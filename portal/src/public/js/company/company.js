$(() => {
    const companyTable = $('#company-list-table').DataTable({
        bLengthChange: false,
        language: {
            emptyTable: '<a href="/company/new" class="btn btn-light btn-icon-split btn-sm btn-add-company">\n' +
                '                        <span class="icon text-white-50">\n' +
                '                            <i class="fas fa-plus"></i>\n' +
                '                        </span>\n' +
                '                        <span class="text">Please add a Company</span>\n' +
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
                targets: 2,
                sortable: false,
                className: "text-center"
            }
        ],
        order: [[1, 'asc']],
        columns: [
            {data: null, defaultContent: `<div class="form-check">
                                                    <input class="form-check-input position-static select-item" type="checkbox">
                                                </div>`},
            {data: 'name'},
            {data: null, defaultContent: `<a data-toggle="tooltip" data-placement="top" title="View details" href="#" class="btn btn-view-company btn-info btn-circle btn-sm">
                                                        <i class="fas fa-eye"></i>
                                                    </a>
                                                    <a data-toggle="tooltip" data-placement="top" title="Edit details" href="#" class="btn btn-edit-company btn-primary btn-circle btn-sm">
                                                        <i class="fas fa-pen"></i>
                                                    </a>
                                                    <a data-toggle="tooltip" data-placement="top" title="Delete" href="#" class="btn btn-delete-company btn-outline-dark btn-circle btn-sm">
                                                        <i class="fas fa-trash"></i>
                                                    </a>`}
        ],
        fnCreatedRow: (row, data) => {
            $(row).find('input.select-item').data({id: data.id});
            $(row).find('a.btn-view-company').attr({href: `/company/${data.id}/view`});
            $(row).find('a.btn-edit-company').attr({href: `/company/${data.id}/edit`});
            $(row).find('a.btn-delete-company').attr({href: `/company/${data.id}/delete`});
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
            '<a href="/company/new" class="btn btn-sm btn-primary btn-icon-split btn-add-company">\n' +
        '                        <span class="icon text-white-50">\n' +
        '                            <i class="fas fa-plus"></i>\n' +
        '                        </span>\n' +
        '                        <span class="text">Add company</span>\n' +
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

    function updateCompanyList()
    {
        $.ajax({
            url: '/company/list',
            method: 'post',
           success: (response) => {
                companyTable
                    .clear()
                    .rows.add(response.data)
                    .draw(false);
           }
        });
    }

    updateCompanyList();
});
