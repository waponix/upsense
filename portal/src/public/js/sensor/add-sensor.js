$(() => {
    const companyId = $('input#data-company-id').val();

    loadHubChoices($('select[name=hub]'));

    $('form#sensor-form').on('submit', function (e) {
        e.preventDefault();

        let formData = {
            name: $(this).find('input[name="name"]').val() || null,
            serial: $(this).find('input[name="serial"]').val() || null
        };

        if (!!$(this).find('input[name="maxTemp"]').val) {
            formData.maxTemp = parseInt($(this).find('input[name="maxTemp"]').val());
            formData.maxTemp = isNaN(formData.maxTemp) ? null : formData.maxTemp;
        }

        if (!!$(this).find('input[name="minTemp"]').val) {
            formData.minTemp = parseInt($(this).find('input[name="minTemp"]').val());
            formData.minTemp = isNaN(formData.minTemp) ? null : formData.minTemp;
        }

        if (parseInt($(this).find('select[name="hub"]').val()) != 0) {
            formData.hub = parseInt($(this).find('select[name="hub"]').val());
        }

        console.log(formData);

        $.ajax({
            url: `/devices/sensor/new`,
            method: 'post',
            data: {data: formData},
            success: function (response) {
                $('.is-invalid').removeClass('is-invalid');

                if (response.status === 'error') {
                    const errorKeys = Object.keys(response.error)
                    for (let errorField of errorKeys) {
                        $(`#sensor-${errorField}`).addClass('is-invalid');
                        $(`#error-sensor-${errorField}`).text(response.error[errorField][0]);
                    }
                } else {
                    location.replace(`/devices/sensor/list`);
                }
            }
        });
    });

    function loadHubChoices(target)
    {
        $.ajax({
            url: '/devices/hub/list',
            method: 'post',
            data: {query: {relations: ['zones']}},
            success: response => {
                console.log(response);
                const hubs = response.aaData;
                const defaultOption = target.find('option:first-child').detach();
                target.html('').append(defaultOption);

                for (const hub of hubs) {
                    const hubName = !!hub.name ? hub.name : hub.serial;
                    const option = $('<option>').text(hubName).val(hub.id);
                    target.append(option);
                }
            }
        });
    }
});
