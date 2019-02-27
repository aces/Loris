/* global ReactDOM */

import DocEditForm from './editForm';
const pageURL = window.location.href;
const id = pageURL.substr(pageURL.lastIndexOf('/') + 1);

window.addEventListener('load', () => {
  ReactDOM.render(
   <div className="page-edit-form">
      <div className="row">
        <div className="col-md-9 col-lg-7">
          <DocEditForm
            dataURL={`${loris.BaseURL}/document_repository/Files/${id}`}
            action={`${loris.BaseURL}/document_repository/Files`}
          />
        </div>
      </div>
    </div>,
    document.getElementById('lorisworkspace')
  );
});
