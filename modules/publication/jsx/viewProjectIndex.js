import {createRoot} from 'react-dom/client';
import ViewProject from './viewProject';
import i18n from 'I18nSetup';
import frStrings from '../locale/fr/LC_MESSAGES/publication.json';
import hiStrings from '../locale/hi/LC_MESSAGES/publication.json';
import jaStrings from '../locale/ja/LC_MESSAGES/publication.json';
import enStrings from '../locale/en/LC_MESSAGES/publication.json';
const args = QueryString.get(document.currentScript.src);

document.addEventListener('DOMContentLoaded', () => {
  i18n.addResourceBundle('fr', 'publication', frStrings);
  i18n.addResourceBundle('hi', 'publication', hiStrings);
  i18n.addResourceBundle('ja', 'publication', jaStrings);
  i18n.addResourceBundle('en', 'publication', enStrings);
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
