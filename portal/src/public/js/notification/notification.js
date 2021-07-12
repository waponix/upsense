$(() => {
    const socket = io();

    socket.on('notification', () => {
        updateNotificationList();
    });

    const notificationTable = $('#notification-list-table').DataTable(getTableOptions());

    function updateNotificationList(callback = null)
    {
        notificationTable.ajax.reload();
    }

    let notificationSeenAjax = null;
    function updateNotificationSeenStatus()
    {
        if (notificationSeenAjax !== null) {
            notificationSeenAjax.abort();
        }

        const ids = getUnseenIds();

        if (ids.length > 0) {
            notificationSeenAjax = $.ajax({
                url: '/notification',
                method: 'post',
                data: {ids: ids, action: 'updateseen'},
                success: response => {
                    updateNotificationCounter();
                }
            });
        }
    }

    function getUnseenIds()
    {
        let ids = [];

        const unseenNotifications = $('tr.unseen');

        unseenNotifications.each(function () {
            ids.push($(this).data('id'));
        });

        return ids;
    }

    function getTableOptions() {
        let options = dataTableGlobalOptions;

        options.sAjaxSource = '/notification';
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
            emptyTable: 'You don\'t have any notifications at the moment',
            infoEmpty: 'No entries to show'
        };
        options.order= [[7, 'desc']];
        options.aoColumns = [
            {mData: 'message'},
            {mData: 'sensor'},
            {mData: 'zone', sDefaultContent: 'N/A'},
            {mData: 'company'},
            {mData: 'recordedTemp', fnCreatedCell: (td, cellData) => { $(td).text(`${cellData}°C`) }},
            {mData: 'minTemp', fnCreatedCell: (td, cellData) => { $(td).text(`${cellData}°C`) }},
            {mData: 'maxTemp', fnCreatedCell: (td, cellData) => { $(td).text(`${cellData}°C`) }},
            {mData: 'createdAt', fnCreatedCell: (td, cellData) => { $(td).text(moment(cellData * 1000).format('MMMM Do YYYY, h:mm:ss a')) }}
        ];
        options.fnCreatedRow = (row, data) => {
            if (data.seen === 0) {
                $(row).addClass('unseen');
            }
            $(row).data({id: data.id});
        };

        return options;
    }

    notificationTable.on('draw.dt', function () {
        updateNotificationSeenStatus();
    })
});
