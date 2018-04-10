$(document).ready(function() {
    $("#btn_reject").click(function() {
    const userID = document.getElementById("UserID").value;
    const baseurl = loris.BaseURL;

    $.ajax(baseurl + '/user_accounts/ajax/rejectUser.php', {
      type:'POST',
      data: {identifier: userID},
      success: function(data, textStatus){
        location.href = baseurl+'/user_accounts/';
      },
      error: function(jqXHR, textStatus, errorThrown){
        alert(jqXHR.responseText);
      }
    }); 
  }); 
});
