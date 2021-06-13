// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

$(() => {
    $(document)
        .on('mouseover', '[data-toggle="tooltip"]', e => {
            console.log('test');
            $(e.target).tooltip('show');
        })
        .on('mouseleave', '[data-toggle="tooltip"]', e => {
            $(e.target).tooltip('hide');
        });
});
