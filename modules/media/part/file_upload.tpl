<div class="row">
  <div class="col-md-9 col-lg-7">
    <div id="media-upload-form"></div>

    <div class="row form-group">
      <div id="file-progress" class="col-sm-9 col-sm-offset-3 hide">
        <div class="progress">
          <div
            id="progressbar"
             class="progress-bar progress-bar-striped active"
             role="progressbar"
             aria-valuenow="0"
             aria-valuemin="0"
             aria-valuemax="100"
          >
          </div>
          <div id="progresslabel">0%</div>
        </div>
      </div>
    </div>

  </div>
</div>

<script>
  var mediaUploadForm = RMediaUploadForm({
    "DataURL": "{$baseurl}/media/ajax/FileUpload.php?action=getData",
    "action": "{$baseurl}/media/ajax/FileUpload.php?action=upload"
  });
  React.render(mediaUploadForm, document.getElementById("media-upload-form"));
</script>

