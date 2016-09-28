<div id="page-dicom-archive"></div>
<script>
  loris.hiddenHeaders = {(empty($hiddenHeaders))? [] : $hiddenHeaders };
  var dicomArchivePage = RDicomArchive({
    "Sites": {$Sites|@json_encode},
    "DataURL": loris.BaseURL + "/dicom_archive/?format=json",
    "getFormattedCell": formatColumn,
    "Module": "dicom_archive"
  });

  React.render(dicomArchivePage, document.getElementById("page-dicom-archive"));
</script>