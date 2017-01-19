"use strict";

/* global MediaEditForm */
var args = QueryString.get(document.currentScript.src);

$(function () {
  var mediaEditForm = React.createElement(MediaEditForm, {
    DataURL: loris.BaseURL + "/media/ajax/FileUpload.php?action=getData&idMediaFile=" + args.idMediaFile,
    action: loris.BaseURL + "/media/ajax/FileUpload.php?action=edit"
  });

  ReactDOM.render(mediaEditForm, document.getElementById("media-edit-form"));
});
