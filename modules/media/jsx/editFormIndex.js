import {createRoot} from 'react-dom/client';
import MediaEditForm from './editForm';
const args = QueryString.get(document.currentScript.src);

document.addEventListener('DOMContentLoaded', () => {
  const mediaEditForm = (
    <div className="page-edit-form">
      <div className="row">
        <div className="col-md-9 col-lg-7">
          <MediaEditForm
            DataURL={loris.BaseURL
                    + '/media/ajax/FileUpload.php?action=getData&idMediaFile='
                    + args.id}
            action={loris.BaseURL
                   + '/media/ajax/FileUpload.php?action=edit'}
          />
        </div>
      </div>
    </div>
  );

  createRoot(
    document.getElementById('lorisworkspace')
  ).render(mediaEditForm);
});
