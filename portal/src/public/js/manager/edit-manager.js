$(() => {
    const managerId = $('input#data-id').val();

    // load manager data
    loadManagerData();

    $('form#manager-form').on('submit', function (e) {
        e.preventDefault();

        const formData = {
            firstName: $(this).find('input[name="firstName"]').val().trim(),
            lastName: $(this).find('input[name="lastName"]').val().trim(),
            email: $(this).find('input[name="email"]').val().trim(),
            mobile: $(this).find('input[name="mobile"]').val().trim() || null
        };

        if (!!$(this).find('input[name="password"]').val().trim()) {
            formData.password = $(this).find('input[name="password"]').val().trim()
        }

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
            }
        })
    }
});
