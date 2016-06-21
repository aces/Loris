<div class="row">
  <div class="col-md-7">
    <div id="video-upload-form"></div>
    <div id="file-progress" class="col-sm-10 hide">
      <div class="progress">
        <div id="progressbar" class="progress-bar progress-bar-striped active"
             role="progressbar" aria-valuenow="0" aria-valuemin="0"
             aria-valuemax="100">
        </div>
        <div id="progresslabel">0%</div>
      </div>
    </div>
  </div>
</div>

<script>
  var videoUploadForm = RVideoUploadForm({
    "DataURL": "{$baseurl}/videos/ajax/VideoUpload.php?action=getVideoData",
    "action": "{$baseurl}/videos/ajax/VideoUpload.php?action=upload"
  });
  React.render(videoUploadForm, document.getElementById("video-upload-form"));
</script>

