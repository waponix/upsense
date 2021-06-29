$(() => {
    const adminTable = $('#admin-list-table').DataTable(getTableOptions());

    $('div.datatable-extra')
        .addClass('float-left')
        .html('<button class="mr-2 btn btn-sm btn-danger btn-icon-split btn-delete-selection" style="display: none">\n' +
            '                        <span class="icon text-white-50">\n' +
            '                            <i class="fas fa-trash"></i>\n' +
            '                        </span>\n' +
            '                        <span class="text">Delete selection</span>\n' +
            '                    </button>\n' +
            '<a href="/accounts/admin/new" class="btn btn-sm btn-primary btn-icon-split btn-add-admin">\n' +
            '                        <span class="icon text-white-50">\n' +
            '                            <i class="fas fa-plus"></i>\n' +
            '                        </span>\n' +
            '                        <span class="text">Add admin</span>\n' +
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

        options.sAjaxSource = '/accounts/admin/list';
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
            emptyTable: '<a href="/accounts/admin/new" class="btn btn-light btn-icon-split btn-sm btn-add-admin">\n' +
                '                        <span class="icon text-white-50">\n' +
                '                            <i class="fas fa-plus"></i>\n' +
                '                        </span>\n' +
                '                        <span class="text">Please add an Admin</span>\n' +
                '         </a>',
            infoEmpty: 'No entries to show'
        };
        options.columnDefs = [
            {
                targets: 0,
                sortable: false,
                className: "text-center"
            },
            {
                targets: 6,
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
            {mData: null, sDefaultContent: '<a href="#" class="btn btn-edit-admin btn-primary btn-circle btn-sm">\n' +
                    '                                    <i class="fas fa-pen"></i>\n' +
                    '                                </a>\n' +
                    '                                <a href="#" class="btn btn-delete-admin btn-outline-dark btn-circle btn-sm">\n' +
                    '                                    <i class="fas fa-trash"></i>\n' +
                    '                                </a>'}
        ];
        options.fnCreatedRow = (row, data) => {
            $(row).find('input.select-item').data({id: data.id});
            $(row).find('a.btn-edit-admin').attr({href: `/accounts/admin/${data.id}/edit`});
            $(row).find('a.btn-delete-admin').attr({href: `/accounts/admin/${data.id}/delete`});
        };

        return options;
    }
});
