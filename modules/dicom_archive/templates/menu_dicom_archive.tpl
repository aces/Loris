<!-- selection filter -->
<div id="dicomFilterTable"></div>

<div id="datatable" />
<script>
var filterTable = RDICOMFilterTable(
    {
        Sites: {$Sites|@json_encode},
        FilterValues: {$filterValuesJSON}
    }
);
React.render(filterTable, document.getElementById("dicomFilterTable"));

var table = RDynamicDataTable({
        "DataURL" : "{$baseurl}/dicom_archive/?format=json",
        "getFormattedCell" : formatColumn
});
React.render(table, document.getElementById("datatable"));
</script>
