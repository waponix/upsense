$(() => {
    const adminId = $('input#data-id').val();

    // load admin data
    loadAdminData();

    $('form#admin-form').on('submit', function (e) {
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

        $.ajax({
            url: `/accounts/admin/${adminId}/edit`,
            method: 'post',
            data: {id: adminId, data: formData},
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

    function loadAdminData() {
        $.ajax({
            url: `/accounts/admin/${adminId}/edit`,
            method: 'get',
            data: {id: adminId},
            success: response => {
                const adminData = response.data.result || {};

                for (const field in adminData) {
                    $('form#admin-form').find(`#admin-${field}`).val(adminData[field]);
                }
            }
        })
    }
});
