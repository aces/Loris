/* global DynamicDataTable MediaUploadForm formatColumn */

$(function() {
  loris.hiddenHeaders = ['Cand ID', 'Session ID'];

  var table = <DynamicDataTable
    DataURL={`${loris.BaseURL}/media/?format=json`}
    getFormattedCell={formatColumn}
    freezeColumn="File Name"
  />;

  ReactDOM.render(table, document.getElementById("datatable"));

  var mediaUploadForm = <MediaUploadForm
    DataURL={`${loris.BaseURL}/media/ajax/FileUpload.php?action=getData`}
    action={`${loris.BaseURL}/media/ajax/FileUpload.php?action=upload`}
  />;

  ReactDOM.render(mediaUploadForm, document.getElementById("media-upload-form"));

  // Adds tab href to url + opens tab based on hash on page load
  // See: http://bit.ly/292MDI8
  var hash = window.location.hash;
  if (hash) $('ul.nav a[href="' + hash + '"]').tab('show');

  $('.nav-tabs a').click(function(e) {
    $(this).tab('show');
    var scrollmem = $('body').scrollTop() || $('html').scrollTop();
    window.location.hash = this.hash;
    $('html,body').scrollTop(scrollmem);
  });
});
