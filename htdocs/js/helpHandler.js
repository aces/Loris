/* global ReactDOM, RMarkdown, RDisplayHelp */
/* eslint new-cap: ["error", {capIsNewExceptions: ["RMarkdown", "DynamicTable", "FileUpload", "RDisplayHelp"]}]*/

$(document).ready(function() {
  $("#menu-toggle").click(function(e) {
    e.preventDefault();
    $(".wrapper").toggleClass("active");
  });
  $(".help-button").click(function(e) {
    var helpContent = $('div.help-content');
    if (helpContent.length) {
      helpContent.toggle();
      e.preventDefault();
      return;
    }
    var getParams = {};
    getParams.testName = loris.TestName;
    if (loris.Subtest !== "") {
      getParams.subtest = loris.Subtest;
    }

    document.cookie = 'LastUrl=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
    $.get(loris.BaseURL + "/help_editor/ajax/help.php", getParams, function(content) {
      var div = document.createElement("div");
      var btn = document.createElement("BUTTON");
      var edit = document.createElement("BUTTON");
      var text = document.createTextNode("Edit");
      var button = document.createTextNode("Close");
      var wrap;

      if (content.format === "markdown") {
        wrap = document.createElement("div");
        wrap.setAttribute("id", "help-wrapper");
        ReactDOM.render(RMarkdown({content: content.content}), wrap);
      } else {
        wrap = document.createElement("pre");
        wrap.setAttribute("id", "help-wrapper");
        ReactDOM.render(RDisplayHelp({Topic: content.topic, Content: content.content, Updated: content.updated}), wrap);
      }
      btn.appendChild(button);
      btn.className = "btn btn-default";
      btn.setAttribute("id", "helpclose");
      edit.appendChild(text);
      edit.className = "btn btn-default";
      edit.setAttribute("id", "helpedit");
      div.appendChild(wrap);
      div.appendChild(btn);

      if (loris.userHasPermission("context_help") && content.format !== 'markdown') {
        div.appendChild(edit);
        edit.addEventListener("click", function(e) {
          e.preventDefault();
          document.cookie = "LastUrl = " + document.location.toString();
          window.open(loris.BaseURL + "/help_editor/edit_help_content/?section=" +
            getParams.testName + "&subsection=" + getParams.subtest, "_self");
        });
      }
      document.getElementById('page').appendChild(div);
      div.setAttribute("class", "help-content");
      $(div).addClass('visible');
      btn.addEventListener("click", function(e) {
        $(div).hide();
        e.preventDefault();
      });
      e.preventDefault();
    }, "json");
  });

  $(".dynamictable").DynamicTable();
  $(".fileUpload").FileUpload();
  swal.setDefaults({confirmButtonColor: '#064785'});
});
$(document).ajaxError(function(event, jqxhr, settings, thrownError) {
  if (jqxhr.status === 401) {
    if ($('#login-modal').hasClass('in')) {
      $("#login-modal-error").show();
    } else {
      $('#login-modal').modal('show');
      $("#modal-login").click(function(e) {
        e.preventDefault();
        var data = {
          username: $("#modal-username").val(),
          password: $("#modal-password").val(),
          login: "Login"
        };
        $.ajax({
          type: "post",
          url: loris.BaseURL + "/main.php",
          data: data,
          success: function() {
            $("#login-modal-error").hide();
            $('#login-modal').modal('hide');
          }
        });
      });
    }
  }
});
