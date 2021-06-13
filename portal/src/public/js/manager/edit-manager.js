$(() => {
    const managerId = $('input#data-id').val();

    // load manager data
    loadManagerData();

    $('form#manager-form').on('submit', function (e) {
        e.preventDefault();

        let formData = {
            firstName: $(this).find('input[name="firstName"]').val().trim(),
            lastName: $(this).find('input[name="lastName"]').val().trim(),
            email: $(this).find('input[name="email"]').val().trim(),
            mobile: $(this).find('input[name="mobile"]').val().trim() || null
        };

        if (!!$(this).find('input[name="password"]').val().trim()) {
            formData.password = $(this).find('input[name="password"]').val().trim()
        }

        let selectedZones = [];
        let unselectedZones = [];

        $(this).find('input.zone-select:checked').each(function () {
            if (!$(this).hasClass('zone-selected')) {
                selectedZones.push(parseInt($(this).val()));
            }
        });

        if (selectedZones.length) {
            formData.addZones = selectedZones;
        }

        $(this).find('input.zone-select:not(:checked)').each(function () {
            unselectedZones.push(parseInt($(this).val()));
        });

        if (unselectedZones.length) {
            formData.removeZones = unselectedZones;
        }

        console.log(formData);

        $.ajax({
            url: `/accounts/manager/${managerId}/edit`,
            method: 'post',
            data: {id: managerId, data: formData},
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

    function loadZoneChoices(company, currentZones, target)
    {
        $.ajax({
            url: `/company/${company.id}/zone/list`,
            method: 'post',
            success: response => {
                console.log(response);
                const zones = response.data;

                target.html('');

                for (const zone of zones) {
                    let checked = false;
                    for(const z of currentZones) {
                        if (z.id === zone.id) {
                            checked = true;
                            break;
                        }
                    }
                    const option = $(`
                        <div class="form-check form-check-inline mr-5">
                          <input class="form-check-input zone-select ${checked ? 'zone-selected' : ''}" type="checkbox" value="${zone.id}" id="zone-${zone.id}" ${checked ? 'checked' : ''}>
                          <label class="form-check-label" for="zone-${zone.id}">
                            ${zone.name}
                          </label>
                        </div>
                    `);
                    target.append(option);
                }
            }
        })
    }

    function loadManagerData() {
        $.ajax({
            url: `/accounts/manager/${managerId}/edit`,
            method: 'get',
            data: {id: managerId},
            success: response => {
                const managerData = response.data.result || {};

                for (const field in managerData) {
                    $('form#manager-form').find(`#manager-${field}`).val(managerData[field]);
                }

                loadZoneChoices(managerData.company, managerData.zones, $('section#zone-section div.zone-selection > div'));
            }
        })
    }
});
