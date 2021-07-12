$(() => {
    // load the company options
    loadCompanyOptions($('form#hub-form select[name="company"]'));

    $('form#hub-form')
        .on('submit', function (e) {
            e.preventDefault();

            let formData = {
                name: $(this).find('input[name="name"]').val() || null,
                serial: $(this).find('input[name="serial"]').val() || null,
            };

            let submit = true;

            if (!$(this).find('input[name="name"]').val()) {
                $('#hub-name').addClass('is-invalid');
                $('#error-hub-name').text('The name field is required');
                submit = false;
            }

            if (!$(this).find('input[name="serial"]').val()) {
                $('#hub-serial').addClass('is-invalid');
                $('#error-hub-serial').text('The serial field is required');
                submit = false;
            }

            if (parseInt($(this).find('select[name="company"]').val()) == 0) {
                $('#hub-company').addClass('is-invalid');
                $('#error-hub-company').text('The company field is required');
                submit = false;
            } else {
                formData.company = parseInt($(this).find('select[name="company"]').val());
            }

            if (parseInt($(this).find('select[name="zone"]').val()) != 0) {
                formData.zone = $(this).find('select[name="zone"]').val();
            } //else {
            //     $('#hub-zone').addClass('is-invalid');
            //     $('#error-hub-zone').text('The zone field is required');
            //     submit = false;
            // }

            if (!submit) return false;

            $.ajax({
                url: '/devices/hub/new',
                method: 'post',
                data: {data: formData},
                success: response => {
                    console.log(response);

                    $('.is-invalid').removeClass('is-invalid');

                    if (response.status === 'error') {
                        const errorKeys = Object.keys(response.error)
                        for (let errorField of errorKeys) {
                            $(`#hub-${errorField}`).addClass('is-invalid');
                            $(`#error-hub-${errorField}`).text(response.error[errorField][0]);
                        }
                    } else {
                        location.replace('/devices/hub/list');
                    }
                }
            });
        });

    $('form#hub-form select[name="company"]').on('change', function (e) {
        if ($(this).val() != 0) {
            loadZoneChoices($(this).val(), $('form#hub-form select#hub-zone'), function () {
                $('form#hub-form .zone-selection').show();
            });
        } else {
            $('form#hub-form .zone-selection').hide();
        }
    });

    function loadZoneChoices(companyId, target, callback = null)
    {
        $.ajax({
            url: `/company/${companyId}/zone/list`,
            method: 'post',
            data: {data: 'raw'},
            success: response => {
                const zones = response.aaData;
                const defaultOption = target.find('option:first-child').detach();
                target.html('').append(defaultOption);

                for (const zone of zones) {
                    const option = $('<option>').text(zone.name).val(zone.id);
                    target.append(option);
                }

                if (callback) callback();
            }
        })
    }

    function loadCompanyOptions(target)
    {
        $.ajax({
            url: '/company/list',
            method: 'post',
            data: {data: 'raw'},
            success: response => {
                const companies = response.aaData;

                for (const company of companies) {
                    const option = $('<option>').text(company.name).val(company.id);
                    target.append(option);
                }
            }
        })
    }
});
