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
<div id="message" class="error">&nbsp;</div>
<div id="elements">
    <h2>Load Instrument (optional)</h2>
    <div>
        <input type="file" id="instfile" /><input type="button" id="load" value="Load Instrument" />
    </div>
    <h2>Create Instrument</h2>
    <div>
        Question Type:
        <dl style="margin-left: 25px">
            <dt>Information</dt>
            <dd>
            <button id="header" class="option" title="Centered, header information">Header</button>
            <button id="label" class="option" title="Unemphasized display text">Label</button>
            <button id="scored" class="option" title="Column which stores calculated data">Scored Field</button>
            </dd>
            <dt>Data entry</dt>
            <dd>
            <button id="textbox" class="option" title="Text box for user data entry">Textbox</button>
            <button id="textarea" class="option" title="Larger text area for data entry">Textarea</button>
            <button id="dropdown" class="option" title="Dropdown menu for users to select data from">Dropdown</button>
            <button id="multiselect" class="option" title="Data entry where multiple options may be selected">Multiselect</button>
            <button id="date" class="option" title="User data entry of a date">Date</button>
            <button id="numeric" class="option" title="User data entry of a number">Numeric</button>
            </dd>
            <dt>Formatting</dt>
            <dd>
            <button id="line" class="option" title="Empty line">Blank Line</button>
            <button id="page" class="option" title="Start a new page">Page Break</button>
            </dd>
        </dl>
        <div>

            <div>
        Question Name: <input type="text" id="questionName" />
            </div>
            <div>
        Question Text: <input type="text" id="questionText" size="75"/>
            </div>
            <div id="dropdownoptions" class="options">
                Dropdown Option: <input type="text" id="newSelectOption">
                    <input type="button" value="Add option" onClick="addDropdownOption();" />
                    <input type="button" value="Reset" onClick="clearDropdownOption()" />
                Preview:
                <select id="selectOptions">
                </select>
            </div>
            <div id="multiselectoptions" class="options">
                Option: <input type="text" id="newmultiSelectOption">
                    <input type="button" value="Add option" onClick="addDropdownOption('multi');" />
                    <input type="button" value="Reset" onClick="clearDropdownOption('multi')" />
                Preview:
                <select id="multiselectOptions" multiple>
                </select>
            </div>
            <div id="dateoptions" class="options">
                Start year: <input type="number" id="datemin" min="1900" max="2100">
                            <!--select id="startyear">
                                <option>Project default</option>
                                <option>2000</option>
                                <option>2001</option>
                                <option>2002</option>
                                <option>2003</option>
                            </select-->

                End year: <input type="number" id="datemax" min="1900" max="2100">
            </div>
            <div id="numericoptions" class="options">
                Min: <input id="numericmin" type="number">
                Max: <input id="numericmax" type="number">
            </div>
        </div>

        <input type="button" value="Add Row" onClick="addQuestion();" />
        <table id="workspace" border="1">
        <tr>
            <th>Database Name (DB)</th>
            <th>Type</th>
            <th>Question Display (Front End)</th>
            <th>Options</th>
        </tr>
        </table>
        <form target="_blank" method="post" action="main.php?test_name=instrument_preview" id="previewform">
            <input type="hidden" name="instrumentdata" id="instrumentdata">
            <input type="hidden" name="instrumentrules" id="instrumentrules">
            <input type="button" id="preview" value="Preview">
        </form>
    </div>
    <h2>Save Instrument</h2>
    <div>

        <form name="saveform" id="saveform">
        Filename: <input type="text" id="filename" value="" />
        Instrument Name: <input type="text" id="longname" value="" />
        <input type="button" onclick="Instrument.validate()" value="Validate" />
        <input type="submit" value="Save" />
        </form>
    </div>
    <h2>Rules (Optional)</h2>
    <div>
        <dl>
            <dt>Question</dt>
            <dd><select id="rule_q"></select></dd>
            <dt>Required if</dt>
            <dd><select id="rule_depends"></select></dd>
            <dl>
                <dt>EITHER Equals any of</dt>
                <dd><select id="rule_values" multiple></select></dd>
                <dt>OR Matches regex</dt>
                <dd><input type="text" id="rule_regex" /></select></dd>
            </dl>

            <dt><br />Error message</dt>
            <dd><input type="text" value="Required" id="rule_message" /></dd>
        </dl>
        <input type="button" onclick="Rules.addNew()" value="Add Rule" />
        <table id="rules_workspace">
            <tr>
                <th>Question</th>
                <th>Required if</th>
                <th>Matches</th>
                <th>Message</th>
            </tr>
        </table>
        <input type="button" onclick="Rules.save()" value="Save Rules" />

    </div>
</div>
</body>
</html>
