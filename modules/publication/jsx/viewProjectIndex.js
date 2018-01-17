import ViewProject from './viewProject';

const args = QueryString.get(document.currentScript.src);

$(function() {
  const viewProject = (
    <div className="page-edit-form">
      <div className="row">
        <div className="col-md-9 col-lg-7">
          <ViewProject
            DataURL={`${loris.BaseURL}/publications/ajax/FileUpload.php?action=getProjectData&id=${args.id}`}
          />
        </div>
      </div>
    </div>
  );

  ReactDOM.render(viewProject, document.getElementById("lorisworkspace"));
});