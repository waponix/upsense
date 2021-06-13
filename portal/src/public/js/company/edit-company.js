$(() => {
    const companyId = $('input#data-id').val();

    // load company data
    loadCompanyData();

    $('form#company-form').on('submit', function (e) {
        e.preventDefault();

        const formData = {
           name: $(this).find('input[name="name"]').val()
        };

        $.ajax({
            url: `/company/${companyId}/edit`,
            method: 'post',
            data: {id: companyId, data: formData},
            success: function (response) {
                $('.is-invalid').removeClass('is-invalid');

                if (response.status === 'error') {
                    const errorKeys = Object.keys(response.error)
                    for (let errorField of errorKeys) {
                        $(`#company-${errorField}`).addClass('is-invalid');
                        $(`#error-company-${errorField}`).text(response.error[errorField][0]);
                    }
                } else {
                    location.replace('/company/list');
                }
            }
        });
    });

    function loadCompanyData() {
        $.ajax({
            url: `/company/${companyId}/edit`,
            method: 'get',
            success: response => {
                console.log(response);
                const companyData = response.data.result || {};

                for (const field in companyData) {
                    $('form#company-form').find(`#company-${field}`).val(companyData[field]);
                }
            }
        })
    }
});
