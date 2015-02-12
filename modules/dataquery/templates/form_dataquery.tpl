<script src="/js/react.js"></script>
<script src="GetJS.php?Module=dataquery&file=react.fieldselector.js"></script>
<script src="GetJS.php?Module=dataquery&file=react.tabs.js"></script>
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
        {foreach from=$categories item=category}
            "{$category|escape:"js"}",
        {/foreach}
    ];
var queryApp = RDataQueryApp(
    {
        title: "Fields",
        categories: categories,
        UpdatedTime: "{$updatetime|escape:"js"}"
    });
React.render(queryApp, document.getElementById("reactTest"));
</script>
