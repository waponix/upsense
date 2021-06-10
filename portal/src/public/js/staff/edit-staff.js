$(() => {
    const staffId = $('input#data-id').val();

    // load staff data
    loadStaffData();

    $('form#staff-form').on('submit', function (e) {
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
            url: `/accounts/staff/${staffId}/edit`,
            method: 'post',
            data: {id: staffId, data: formData},
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

    function loadStaffData() {
        $.ajax({
            url: `/accounts/staff/${staffId}/edit`,
            method: 'get',
            data: {id: staffId},
            success: response => {
                const staffData = response.data.result || {};

                for (const field in staffData) {
                    $('form#staff-form').find(`#staff-${field}`).val(staffData[field]);
                }
            }
        })
    }
});
