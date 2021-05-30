<div class="container">
    <div class="row justify-content-md-center">
        <div class="col col-md-12 col-lg-12">
            <div class="animated fade-in">






                <div>
                    <strong>First Name:</strong>
                    <span id="firstName"></span>
                </div>
                <div>
                    <strong>Last Name:</strong>
                    <span id="lastName"></span>
                </div>
                <div>
                    <strong>Mobile:</strong>
                    <span id="mobile"></span>
                </div>
                <div>
                    <strong>Role:</strong>
                    <span id="role"><?php echo e($role); ?></span>
                </div>
                <div>
                    <strong>E-mail:</strong>
                    <span id="email"></span>
                </div>
                <div>
                    <strong>Zones:</strong>
                    <span id="zones"></span>
                </div>
                <div>
                    <strong>Company:</strong>
                    <span id="company"></span>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    $(document).ready(function () {
        $('#show<?php echo e($role); ?>Modal').on('show.coreui.modal', function (event) {
            var button = $(event.relatedTarget) // Button that triggered the modal
            var id = button.data('id') // Extract info from data-* attributes
            // // If necessary, you could initiate an AJAX request here
            // // and then do the updating in a callback.
            // // Update the modal's content.
            //
            //
            let modal = $(this)
            let query = {"relations": ["company", "zones"]};
            query = encodeURI(JSON.stringify(query));
            api.get('/<?php echo e($role); ?>s/' + id + '?query=' + query).then((res) => {
                let dt = res.data.result;
                console.log(res)
                modal.find("#image").attr("src", '/assets/img/avatars/' + dt.image);
                modal.find("#firstName").text(dt.firstName);
                modal.find("#lastName").text(dt.lastName);
                modal.find("#mobile").text(dt.mobile);
                modal.find("#email").text(dt.email);
                modal.find("#role").text(dt.role);

                if (dt.zones !== 'undefined') {
                    $.each(dt.zones, function(i,e){
                        modal.find("#zones").append(e.name + " ");
                    });
                } else {
                    modal.find("#zones").text('N/A')
                }
                modal.find("#company").text(typeof dt.company !== 'undefined' ? dt.company.name : 'N/A');

            }).catch((error) => {
                console.error(error)
            });
        });


    });
</script>
<?php /**PATH /home/kevin/upsense/web/resources/views/dashboard/user/show.blade.php ENDPATH**/ ?>