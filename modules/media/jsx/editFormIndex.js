/* global ReactDOM */

import MediaEditForm from './editForm';
const args = QueryString.get(document.currentScript.src);

$(function() {
  var mediaEditForm = <MediaEditForm
    DataURL={`${loris.BaseURL}/media/ajax/FileUpload.php?action=getData&idMediaFile=${args.id}`}
    action={`${loris.BaseURL}/media/ajax/FileUpload.php?action=edit`}
  />;

  ReactDOM.render(mediaEditForm, document.getElementById("media-edit-form"));
});
