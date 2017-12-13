// import MediaEditForm from './editForm';
const args = QueryString.get(document.currentScript.src);

$(function() {
  const viewProject = (
    <div className="page-edit-form">
      <div className="row">
        <div className="col-md-9 col-lg-7">
          <ViewProject
            DataURL={`${loris.BaseURL}/publications/ajax/FileUpload.php?action=getData&projectID=${args.id}`}
            {/*action={`${loris.BaseURL}/media/ajax/FileUpload.php?action=edit`}*/}
          />
        </div>
      </div>
    </div>
  );

  ReactDOM.render(viewProject, document.getElementById("lorisworkspace"));
});