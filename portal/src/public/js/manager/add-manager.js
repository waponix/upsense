$(() => {
    // load the company options
    loadCompanyOptions($('form#manager-form select[name="company"]'));

    $('form#manager-form')
        .on('submit', function (e) {
            e.preventDefault();

            let formData = {
                username: $(this).find('input[name="username"]').val(),
                password: $(this).find('input[name="password"]').val(),
                firstName: $(this).find('input[name="firstName"]').val(),
                lastName: $(this).find('input[name="lastName"]').val(),
                email: $(this).find('input[name="email"]').val(),
                mobile: $(this).find('input[name="mobile"]').val() || null
            };

            if ($(this).find('select[name="company"]').val() != 0) {
                formData.company = parseInt($(this).find('select[name="company"]').val())
            }

            let selectedZones = [];

            $(this).find('input.zone-select:checked').each(function () {
                selectedZones.push(parseInt($(this).val()));
            });

            if (selectedZones.length) {
                formData.zones = selectedZones;
            }

            $.ajax({
                url: '/accounts/manager/new',
                method: 'post',
                data: {data: formData},
                success: response => {
                    console.log(response);

                    $('.is-invalid').removeClass('is-invalid');

                    if (response.status === 'error') {
                        const errorKeys = Object.keys(response.error)
                        for (let errorField of errorKeys) {
                            $(`#manager-${errorField}`).addClass('is-invalid');
                            $(`#error-manager-${errorField}`).text(response.error[errorField][0]);
                        }
                    } else {
                        location.replace('/accounts/manager/list');
                    }
                }
            });
        });

    $('form#manager-form select[name="company"]').on('change', function (e) {
        if ($(this).val() != 0) {
            loadZoneChoices($(this).val(), $('section#zone-section div.zone-selection > div'), function () {
                $('section#zone-section').show();
            });
        } else {
            $(this).find('section#zone-section').hide();
        }
    });

    function loadZoneChoices(companyId, target, callback = null)
    {
        $.ajax({
            url: `/company/${companyId}/zone/list`,
            method: 'post',
            success: response => {
                console.log(response);
                const zones = response.data;

                target.html('');

                for (const zone of zones) {
                    const option = $(`
                        <div class="form-check form-check-inline mr-5">
                          <input class="form-check-input zone-select" type="checkbox" value="${zone.id}" id="zone-${zone.id}">
                          <label class="form-check-label" for="zone-${zone.id}">
                            ${zone.name}
                          </label>
                        </div>
                    `);
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
