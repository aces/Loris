<meta charset="utf-8"/>

{literal}
<style>
.selected {
    background: none;
}
</style>
{/literal}

<script type="application/ecmascript" src="js/FileSaver.min.js"></script>

<div id="message" class="error">&nbsp;</div>
<div class="col-sm-4 hidden-xs">
    <div class="panel panel-primary">
        <div class="panel-heading" onclick="hideLoad();">
            Load Instrument (optional)
            <span class="glyphicon glyphicon-chevron-down pull-right" style="display:none" id="down-load"></span>
            <span class="glyphicon glyphicon-chevron-up pull-right" id="up-load"></span> 
        </div> 
        <div class="panel-body" id="panel-load">
            <input type="file" id="instfile" />
            <br>
            <input class="btn btn-default" type="button" id="load" value="Load Instrument" />
        </div>
    </div>
</div>
<div class="col-xs-12">
    <h2>Create Instrument</h2>
    <form class="form-horizontal" role="form">
        <div class="form-group">
            <label for="selected-input" class="col-sm-2 control-label">Question Type:</label>
            <div class="col-sm-4">
                <div class="btn-group">
                    <button id="selected-input" type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
                        <span id="search_concept">Select One </span>
                        <span class="caret"></span>
                    </button>
                    <ul class="dropdown-menu" role="menu">
                        <li>
                            <div class="col-sm-12"><h5 class="">Information</h5></div>
                        <li>
                            <a id="header" class="option" title="Centered, header information">Header</a>
                        </li>
                        <li>
                            <a id="label" class="option" title="Unemphasized display text">Label</a>
                        </li>
                        <li>
                            <a id="scored" class="option" title="Column which stores calculated data">Scored Field</a>
                        </li>
                        <li class="divider"></li>
                        <li>
                            <div class="col-sm-12"><h5 class="">Data entry</h5></div>
                        <li>
                        <li>
                            <a id="textbox" class="option" title="Text box for user data entry">Textbox</a>
                        </li>
                        <li>
                            <a id="textarea" class="option" title="Larger text area for data entry">Textarea</a>
                        </li>
                        <li>
                            <a id="dropdown" class="option" title="Dropdown menu for users to select data from">Dropdown</a>
                        </li>
                        <li>    
                            <a id="multiselect" class="option" title="Data entry where multiple options may be selected">Multiselect</a>
                        </li>
                        <li>
                            <a id="date" class="option" title="User data entry of a date">Date</a>
                        </li>
                        <li>
                            <a id="numeric" class="option" title="User data entry of a number">Numeric</a>
                        </li>
                        <li class="divider"></li>
                        <li>
                            <div class="col-sm-12"><h5 class="">Formatting</h5></div>
                        <li>
                        <li>
                            <a id="line" class="option" title="Empty line">Blank Line</a>
                        </li>
                        <li>
                            <a id="page-break" class="option" title="Start a new page">Page Break</a>
                        </li>
                </div>
            </div>
        </div>
            <div class="form-group">
                <label class="col-sm-2 control-label">Question Name: </label>
                <div class="col-sm-6">
                    <input class="form-control" type="text" id="questionName" />
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-2 control-label">Question Text: </label>
                <div class="col-sm-6">
                    <input class="form-control" type="text" id="questionText" size="75"/>
                </div>
            </div>

            <!-- Advanced input options -->
            <div id="dropdownoptions" class="options">
                <div class="form-group">
                    <label class="col-sm-2 control-label">Dropdown Option: </label>
                    <div class="col-sm-3">
                        <input class="form-control" type="text" id="newSelectOption">
                    </div>
                    <input class="btn btn-default" type="button" value="Add option" onClick="addDropdownOption();" />
                    <input class="btn btn-default" type="button" value="Reset" onClick="clearDropdownOption()" />
                </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">Preview: </label>
                        <div class="col-sm-2">
                            <select id="selectOptions" class="form-control">
                            </select>
                    </div>
                </div>
            </div>
            <div id="multiselectoptions" class="options">
                <div class="form-group">
                    <label class="col-sm-2 control-label"> Option: </label>
                    <div class="col-sm-3">
                        <input class="form-control" type="text" id="newmultiSelectOption">
                    </div>
                    <input class="btn btn-default" type="button" value="Add option" onClick="addDropdownOption('multi');" />
                    <input class="btn btn-default" type="button" value="Reset" onClick="clearDropdownOption('multi')" />
                </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">Preview: </label>
                        <div class="col-sm-2">
                            <select multiple id="multiselectOptions" class="form-control">
                            </select>
                    </div>
                </div>
            </div>
            <div id="dateoptions" class="options form-group">
                <label class="col-sm-2 control-label">Start year: </label>
                <div class="col-sm-2">
                    <input class="form-control" type="number" id="datemin" min="1900" max="2100">
                </div>
                <label class="col-sm-2 control-label">End year: </label>
                <div class="col-sm-2">
                    <input class="form-control" type="number" id="datemax" min="1900" max="2100">
                </div>
            </div>
            <div id="numericoptions" class="options form-group">
                <label class="col-sm-2 control-label">Min: </label>
                <div class="col-sm-2">
                    <input class="form-control" type="number" id="numericmin">
                </div>
                <label class="col-sm-2 control-label">Max: </label>
                <div class="col-sm-2">
                    <input class="form-control" type="number" id="numericmax">
                </div>
            </div>
        <div class="form-group">
            <div class="col-sm-offset-2 col-sm-10">
                <input class="btn btn-default" type="button" value="Add Row" onClick="addQuestion();" />
            </div>
        </div>
        
        
    </form>
    <div class="table-responsive">
        <table border="1" class="table table-hover table-primary table-bordered">
            <tr class="info">
                <th>Database Name (DB)</th>
                <th>Type</th>
                <th>Question Display (Front End)</th>
                <th>Options</th>
            </tr>
            <tbody id="workspace">
            </tbody>
        </table>
    </div>

    <form target="_blank" method="post" action="main.php?test_name=instrument_preview" id="previewform">
        <input type="hidden" name="instrumentdata" id="instrumentdata">
        <input type="hidden" name="instrumentrules" id="instrumentrules">
        <input class="btn btn-default" type="button" id="preview" value="Preview">
    </form>
    <h2>Save Instrument</h2>

        <form class="form-horizontal" role="form" name="saveform" id="saveform">
            <div class="form-group">
                <label class="col-sm-2 control-label">Filename: </label>
                <div class="col-sm-2">
                    <input class="form-control" type="text" id="filename" value="" />
                </div>
                <label class="col-sm-2 control-label">Instrument Name: </label>
                <div class="col-sm-2">
                    <input class="form-control" type="text" id="longname" value="" />
                </div>
                <input class="btn btn-default" type="button" onclick="Instrument.validate()" value="Validate" />
                <input class="btn btn-default" type="submit" value="Save" />
            </div>
        </form>

    <div class="panel panel-primary">
        <div class="panel-heading" onclick="hideRule();">
            Rules (Optional)
            <span class="glyphicon glyphicon-chevron-down pull-right" id="down-rule"></span>
            <span class="glyphicon glyphicon-chevron-up pull-right" style="display:none" id="up-rule"></span>
        </div> 
        <div class="panel-body" id="panel-rule" style="display:none">
            <p>NOTE THAT THE RULES PORTION OF THE INSTRUMENT BUILDER IS STILL A WORK IN PROGRESS. DO NOT USE THESE UNLESS YOU KNOW WHAT YOU'RE DOING</p>
        
            <form class="form-horizontal" role="form">
                <div class="form-group">
                    <label class="col-sm-2 control-label">Question</label>
                    <div class="col-sm-2">
                        <select id="rule_q" class="form-control"></select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">Required if</label>
                    <div class="col-sm-2">
                        <select id="rule_depends" class="form-control"></select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">EITHER Equals any of</label>
                    <div class="col-sm-2">
                        <select multiple id="rule_values" class="form-control"></select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">OR Matches regex</label>
                    <div class="col-sm-2">
                        <input type="text" id="rule_regex" class="form-control"/>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">Error message</label>
                    <div class="col-sm-2">
                        <input type="text" value="Required" id="rule_message" class="form-control"/>
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-sm-offset-2 col-sm-10">
                        <input class="btn btn-default" type="button" onclick="Rules.addNew()" value="Add Rule" />
                    </div>
                </div>
            </form>
            <div class="table-responsive">
                <table id="rules_workspace" class="table table-hover table-primary table-bordered">
                    <tr class="info">
                        <th>Question</th>
                        <th>Required if</th>
                        <th>Matches</th>
                        <th>Message</th>
                    </tr>
                </table>
            </div>
            <input class="btn btn-default" type="button" onclick="Rules.save()" value="Save Rules" />
        </div>
    </div>
</div>
