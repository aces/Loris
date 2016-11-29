<!-- <script src="GetJS.php?Module=dataquery&file=react.datatable.js"></script> -->
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
        AllSessions : {$sessions|json_encode},
        Visits: {$visits|json_encode}
    });
ReactDOM.render(queryApp, document.getElementById("reactTest"));
</script>
