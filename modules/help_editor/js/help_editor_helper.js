$(document).ready(function() {

  $("input[name=preview]").click(function(e) {
    if ($('div.help-content').length) {
      $('div.help-content').remove();
      e.preventDefault();
    }
    var title = $('input[name="title"]').val();
    var content = $('textarea[name="content"]').val();
    var myDate = new Date();
    var div = document.createElement("div");

    document.getElementById('page').appendChild(div);
    div.setAttribute("class", "help-content");
    div.setAttribute("id", "preview");
    ReactDOM.render(RPreviewHelp({Title: title, Content: content, MyDate: myDate}), document.getElementById("preview"));
    e.preventDefault();
  });
});
