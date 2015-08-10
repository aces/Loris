<script src="/js/react-with-addons-0.13.3.js"></script>
<script src="GetJS.php?Module=dataquery&file=arrayintersect.js"></script>
<script src="GetJS.php?Module=dataquery&file=react.datatable.js"></script>
<script src="GetJS.php?Module=dataquery&file=react.fieldselector.js"></script>
<script src="GetJS.php?Module=dataquery&file=react.tabs.js"></script>
<script src="GetJS.php?Module=dataquery&file=react.sidebar.js"></script>
<script src="GetJS.php?Module=dataquery&file=react.app.js"></script>
<script src="GetJS.php?Module=dataquery&file=jstat.js"></script>
<div id="reactTest">
</div>
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

<script>
var categories = [
        {foreach from=$categories item=value key=category}
           { "category" : "{$category|escape:"js"}",
             "numFields" : {$value} },
        {/foreach}
        ];
var queryApp = RDataQueryApp(
    {
        title: "Fields",
        categories: categories,
        UpdatedTime: "{$updatetime|escape:"js"}",
        SavedQueries : {
            "User" : {$savedqueries.user|json_encode},
            "Shared" : {$savedqueries.shared|json_encode}
        },
        AllSessions : {$sessions|json_encode}
    });
React.render(queryApp, document.getElementById("reactTest"));
</script>
