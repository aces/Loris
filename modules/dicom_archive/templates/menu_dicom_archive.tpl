<div id="page-dicom-archive"></div>
<script>
    var dicomArchivePage = RDicomArchive({
        "Sites": {$Sites|@json_encode},
        "DataURL": "{$baseurl}/dicom_archive/?format=json",
        "getFormattedCell": formatColumn,
    });

    React.render(dicomArchivePage, document.getElementById("page-dicom-archive"));
</script>
