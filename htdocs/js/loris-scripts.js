/* eslint new-cap: ["error", {capIsNewExceptions: ["DynamicTable", "FileUpload"]}]*/

if (!window.lorisFetch) {
  window.lorisFetch = function(input, init) {
    const options = Object.assign(
      {
        credentials: 'same-origin',
      },
      init || {}
    );
    return fetch(input, options).then((response) => {
      if (response.status === 401 && window.LoginDialog) {
        window.LoginDialog.show();
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
