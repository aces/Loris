/* global ReactDOM */

import DocEditForm from './editForm';
const args = QueryString.get(document.currentScript.src);

$(function() {
  const docEditForm = (
    <div className="page-edit-form">
      <div className="row">
        <div className="col-md-9 col-lg-7">
          <DocEditForm
            DataURL={`${loris.BaseURL}/document_repository/Uploadfile/?id=${args.id}`}
            action={`${loris.BaseURL}/document_repository/Editfile`}
            // action={`${loris.BaseURL}/document_repository/ajax/FileUpload.php?action=edit`}
          />
        </div>
      </div>
    </div>
  );

  ReactDOM.render(docEditForm, document.getElementById('lorisworkspace'));
});
