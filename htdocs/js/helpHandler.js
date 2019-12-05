/* global ReactDOM, RMarkdown */
/* eslint new-cap: ["error", {capIsNewExceptions: ["RMarkdown", "DynamicTable", "FileUpload"]}]*/

$(document).ready(function() {
  $('#menu-toggle').click(function(e) {
    e.preventDefault();
    $('.wrapper').toggleClass('active');
  });
  $('.help-button').click(function(e) {
    let helpContent = $('div.help-content');
    if (helpContent.length) {
      helpContent.toggle();
      e.preventDefault();
      return;
    }
    let getParams = {};
    getParams.testName = loris.TestName;
    if (loris.Subtest !== '') {
      getParams.subtest = loris.Subtest;
    }
    $.get(loris.BaseURL + '/help_editor/ajax/help.php', getParams, function(content) {
      let div = document.createElement('div');
      let btn = document.createElement('BUTTON');
      let edit = document.createElement('BUTTON');
      let text = document.createTextNode('Edit');
      let button = document.createTextNode('Close');
      let wrap = document.createElement('div');
      let markdownContent = document.createElement('div');

      // Render Markdown in wrap div.
      // If help content is from Markdown helpfile.
      if (content.format === 'markdown') {
        ReactDOM.render(RMarkdown({content: content.content}), wrap);
      } else {
        // If help content is from DB.
        wrap.innerHTML = '<hr id=\'help-separator\'>';
        if (content.topic) {
          wrap.innerHTML = '<h3>' + content.topic + '</h3>';
        }
        ReactDOM.render(RMarkdown({content: content.content}), markdownContent);
        wrap.appendChild(markdownContent);
        if (content.updated) {
          wrap.innerHTML = wrap.innerHTML + '<hr>Last updated: ' + content.updated;
        }
      }
      wrap.setAttribute('id', 'help-wrapper');
      btn.appendChild(button);
      btn.className = 'btn btn-default';
      btn.setAttribute('id', 'helpclose');
      edit.appendChild(text);
      edit.className = 'btn btn-default';
      edit.setAttribute('id', 'helpedit');
      div.appendChild(btn);

      // If help content comes from DB `help` table and can
      // be edited online.
      if (loris.userHasPermission('context_help') && content.format !== 'markdown') {
        div.appendChild(edit);
        edit.addEventListener('click', function(e) {
          e.preventDefault();
          window.open(loris.BaseURL + '/help_editor/edit_help_content/?section=' +
            getParams.testName + '&subsection=' + getParams.subtest, '_self');
        });
      }
      div.appendChild(wrap);
      document.getElementById('page').appendChild(div);
      div.setAttribute('class', 'help-content');
      $(div).addClass('visible');
      btn.addEventListener('click', function(e) {
        $(div).hide();
        e.preventDefault();
      });
      e.preventDefault();
    }, 'json');
  });

  $('.dynamictable').DynamicTable();
  $('.fileUpload').FileUpload();
  swal.setDefaults({confirmButtonColor: '#064785'});
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
        $.ajax({
          type: 'post',
          url: loris.BaseURL + '/',
          data: data,
          success: function() {
            $('#login-modal-error').hide();
            $('#login-modal').modal('hide');
          },
        });
      });
    }
  }
});
