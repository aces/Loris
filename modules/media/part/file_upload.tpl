<div class="row">
  <div class="col-md-9 col-lg-7">
    <div id="media-upload-form"></div>
  </div>
</div>

<script>
  var mediaUploadForm = RMediaUploadForm({
    "DataURL": "{$baseurl}/media/ajax/FileUpload.php?action=getData",
    "action": "{$baseurl}/media/ajax/FileUpload.php?action=upload"
  });
  ReactDOM.render(mediaUploadForm, document.getElementById("media-upload-form"));
</script>

