$(() => {
    const sensorId = $('input#data-id').val();

    loadSensorData();

    $('form#sensor-form').on('submit', function (e) {
        e.preventDefault();

        let formData = {
            name: $(this).find('input[name="name"]').val() || null,
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

        $.ajax({
            url: `/devices/sensor/${sensorId}/edit`,
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

    function loadHubChoices(target, hubId = null)
    {
        $.ajax({
            url: '/devices/hub/list',
            method: 'post',
            data: {query: {relations: ['zones']}},
            success: response => {
                console.log(response);
                const hubs = response.data;
                const defaultOption = target.find('option:first-child').detach();
                target.html('').append(defaultOption);

                for (const hub of hubs) {
                    const hubName = !!hub.name ? hub.name : hub.serial;
                    const option = $('<option>').text(hubName).val(hub.id);
                    if (hub.id === hubId) {
                        option.prop({selected: true});
                    }
                    target.append(option);
                }
            }
        });
    }

    function loadSensorData() {
        $.ajax({
            url: `/devices/sensor/${sensorId}/edit`,
            method: 'get',
            success: response => {
                console.log(response);
                const sensorData = response.data || {};

                for (const field in sensorData) {
                    $('form#sensor-form').find(`#sensor-${field}`).val(sensorData[field]);
                }

                loadHubChoices($('select[name=hub]'), sensorData.hub.id);
            }
        })
    }
});
