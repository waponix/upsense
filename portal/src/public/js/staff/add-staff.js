$(() => {
    // load the company options
    loadCompanyOptions($('form#staff-form select[name="company"]'));

    $('form#staff-form').on('submit', function (e) {
        e.preventDefault();

        let formData = {
            username: $(this).find('input[name="username"]').val(),
            password: $(this).find('input[name="password"]').val(),
            firstName: $(this).find('input[name="firstName"]').val(),
            lastName: $(this).find('input[name="lastName"]').val(),
            email: $(this).find('input[name="email"]').val(),
            mobile: $(this).find('input[name="mobile"]').val() || null
        };

        if ($(this).find('select[name="company"]').val()) {
            formData.company = parseInt($(this).find('select[name="company"]').val());
        }

        $.ajax({
            url: '/accounts/staff/new',
            method: 'post',
            data: {data: formData},
            success: response => {
                console.log(response);

                $('.is-invalid').removeClass('is-invalid');

                if (response.status === 'error') {
                    const errorKeys = Object.keys(response.error)
                    for (let errorField of errorKeys) {
                        $(`#staff-${errorField}`).addClass('is-invalid');
                        $(`#error-staff-${errorField}`).text(response.error[errorField][0]);
                    }
                } else {
                    location.replace('/accounts/staff/list');
                }
            }
        });
    });

    function loadCompanyOptions(target)
    {
        $.ajax({
            url: '/company/list',
            method: 'post',
            success: response => {
                const companies = response.data;

                for (const company of companies) {
                    const option = $('<option>').text(company.name).val(company.id);
                    target.append(option);
                }
            }
        })
    }
});
