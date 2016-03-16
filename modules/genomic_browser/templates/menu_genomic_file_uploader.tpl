<div id="datatable" />
<script>
var table = RDynamicDataTable({
    "DataURL" : "{$baseurl}/genomic_browser/?submenu=genomic_file_uploader&format=json",
    "getFormattedCell" : formatColumn,
    "freezeColumn" : "file_name"
});

React.render(table, document.getElementById("datatable"));
</script>
