<script src="GetJS.php?Module=dataquery&file=jquery.dataTables.min.js"></script>
<script src="GetJS.php?Module=dataquery&file=user.js"></script>
<script src="GetJS.php?Module=dataquery&file=array_tools.js"></script>
<script src="GetJS.php?Module=dataquery&file=categories.js"></script>
<script src="GetJS.php?Module=dataquery&file=query.js"></script>
<script src="GetJS.php?Module=dataquery&file=ui.js"></script>
<div id="logged_in" class="section">
    <div id="tabs">
        <ul>
            <li><a href="#Home">Home</a></li>
            <li><a href="#DefineFields">Define Fields</a></li>
            <li><a href="#DefinePopulation">Define Filters</a></li>
            <li><a href="#ViewData">View Data</a></li>
            <li><a href="#AnalyseData">Statistical Analysis</a></li>
        </ul>
        <div id="Home" class="ui-widget-reset ui-widget">
            <div id="DeleteDialog">
                Are you really sure you want to delete <span id="deletequery">undefined</span>
            </div>
            <p>Welcome, <span id="username">{$username}</span></p>
            <p>Data was last updated on <span id="updatetime">{$updatetime}</span></p>
            <p>You have saved the following queries:
                <table id="savedqueries" width="100%">
                    <thead>
                        <th>Actions</th>
                        <th>Name</th>
                        <th>Fields</th>
                        <th>Filters</th>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </p>
        </div>
        <div id="DefineFields" class="ui-widget-reset ui-widget">
            <div class="half" style="overflow: scroll;">
                <div class="ui-widget-header">
                    Choose category:
                    <select id="categories" onChange="javascript:Categories.show(this.value, 'fieldslist', { selectedManager: defineManager})";></select> <button id="addAll">Add all</button> <button id="removeAll">Remove all</button>
                    <!--a href="help" class="ui-icon ui-icon-help">Help</a-->
                </div>
                <table class="fieldlist" id="fields" width="100%">
                    <thead>
                        <tr>
                            <th>Field</th>
                            <th>Description</th>
                            <th>Downloadable File</th>
                        </tr>
                    </thead>
                    <tbody id="fieldslist">
                    </tbody>
                </table>
            </div>
            <div class="half" style="overflow: scroll">
                <h2>Selected Fields</h2>
                <table width="100%">
                    <thead>
                        <tr>
                            <th>Actions</th>
                            <th>Field</th>
                            <th>Description</th>
                            <th>Downloadable File</th>
                        </tr>
                    </thead>
                    <tbody id="selectedfields">
                    </tbody>
                </table>
            </div>
        </div>
        <div id="DefinePopulation">
            <div class="half" style="overflow: scroll;">
                <div class="ui-widget-header .ui-corner-all">
                    Choose category: <select id="categories_pop" onChange="javascript:Categories.show(this.value, 'popfieldslist', { selectedManager: popManager })";></select> 
                </div>

                <table class="fieldlist" id="popfields" width="100%">
                    <thead>
                        <tr>
                            <th>Field</th>
                            <th>Description</th>
                            <th>Downloadable File</th>
                        </tr>
                    </thead>
                    <tbody id="popfieldslist">
                    </tbody>
                </table>
            </div>
            <div class="half" style="overflow: scroll">
                <h2>Selected Filters</h2>
                <p>After choosing the fields to use as filters in the frame above, specify the criteria you would
                like to have them match below.</p>
                <table width="100%">
                    <thead>
                        <tr>
                            <th>Actions</th>
                            <th>Field</th>
                            <th>Operator</th>
                            <th>Value</th>
                            <th>Sessions Matching</th>
                        </tr>
                    </thead>
                    <tbody id="selectedpopfields">
                    </tbody>
                </table>
                <div id="popfieldslist"></div>
                <div>
                    Sessions matching all filters: <div id="current_sessions"></div>
                </div>
                <h3>OR</h3>
                <p>You can upload a CSV of the sessions that you would like to retrieve the data for by selecting a file below.</p>
                <input id="UploadPopulation" type="file" />
            </div>
        </div>
        <div id="ViewData">
            <div id="SaveDialog">
                Enter the name you would like to save this query under:
                <form id="SaveDialogForm">
                <div>
                    <ul>
                        <li>Save fields: <input type="checkbox" checked="checked" /></li>
                        <li>Save filters: <input type="checkbox" checked="checked" /></li>
                    </ul>
                </div>
                    <div>
                    Name:<input type="text" id="SaveDialogName" />
                </div>
                <div id="SaveDialogError" class="error">
                </div>
                </form>

            </div>
            <h2>Actions</h2>
            <div>
                <button id="runquery" class="databutton">Run Query</button>
                <button id="SaveQuery" class="databutton">Save Query</button>
            </div>
            <div>
                <button id="SaveCSV" class="databutton">Download Table as CSV</button>
                <button id="SaveZip" class="databutton">Download All Files as ZIP</button>
                <!-- Don't display the below link, it's just used to tie a dataURL to
                which is then invoked/clicked via javascript when the above buttons are
                clicked -->
                <a download="download" id="DownloadLink" style="display: none">Download link</a>
            </div>

            <div id="progress"></div>
            <div id="downloadlinks" style="display: none">
                <p>NOTE: Due to Chrome's security features. Downloading of the following packages can not be started automatically. Please click the following links manually. Sorry :( :</p>
                   <ul id="downloadlinksUL">
                   </ul>
            </div>
            <h2>Data</h2>
            <div>
                <label for="group_level" id="GroupString">Number of identifier pieces to transpose to columns: </label><select id="group_level"></select>
            </div>
            <table id="data" border="1">
                <thead><tr><th>Identifier</th></tr></thead>
                <tbody>
                </tbody>
            </table>
        </div>
        <div id="AnalyseData">
            <button id="CalculateStats">Calculate statistics</button>
            <h2>Basic Statistics</h2>
            <table id="stats" border="1">
                <thead>
                    <tr>
                        <th>Measure</th>
                        <th>Min</th>
                        <th>Max</th>
                        <th>Standard Deviation</th>
                        <th>Mean</th>
                        <th>Mean Deviation</th>
                        <th>Mean Squared Error</th>
                        <th>First Quartile</th>
                        <th>Second Quartile</th>
                        <th>Third Quartile</th>
                    </tr>
                </thead>
                <tbody>
                    </tr>
                </tbody>
            </table>

            <h2>Histogram of Selected Numeric Columns</h2>
            <div>
                <p>Click on a row in the above table of statistics to add a field to this histogram graph</p>
                Show normals: <input type="checkbox" id="shownormals">
            </div>
            <div id="plotdiv" style="width: 500px; height: 500px"></div>

            <h2>Relationship Between Numeric Columns</h2>
            <div>
                Field for X Axis: <select id="scatter-xaxis"></select>
                Field for Y Axis: <select id="scatter-yaxis"></select>

                Group Points by: <select id="scatter-group"></select>
                <h3>Scatterplot</h3>
                <div id="scatterplotdiv" style="width: 500px; height: 500px"></div>
                <h3>Statistics</h3>
                <table id="correlationtbl">
                    <thead>
                        <tr>
                            <th>Covariance</th>
                            <th>Correlation Coefficient</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
