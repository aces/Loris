<div class="row">
  <div class="col-md-9 col-lg-7">
    <div id="video-edit-form"></div>
  </div>
</div>

<script>
  var videoEditForm = RVideoUploadForm({
    "DataURL": "{$baseurl}/videos/ajax/VideoUpload.php?action=getVideoData&idVideo=" + {$smarty.get.id},
    "idVideo": {$smarty.get.id},
    "action": "{$baseurl}/videos/ajax/VideoUpload.php?action=edit"
  });
  React.render(videoEditForm, document.getElementById("video-edit-form"));
</script>

