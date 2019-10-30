/* global ReactDOM */

import MediaEditForm from './editForm';
const args = QueryString.get(document.currentScript.src);

$(function() {
  const mediaEditForm = (
    <div className="page-edit-form">
      <div className="row">
        <div className="col-md-9 col-lg-7">
          <MediaEditForm
            DataURL={`${loris.BaseURL}/media/ajax/FileUpload.php?action=getData&idMediaFile=${args.id}`}
            action={`${loris.BaseURL}/media/ajax/FileUpload.php?action=edit`}
          />
        </div>
      </div>
    </div>
  );

  ReactDOM.render(mediaEditForm, document.getElementById('lorisworkspace'));
});
