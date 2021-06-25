$(() => {
    $('form#company-form').on('submit', function (e) {
        e.preventDefault();

        const formData = {
           name: $(this).find('input[name="name"]').val()
        };

        $.ajax({
            url: '/company/new',
            method: 'post',
            data: {data: formData},
            success: function (response) {
                console.log(response);
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
});
