<div class="row">
  <div class="col-md-9 col-lg-7">
    <div id="media-edit-form"></div>
  </div>
</div>

<script>
  var mediaEditForm = RMediaEditForm({
    "DataURL": "{$baseurl}/media/ajax/FileUpload.php?action=getData&idMediaFile=" + {$smarty.get.id},
    "action": "{$baseurl}/media/ajax/FileUpload.php?action=edit"
  });
  React.render(mediaEditForm, document.getElementById("media-edit-form"));
</script>

