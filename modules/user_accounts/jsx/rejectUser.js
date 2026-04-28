import swal from 'sweetalert2';

$(document).ready(function() {
    $('#btn_reject').click(function() {
        const userID = document.getElementById('UserID').value;
        const baseurl = loris.BaseURL;

        swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to reject user "' + userID + '"? This action cannot be undone.',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, reject user!',
            cancelButtonText: 'Cancel',
        }).then(function(result) {
            if (result.value === true) {
                $.ajax(baseurl + '/user_accounts/ajax/rejectUser.php', {
                    type: 'POST',
                    data: {identifier: userID},
                    success: function(data, textStatus) {
                        location.href = baseurl + '/user_accounts/';
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        swal.fire('Error', jqXHR.responseText, 'error');
                    }
                });
            }
        });
    });
});