/* eslint new-cap: ["error", {capIsNewExceptions: ["DynamicTable", "FileUpload"]}]*/

$(document).ready(function() {
  $('#menu-toggle').click(function(e) {
    e.preventDefault();
    $('.wrapper').toggleClass('active');
  });
  $('.dynamictable').DynamicTable();
  $('.fileUpload').FileUpload();
});

$(document).ajaxError(function(event, jqxhr, settings, thrownError) {
  if (jqxhr.status === 401) {
    if ($('#login-modal').hasClass('in')) {
      $('#login-modal-error').show();
    } else {
      $('#login-modal').modal('show');
      $('#modal-login').click(function(e) {
        e.preventDefault();
        let data = {
          username: $('#modal-username').val(),
          password: $('#modal-password').val(),
          login: 'Login',
        };
        fetch(loris.BaseURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
          body: new URLSearchParams(data),
          credentials: 'same-origin',
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('request_failed');
            }
            $('#login-modal-error').hide();
            $('#login-modal').modal('hide');
          });
      });
    }
  }
});
