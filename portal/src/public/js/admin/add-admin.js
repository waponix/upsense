$(() => {
    $('form#admin-form').on('submit', function (e) {
        e.preventDefault();

        const formData = {
            username: $(this).find('input[name="username"]').val().trim(),
            password: $(this).find('input[name="password"]').val().trim(),
            firstName: $(this).find('input[name="firstName"]').val().trim(),
            lastName: $(this).find('input[name="lastName"]').val().trim(),
            email: $(this).find('input[name="email"]').val().trim(),
            mobile: $(this).find('input[name="mobile"]').val().trim() || null
        };

        $.ajax({
            url: '/accounts/admin/new',
            method: 'post',
            data: {data: formData},
            success: response => {
                console.log(response);

                $('.is-invalid').removeClass('is-invalid');

                if (response.status === 'error') {
                    const errorKeys = Object.keys(response.error)
                    for (let errorField of errorKeys) {
                        $(`#admin-${errorField}`).addClass('is-invalid');
                        $(`#error-admin-${errorField}`).text(response.error[errorField][0]);
                    }
                } else {
                    location.replace('/accounts/admin/list');
                }
            }
        });
    });
});
