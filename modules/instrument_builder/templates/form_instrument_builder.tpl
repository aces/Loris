<meta charset="utf-8"/>
<script type="text/javascript" src="GetJS.php?Module=instrument_builder&file=instrument_builder.instrument.js"></script>
<script type="text/javascript" src="GetJS.php?Module=instrument_builder&file=instrument_builder.rules.js"></script>
<script src="GetJS.php?Module=instrument_builder&file=react.elements.js"></script>
<script src="GetJS.php?Module=instrument_builder&file=react.questions.js"></script>
<script src="GetJS.php?Module=instrument_builder&file=react.instrument_builder.js"></script>

<div id="message" class="error">&nbsp;</div>
<div id="builder"></div>

{literal}
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
    React.render(
        builderApp,
        document.getElementById("builder")
    );
</script>
{/literal}

<script type="application/ecmascript" src="js/FileSaver.min.js"></script>