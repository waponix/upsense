$(() => {
    const companyId = $('input#data-id').val();

    loadCompanyData();

    const zoneTable = $('#zone-list-table').DataTable(getTableOptions());

    $('div.datatable-extra')
        .addClass('float-left')
        .html(`<button class="mr-2 btn btn-sm btn-danger btn-icon-split btn-delete-selection" style="display: none">
                                    <span class="icon text-white-50">
                                        <i class="fas fa-trash"></i>
                                    </span>
                                    <span class="text">Delete selection</span>
                                </button>
            <a href="/company/${companyId}/zone/new" class="btn btn-sm btn-primary btn-icon-split btn-add-zone">
                                    <span class="icon text-white-50">
                                        <i class="fas fa-plus"></i>
                                    </span>
                                    <span class="text">Add zone</span>
                                </a>`);

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

    function loadCompanyData() {
        $.ajax({
            url: `/company/${companyId}/view`,
            method: 'get',
            success: response => {
                const companyData = response.data.result || {};

                for (const field in companyData) {
                    $(`span#company-${field}`).text(companyData[field]);
                }
            }
        });
    }

    function getTableOptions() {
        let options = dataTableGlobalOptions;

        options.sAjaxSource = `/company/${companyId}/zone/list`;
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
            emptyTable: `<a href="/company/${companyId}/zone/new" class="btn btn-light btn-icon-split btn-sm btn-add-zone">
                                        <span class="icon text-white-50">
                                            <i class="fas fa-plus"></i>
                                        </span>
                                        <span class="text">Please add a Zone</span>
                         </a>`,
            infoEmpty: 'No entries to show'
        };
        options.columnDefs = [
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
        ];
        options.order= [[1, 'asc']];
        options.aoColumns = [
            {mData: null, sDefaultContent: `<div class="form-check">
                                                    <input class="form-check-input position-static select-item" type="checkbox">
                                                </div>`},
            {mData: 'name'},
            {mData: null, sDefaultContent: `<a data-toggle="tooltip" data-placement="top" title="Edit details" href="#" class="btn btn-edit-zone btn-primary btn-circle btn-sm">
                                                        <i class="fas fa-pen"></i>
                                                    </a>
                                                    <a data-toggle="tooltip" data-placement="top" title="Delete" href="#" class="btn btn-delete-zone btn-outline-dark btn-circle btn-sm">
                                                        <i class="fas fa-trash"></i>
                                                    </a>`}
        ];
        options.fnCreatedRow = (row, data) => {
            $(row).find('input.select-item').data({id: data.id});
            $(row).find('a.btn-edit-zone').attr({href: `/company/${companyId}/zone/${data.id}/edit`});
            $(row).find('a.btn-delete-zone').attr({href: `/company/${companyId}/zone/${data.id}/delete`});
        };

        return options;
    }
});
