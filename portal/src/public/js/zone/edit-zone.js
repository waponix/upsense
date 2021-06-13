$(() => {
    const zoneId = $('input#data-id').val();
    const companyId = $('input#data-company-id').val();

    // load zone data
    loadZoneData();

    $('form#zone-form').on('submit', function (e) {
        e.preventDefault();

        const formData = {
           name: $(this).find('input[name="name"]').val()
        };

        $.ajax({
            url: `/company/${companyId}/zone/${zoneId}/edit`,
            method: 'post',
            data: {data: formData},
            success: function (response) {
                $('.is-invalid').removeClass('is-invalid');

                if (response.status === 'error') {
                    const errorKeys = Object.keys(response.error)
                    for (let errorField of errorKeys) {
                        $(`#zone-${errorField}`).addClass('is-invalid');
                        $(`#error-zone-${errorField}`).text(response.error[errorField][0]);
                    }
                } else {
                    location.replace(`/company/${companyId}/view`);
                }
            }
        });
    });

    function loadZoneData() {
        $.ajax({
            url: `/company/${companyId}/zone/${zoneId}/edit`,
            method: 'get',
            success: response => {
                console.log(response);
                const zoneData = response.data.result || {};

                for (const field in zoneData) {
                    $('form#zone-form').find(`#zone-${field}`).val(zoneData[field]);
                }
            }
        })
    }
});
