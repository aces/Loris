<!-- <script src="GetJS.php?Module=dataquery&file=react.datatable.js"></script> -->
<div id="reactTest"
  data-categories='{$categories|json_encode}'
  data-sessions='{$sessions|json_encode}'
  data-updated-time='{$updatetime|escape:"js"}'
  data-user-queries='{$savedqueries.user|json_encode}'
  data-shared-queries='{$savedqueries.shared|json_encode}'
  data-visits='{$visits|json_encode}'
/>

<style type="text/css">
.list-group-item-text {
    margin-left: 2em;
}
.block {
    display: table-cell;
    clear: right;
    text-align: center;
    vertical-align: bottom;
}
h4 input, h4 select option, h4 select {
    color: black;
}
</style>
