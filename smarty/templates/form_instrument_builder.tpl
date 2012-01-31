<html>
<head>
<title>Loris Form Builder</title>
<style>
{literal}
.selected {
    background: #099;
}
{/literal}
</style>

<script type="application/ecmascript" src="js/BlobBuilder.min.js"></script>
<script type="application/ecmascript" src="js/FileSaver.min.js"></script>
</head>
<body>
<div id="elements">
    <input type="file" id="instfile" /><input type="button" id="load" value="Load Instrument" />
    <ul>
        <li id="textbox" class="option">Textbox</li>
        <li id="dropdown" class="option">Dropdown</li>
        <li id="scored" class="option">Scored Column</li>
        <li id="header" class="option">Header</li>
        <li id="label" class="option">Label</li>
        <li id="line" class="option">Blank Line</li>
        <li id="textarea" class="option">Textarea</li>
        <li id="date" class="option">Date</li>
        <li>Not implemented in back end below this line
        <li id="page" class="option">Page Break</li>
    </ul>
    Question Name: <input type="text" id="questionName" />
    Question Text: <input type="text" id="questionText" />
    <div id="dropdownoptions" class="options">
        Enum Name: <input type="text" id="newSelectOption">
            <input type="button" value="Add option" onClick="addDropdownOption();" />
            <input type="button" value="Reset" onClick="clearDropdownOption()" />
        Preview:
        <select id="selectOptions">
        </select>
    </div>

    <div>
    </div>
    <input type="button" value="Add Row" onClick="addQuestion();" />
    <div id="message">&nbsp;</div>
</div>
<table id="workspace" border="1">
<tr>
    <th>Database Name (DB)</th>
    <th>Type</th>
    <th>Question Display (Front End)</th>
    <th>Options</th>
</tr>
</table>
<form name="saveform" id="saveform">
Filename: <input type="text" id="filename" value="" />
Instrument Name: <input type="text" id="longname" value="" />
<input type="button" onclick="validate()" value="Validate" />
<input type="submit" value="Save" />
</form>
</body>
</html>
