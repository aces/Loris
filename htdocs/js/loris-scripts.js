/* eslint new-cap: ["error", {capIsNewExceptions: ["DynamicTable", "FileUpload"]}]*/

/**
 * Display the login modal when a request returns a 401 response.
 */
function handleUnauthorized() {
  if (!window.$ || !window.loris) {
    return;
  }

  if (!$('#login-modal').length) {
    return;
  }

  if ($('#login-modal').hasClass('in')) {
    $('#login-modal-error').show();
    return;
  }

  $('#login-modal').modal('show');
  $('#modal-login')
    .off('click.lorisFetch')
    .on('click.lorisFetch', function(e) {
      e.preventDefault();
      let data = {
        username: $('#modal-username').val(),
        password: $('#modal-password').val(),
        login: 'Login',
      };

      window.lorisFetch(window.loris.BaseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: new URLSearchParams(data),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('request_failed');
          }
          $('#login-modal-error').hide();
          $('#login-modal').modal('hide');
        })
        .catch(() => {
          $('#login-modal-error').show();
        });
    });
}

if (!window.lorisFetch) {
  window.lorisFetch = function(input, init) {
    const options = Object.assign(
      {
        credentials: 'same-origin',
      },
      init || {}
    );
    return fetch(input, options).then((response) => {
      if (response.status === 401) {
        handleUnauthorized();
      }
      return response;
    });
  };
}

$(document).ready(function() {
  $('#menu-toggle').click(function(e) {
    e.preventDefault();
    $('.wrapper').toggleClass('active');
  });
  $('.dynamictable').DynamicTable();
  $('.fileUpload').FileUpload();
});
