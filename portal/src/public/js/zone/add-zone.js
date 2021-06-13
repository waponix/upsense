$(() => {
    const companyId = $('input#data-company-id').val();

    $('form#zone-form').on('submit', function (e) {
        e.preventDefault();

        const formData = {
           name: $(this).find('input[name="name"]').val()
        };

        $.ajax({
            url: `/company/${companyId}/zone/new`,
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
});
