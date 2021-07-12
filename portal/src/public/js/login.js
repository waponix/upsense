$(() => {
    const key = '@upsense::username';
    let userInputTimeout = null;

    $('body')
        .on('change', 'input#input-username', function () {
            if ($('input#remember-me').is(':checked')) {
                if (userInputTimeout !== null) {
                    clearTimeout(userInputTimeout);
                }

                let value = $(this).val();

                userInputTimeout = setTimeout(() => {
                    localStorage.setItem(key, value);
                }, 2000);
            }
        })

        .on('change', 'input#remember-me', function () {
            if (!$(this).is(':checked')) {
                localStorage.removeItem(key);
            } else {
                localStorage.setItem(key, $('input#input-username').val());
            }
        });

    function userIsRecognized()
    {
        if (!!localStorage.getItem(key)) {
            $('input#input-username').val(localStorage.getItem(key));
            $('input#remember-me').prop({checked: true});
        }
    }

    userIsRecognized();
});
