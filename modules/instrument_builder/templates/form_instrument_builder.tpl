
<div id="message" class="error">&nbsp;</div>
<div id="builder"></div>

<style>
.selected {
    background: none;
}
table th {
    color: black;
}
</style>
<script>
    var builderApp = RInstrumentBuilderApp();
    const root = ReactDOM.createRoot(document.getElementById("builder"));
    root.render(builderApp);
</script>
