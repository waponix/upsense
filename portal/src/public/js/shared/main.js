// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

let dataTableGlobalOptions = {
    bLengthChange: false,
    bServerSide: true,
    iDisplayLength: 25
}

$(() => {
    $(document)
        .on('mouseover', '[data-toggle="tooltip"]', e => {
            console.log('test');
            $(e.target).tooltip('show');
        })
        .on('mouseleave', '[data-toggle="tooltip"]', e => {
            $(e.target).tooltip('hide');
        });

    const socket = io();

    socket.on('notification', () => {
        updateNotificationCounter()
    });

    updateNotificationCounter();
});

let notificationAjax = null;

function updateNotificationCounter()
{
    if (notificationAjax !== null) {
        notificationAjax.abort();
    }

    notificationAjax = $.ajax({
        url: '/unseen-notification-count',
        method: 'post',
        success: response => {
            if (parseInt(response.data) > 0 ) {
                $('a#alertsDropdown span.badge').text(response.data).show();
            } else {
                $('a#alertsDropdown span.badge').hide();
            }
        }
    });
}
