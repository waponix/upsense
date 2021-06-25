$(() => {
    const socket = io();

    socket.on('notification', () => {
        updateNotificationList();
    });

    const notificationTable = $('#notification-list-table').DataTable({
        bLengthChange: false,
        language: {
            emptyTable: 'You don\'t have any notifications at the moment',
            infoEmpty: ''
        },
        order: [[7, 'desc']],
        columns: [
            {data: 'message'},
            {data: 'sensor'},
            {data: 'zone', defaultContent: 'N/A'},
            {data: 'company'},
            {data: 'recordedTemp'},
            {data: 'minTemp'},
            {data: 'maxTemp'},
            {data: 'createdAt', createdCell: (td, cellData) => { $(td).text(moment(cellData * 1000).format('MMMM Do YYYY, h:mm:ss a')) }}
        ],
        fnCreatedRow: (row, data) => {
            if (data.seen === 0) {
                $(row).addClass('unseen');
            }
            $(row).data({id: data.id});
        }
    });

    let notificationListAjax = null;
    let notificationSeenAjax = null;

    function updateNotificationList(callback = null)
    {
        if (notificationListAjax !== null) {
            notificationListAjax.abort();
        }

        notificationListAjax = $.ajax({
            url: '/notification',
            method: 'post',
            success: response => {
                notificationTable.recordsTotal = response.data.count;
                notificationTable
                    .clear()
                    .rows.add(response.data.data)
                    .draw(false);

                if (callback) callback();
            }
        });
    }

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

    updateNotificationList(updateNotificationSeenStatus);
});
