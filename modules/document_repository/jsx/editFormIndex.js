/* global ReactDOM */

import DocEditForm from './editForm';
const args = QueryString.get(document.currentScript.src);

window.addEventListener('load', () => {
  ReactDOM.render(
    <div className="page-edit-form">
      <div className="row">
        <div className="col-md-9 col-lg-7">
          <DocEditForm
            dataURL={`${loris.BaseURL}/document_repository/Uploadfile/?id=${args.id}`}
            action={`${loris.BaseURL}/document_repository/Editfile`}
          />
        </div>
      </div>
    </div>,
    document.getElementById('lorisworkspace')
  );
});
