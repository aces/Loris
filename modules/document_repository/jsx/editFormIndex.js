import DocEditForm from './editForm';
import {createRoot} from 'react-dom/client';
import React from 'react';
const pageURL = window.location.href;
const id = pageURL.substr(pageURL.lastIndexOf('/') + 1);

window.addEventListener('load', () => {
  createRoot(
    document.getElementById('lorisworkspace')
  ).render(
    <div className="page-edit-form">
      <div className="row">
        <div className="col-md-9 col-lg-7">
          <DocEditForm
            dataURL={`${loris.BaseURL}/document_repository/Files/meta/${id}`}
            action={`${loris.BaseURL}/document_repository/Files`}
          />
        </div>
      </div>
    </div>
  );
});
