function handleUnauthorized() {
  if (typeof window === 'undefined') {
    return;
  }
  if (!window.$ || !window.loris) {
    return;
  }

  const $ = window.$;
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

      fetch(window.loris.BaseURL, {
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
        })
        .catch(() => {
          $('#login-modal-error').show();
        });
    });
}

function lorisFetch(input, init) {
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
}

if (typeof window !== 'undefined') {
  window.lorisFetch = lorisFetch;
}

export default lorisFetch;
