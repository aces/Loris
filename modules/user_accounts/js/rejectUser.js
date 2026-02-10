import UserAccountsClient from '../jsx/UserAccountsClient';

$(document).ready(function() {
    $("#btn_reject").click(function() {
    const userID = document.getElementById("UserID").value;
    const baseurl = loris.BaseURL;
    const client = new UserAccountsClient();

    client.rejectUser(userID)
      .then(() => {
        location.href = baseurl + '/user_accounts/';
      })
      .catch(async (error) => {
        let errorMessage = '';
        if (error && error.response) {
          try {
            errorMessage = await error.response.text();
          } catch (responseError) {
            errorMessage = '';
          }
        }
        alert(errorMessage);
      });
  }); 
});
