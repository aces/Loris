import swal from 'sweetalert2';

window.addEventListener('load', () => {
  const btn = document.getElementById('btn_reject');

  if (!btn) return;

  btn.addEventListener('click', () => {
    const userID = document.getElementById('UserID').value;
    const baseurl = loris.BaseURL;

    swal.fire({
      title: 'Are you sure?',
      text: `Do you really want to reject user "${userID}"?\n` +
            'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, reject user!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${baseurl}/user_accounts/ajax/rejectUser.php`, {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            identifier: userID,
          }),
        })
          .then((resp) => {
            if (!resp.ok) {
              return resp.text().then((text) => {
                throw new Error(text);
              });
            }
            window.location.href = `${baseurl}/user_accounts/`;
          })
          .catch((error) => {
            swal.fire('Error', error.message, 'error');
          });
      }
    });
  });
});
