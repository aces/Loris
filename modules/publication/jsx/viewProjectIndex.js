import {createRoot} from 'react-dom/client';
import ViewProject from './viewProject';
const args = QueryString.get(document.currentScript.src);

document.addEventListener('DOMContentLoaded', () => {
  const viewProject = (
    <div className="page-edit-form">
      <div className="row">
        <div className="col-md-9 col-lg-7">
          <ViewProject
            DataURL={loris.BaseURL
                     + '/publication/ajax/getData.php?action=getProjectData&id='
                     + args.id}
            action={loris.BaseURL
                    + '/publication/ajax/FileUpload.php?action=editProject&id='
                    + args.id}
          />
        </div>
      </div>
    </div>
  );

  createRoot(
    document.getElementById('lorisworkspace')
  ).render(viewProject);
});
