$(document).ready(function() {
    $("#btn_reject").click(function() {
    const userID = document.getElementById("UserID").value;
    const baseurl = loris.BaseURL;

    fetch(baseurl + '/user_accounts/ajax/rejectUser.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: new URLSearchParams({identifier: userID}),
      credentials: 'same-origin',
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            let error = new Error('request_failed');
            error.lorisMessage = text;
            throw error;
          });
        }
        location.href = baseurl + '/user_accounts/';
      })
      .catch((error) => {
        alert(error.lorisMessage || '');
      });
  }); 
});
