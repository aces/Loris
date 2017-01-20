/**
 *  The following file contains the base component for the data query react app.
 *  It also contains the component for the saved queries dropdown.
 *
 *  @author   Jordan Stirling <jstirling91@gmail.com>
 *  @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://github.com/mohadesz/Loris-Trunk
 */

/*
 *  The following component is for saved queries dropdown which appears in the
 *  tab bar of the base component.
 */
SavedQueriesList = React.createClass({
    displayName: "SavedQueriesList",

    getDefaultProps: function () {
        queriesLoaded: false;
    },
    componentDidMount: function () {},
    loadQuery: function (queryName) {
        // Loads in the selected query

        this.props.onSelectQuery(this.props.queryDetails[queryName].Fields, this.props.queryDetails[queryName].Conditions);
    },
    render: function () {
        // Renders the html for the component

        var userSaved = [];
        var globalSaved = [];
        var queryName, curQuery;

        if (this.props.queriesLoaded === false) {
            return React.createElement("div", null);
        }
        // Build the list for the user queries
        for (var i = 0; i < this.props.userQueries.length; i += 1) {
            curQuery = this.props.queryDetails[this.props.userQueries[i]];
            console.log(curQuery.Meta);
            if (curQuery.Meta && curQuery.Meta.name) {
                queryName = curQuery.Meta.name;
            } else {
                queryName = this.props.userQueries[i];
            }
            userSaved.push(React.createElement(
                "li",
                { key: this.props.userQueries[i] },
                React.createElement(
                    "a",
                    { href: "#", onClick: this.loadQuery.bind(this, this.props.userQueries[i]) },
                    queryName
                )
            ));
        }
        // Build the list for the global queries
        for (var i = 0; i < this.props.globalQueries.length; i += 1) {
            curQuery = this.props.queryDetails[this.props.globalQueries[i]];
            console.log(curQuery.Meta);
            if (curQuery.Meta && curQuery.Meta.name) {
                queryName = curQuery.Meta.name;
            } else {
                queryName = this.props.globalQueries[i];
            }
            globalSaved.push(React.createElement(
                "li",
                { key: this.props.globalQueries[i] },
                React.createElement(
                    "a",
                    { href: "#", onClick: this.loadQuery.bind(this, this.props.globalQueries[i]) },
                    queryName
                )
            ));
        }
        return React.createElement(
            "ul",
            { className: "nav nav-tabs navbar-right" },
            React.createElement(
                "li",
                { className: "dropdown" },
                React.createElement(
                    "a",
                    { href: "#", className: "dropdown-toggle", "data-toggle": "dropdown", role: "button", "aria-expanded": "false" },
                    "Load Saved Query ",
                    React.createElement("span", { className: "caret" })
                ),
                React.createElement(
                    "ul",
                    { className: "dropdown-menu", role: "menu" },
                    React.createElement(
                        "li",
                        { role: "presentation", className: "dropdown-header" },
                        "User Saved Queries"
                    ),
                    userSaved,
                    React.createElement(
                        "li",
                        { role: "presentation", className: "dropdown-header" },
                        "Shared Saved Queries"
                    ),
                    globalSaved
                )
            ),
            React.createElement(
                "li",
                { role: "presentation" },
                React.createElement(
                    "a",
                    { href: "#SavedQueriesTab", "data-toggle": "tab" },
                    "Manage Saved Queries"
                )
            )
        );
    }
});

/*
 *  The following component is the data queries base element. It controls which tab is currently
 *  shown, along with keeping the state of the current query being built and running the query.
 */
DataQueryApp = React.createClass({
    displayName: "DataQueryApp",

    componentDidMount: function () {
        // Before the dataquery is loaded into the window, this function is called to gather
        // any data that was not passed in the initial load.

        // The left and right menu items are part of the same menu, but bootstrap considers
        // them two separate ones, so we need to make sure that only one is selected by removing
        // "active" from all the tab classes and only adding it to the really active one
        var domNode = this;
        $(domNode).find('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            $(domNode).find('li').removeClass("active");
            if (e.target) {
                e.target.classList.add("active");
                // Both the <li> tag and the <a> tag should be active
                if (e.target.parentNode) {
                    e.target.parentNode.classList.add("active");
                }
            }
        });

        // Load the save queries' details
        var promises = [];
        var that = this;
        for (var key in this.state.queryIDs) {
            console.log(this.state.queryIDs[key][0]);
            for (var i = 0; i < this.state.queryIDs[key].length; i += 1) {
                var curRequest;
                curRequest = Promise.resolve($.ajax(loris.BaseURL + "/AjaxHelper.php?Module=dataquery&script=GetDoc.php&DocID=" + that.state.queryIDs[key][i]), {
                    data: {
                        DocID: that.state.queryIDs[key][i]
                    },
                    dataType: 'json'
                }).then(function (value) {
                    var queries = that.state.savedQueries;

                    queries[value._id] = value;
                    that.setState({ 'savedQueries': queries });
                });
                promises.push(curRequest);
            }
        }

        var allDone = Promise.all(promises).then(function (value) {
            that.setState({ 'queriesLoaded': true });
        });
        var component = this;
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            component.setState({
                ActiveTab: e.target.getAttribute("href").substr(1)
            });
        });
    },
    saveFilterRule: function (rule) {
        // Used to build a filter rule for saving query

        var savedRule = {
            "field": rule.field,
            "operator": rule.operator,
            "value": rule.value,
            "instrument": rule.instrument,
            "visit": rule.visit
        };
        return savedRule;
    },
    saveFilterGroup: function (group) {
        // Used to build a filter group for saving query

        var savedFilter = {
            "activeOperator": group.activeOperator,
            "children": []
        };
        // Recursively build the filter groups children
        for (var i = 0; i < group.children.length; i++) {
            if (group.children[i].type === "rule") {
                savedFilter.children.push(this.saveFilterRule(group.children[i]));
            } else if (group.children[i].type === "group") {
                savedFilter.children.push(this.saveFilterGroup(group.children[i]));
            }
        }
        return savedFilter;
    },
    saveCurrentQuery: function (name, shared) {
        // Used to save the current query

        var that = this,
            filter = this.saveFilterGroup(this.state.filter);

        $.post(loris.BaseURL + "/AjaxHelper.php?Module=dataquery&script=saveQuery.php", {
            Fields: this.state.selectedFields,
            Filters: filter,
            QueryName: name,
            SharedQuery: shared
        }, function (data) {
            // Once saved, add the query to the list of saved queries
            var id = JSON.parse(data).id,
                queryIDs = that.state.queryIDs;
            if (shared === true) {
                queryIDs.Shared.push(id);
            } else {
                queryIDs.User.push(id);
            }
            $.get(loris.BaseURL + "/AjaxHelper.php?Module=dataquery&script=GetDoc.php&DocID=" + id, function (value) {
                var queries = that.state.savedQueries;

                queries[value._id] = value;
                that.setState({
                    'savedQueries': queries,
                    'queryIDs': queryIDs,
                    alertLoaded: false,
                    alertSaved: true
                });
            });
        });
    },
    getInitialState: function () {
        // Initialize the base state of the dataquery app

        return {
            displayType: 'Cross-sectional',
            fields: [],
            criteria: {},
            sessiondata: {},
            grouplevel: 0,
            queryIDs: this.props.SavedQueries,
            savedQueries: {},
            queriesLoaded: false,
            alertLoaded: false,
            alertSaved: false,
            ActiveTab: 'Info',
            rowData: {},
            filter: {
                type: "group",
                activeOperator: 0,
                children: [{
                    type: "rule"
                }],
                session: this.props.AllSessions
            },
            selectedFields: {},
            downloadableFields: {},
            loading: false
        };
    },
    loadFilterRule: function (rule) {
        // Used to load in a filter rule

        var script;
        if (!rule.type) {
            rule.type = "rule";
        }

        // Get given fields of the instrument for the rule.
        // This call is made synchronously
        $.ajax({
            url: loris.BaseURL + "/AjaxHelper.php?Module=dataquery&script=datadictionary.php",
            success: function (data) {
                rule.fields = data;
            },
            async: false,
            data: { category: rule.instrument },
            dataType: 'json'
        });

        // Find the rules selected field's data type
        for (var i = 0; i < rule.fields.length; i++) {
            if (rule.fields[i].key[1] === rule.field) {
                rule.fieldType = rule.fields[i].value.Type;
                break;
            }
        }

        // Get the sessions which meet the rules criterias.
        // TODO:    Build the sessions in the new format
        switch (rule.operator) {
            case "equal":
                script = "queryEqual.php";
                break;
            case "notEqual":
                script = "queryNotEqual.php";
                break;
            case "lessThanEqual":
                script = "queryLessThanEqual.php";
                break;
            case "greaterThanEqual":
                script = "queryGreaterThanEqual.php";
                break;
            case "startsWith":
                script = "queryStartsWith.php";
                break;
            case "contains":
                script = "queryContains.php";
                break;
            default:
                break;
        }
        $.ajax({
            url: loris.BaseURL + "/AjaxHelper.php?Module=dataquery&script=" + script,
            success: function (data) {
                var i,
                    allSessions = {},
                    allCandiates = {};
                // Loop through data and divide into individual visits with unique PSCIDs
                // storing a master list of unique PSCIDs
                for (i = 0; i < data.length; i++) {
                    if (!allSessions[data[i][1]]) {
                        allSessions[data[i][1]] = [];
                    }
                    allSessions[data[i][1]].push(data[i][0]);
                    if (!allCandiates[data[i][0]]) {
                        allCandiates[data[i][0]] = [];
                    }
                    allCandiates[data[i][0]].push(data[i][1]);
                }
                rule.candidates = {
                    "allCandiates": allCandiates,
                    "allSessions": allSessions
                };
                if (rule.visit == "All") {
                    rule.session = Object.keys(allCandiates);
                } else {
                    if (allSessions[rule.visit]) {
                        rule.session = allSessions[rule.visit];
                    } else {
                        rule.session = [];
                    }
                }
            },
            async: false,
            data: {
                category: rule.instrument,
                field: rule.field,
                value: rule.value
            },
            dataType: 'json'
        });

        return rule;
    },
    loadFilterGroup: function (group) {
        // Used to load in a filter group

        // Recursively load the children on the group
        for (var i = 0; i < group.children.length; i++) {
            if (group.children[i].activeOperator) {
                if (!group.children[i].type) {
                    group.children[i].type = "group";
                }
                group.children[i] = this.loadFilterGroup(group.children[i]);
            } else {
                group.children[i] = this.loadFilterRule(group.children[i]);
            }
        }
        group.session = getSessions(group);
        return group;
    },
    loadSavedQuery: function (fields, criteria) {
        // Used to load a saved query

        var filterState = {},
            selectedFields = {},
            fieldsList = [];
        this.setState({ "loading": true });
        if (Array.isArray(criteria)) {
            // This is used to load a query that is saved in the old format
            // so translate it into the new format, grouping the given critiras
            // into a filter group

            filterState = {
                type: "group",
                activeOperator: 0,
                children: []
            };
            filterState.children = criteria.map(function (item) {
                var fieldInfo = item.Field.split(",");
                rule = {
                    "instrument": fieldInfo[0],
                    "field": fieldInfo[1],
                    "value": item.Value,
                    "type": "rule",
                    "visit": "All"
                };
                switch (item.Operator) {
                    case "=":
                        rule.operator = "equal";
                        break;
                    case "!=":
                        rule.operator = "notEqual";
                        break;
                    case "<=":
                        rule.operator = "lessThanEqual";
                        break;
                    case ">=":
                        rule.operator = "greaterThanEqual";
                        break;
                    default:
                        rule.operator = item.Operator;
                        break;
                }
                return rule;
            });

            var fieldSplit;
            fieldsList = fields;
            for (var i = 0; i < fields.length; i++) {
                fieldSplit = fields[i].split(",");
                if (!selectedFields[fieldSplit[0]]) {
                    selectedFields[fieldSplit[0]] = {};
                    selectedFields[fieldSplit[0]][fieldSplit[1]] = {};
                    selectedFields[fieldSplit[0]].allVisits = {};
                    for (var key in this.props.Visits) {
                        selectedFields[fieldSplit[0]].allVisits[key] = 1;
                        selectedFields[fieldSplit[0]][fieldSplit[1]][key] = [key];
                    }
                } else {
                    selectedFields[fieldSplit[0]][fieldSplit[1]] = {};
                    for (var key in this.props.Visits) {
                        selectedFields[fieldSplit[0]].allVisits[key]++;
                        selectedFields[fieldSplit[0]][fieldSplit[1]][key] = [key];
                    }
                }
            }
        } else {
            // Query was saved in the new format
            filterState = criteria;
            selectedFields = fields;
            for (var instrument in fields) {
                for (var field in fields[instrument]) {
                    if (field === "allVisits") {
                        continue;
                    } else {
                        fieldsList.push(instrument + "," + field);
                    }
                }
            }
        }
        if (filterState.children && filterState.children.length > 0) {
            filterState = this.loadFilterGroup(filterState);
        } else {
            filterState.children = [{
                type: "rule"
            }];
            filterState.session = this.props.AllSessions;
        }
        this.setState(function (state) {
            return {
                fields: fieldsList,
                selectedFields: selectedFields,
                filter: filterState,
                alertLoaded: true,
                alertSaved: false,
                loading: false
            };
        });
    },
    fieldVisitSelect: function (action, visit, field) {
        // Used to select visits for a given field

        this.setState(function (state) {
            var temp = state.selectedFields[field.instrument];
            if (action === "check") {
                // Adding a new visit for field, add visit to field and
                // increase count of visit in allVisits
                temp[field.field][visit] = visit;
                if (temp.allVisits[visit]) {
                    temp.allVisits[visit]++;
                } else {
                    temp.allVisits[visit] = 1;
                }
            } else {
                // Removing visit, delete visit from field
                delete temp[field.field][visit];
                if (temp.allVisits[visit] === 1) {
                    // If visit count in allVisits is 1 delete visit from
                    // allVisits
                    delete temp.allVisits[visit];
                } else {
                    // Else decrement count of visit in allVisists
                    temp.allVisits[visit]--;
                }
            }
            return temp;
        });
    },
    fieldChange: function (fieldName, category, downloadable) {
        // Used to add and remove fields from the current query being built

        var that = this;
        this.setState(function (state) {
            var selectedFields = state.selectedFields,
                fields = state.fields.slice(0);
            if (!selectedFields[category]) {
                // The given category has no selected fields, add the category to the selectedFields
                selectedFields[category] = {};
                // Add all visits to the givin field for the given category
                selectedFields[category][fieldName] = JSON.parse(JSON.stringify(that.props.Visits));
                // Add all visits to the given category, initalizing their counts to 1
                selectedFields[category].allVisits = {};
                for (var key in that.props.Visits) {
                    selectedFields[category].allVisits[key] = 1;
                }

                // Add field to the field list
                fields.push(category + "," + fieldName);

                if (downloadable) {
                    // If the field is downloadable add to the list of downloadable fields
                    state.downloadableFields[category + "," + fieldName] = true;
                }
            } else if (selectedFields[category][fieldName]) {
                // Remove the field from the selectedFields
                for (var key in selectedFields[category][fieldName]) {
                    // Decrement the count of field's visits, delete visit if count is 1
                    if (selectedFields[category].allVisits[key] === 1) {
                        delete selectedFields[category].allVisits[key];
                    } else {
                        selectedFields[category].allVisits[key]--;
                    }
                }
                delete selectedFields[category][fieldName];

                // Find the given field in the fields list and remove it
                var idx = fields.indexOf(category + "," + fieldName);
                fields.splice(idx, 1);

                if (Object.keys(selectedFields[category]).length === 1) {
                    // If no more fields left for category, delete category from
                    // selectedFields
                    delete selectedFields[category];
                }

                if (downloadable) {
                    // If the field was downloadable, delete it from the downloadable list
                    delete state.downloadableFields[category + "," + fieldName];
                }
            } else {
                // The category already has fields but not the desired one, add it
                if (!selectedFields[category][fieldName]) {
                    selectedFields[category][fieldName] = {};
                }

                // Increment the visit count for the visit, setting it to 1 if doesn't exist
                for (var key in selectedFields[category].allVisits) {
                    if (key == "allVisits") {
                        continue;
                    }
                    selectedFields[category].allVisits[key]++;
                    selectedFields[category][fieldName][key] = key;
                }
                fields.push(category + "," + fieldName);
                if (downloadable) {
                    // If the field is downloadable add to the list of downloadable fields
                    state.downloadableFields[category + "," + fieldName] = true;
                }
            }
            return {
                selectedFields: selectedFields,
                fields: fields
            };
        });
    },
    getSessions: function () {
        // Get the sessions to be selected

        if (this.state.filter.children.length > 0) {
            // If filter exists return filter sessions
            return this.state.filter.session;
        } else {
            // Else return all sessions
            return this.props.AllSessions;
        }
    },
    runQuery: function (fields, sessions) {
        // Run the current query

        var DocTypes = [],
            that = this,
            semaphore = 0,
            sectionedSessions,
            ajaxComplete = function () {
            // Wait until all ajax calls have completed before computing the rowdata
            if (semaphore == 0) {
                var rowdata = that.getRowData(that.state.grouplevel);
                that.setState({
                    'rowData': rowdata,
                    "loading": false
                });
            }
        };

        // Reset the rowData and sessiondata
        this.setState({
            "rowData": {},
            "sessiondata": {},
            "loading": true
        });

        // Get list of DocTypes to be retrieved
        for (var i = 0; i < fields.length; i += 1) {
            var field_split = fields[i].split(",");
            var category = field_split[0];

            // Check if the current category has already been queried, if so skip
            if (DocTypes.indexOf(category) === -1) {
                var sessionInfo = [];

                // Build the session data to be queried for the given category
                for (var j = 0; j < this.state.filter.session.length; j++) {
                    if (Array.isArray(this.state.filter.session[j])) {
                        if (this.state.selectedFields[category].allVisits[this.state.filter.session[j][1]]) {
                            sessionInfo.push(this.state.filter.session[j]);
                        }
                    } else {
                        for (var key in this.state.selectedFields[category].allVisits) {
                            var temp = [];

                            temp.push(this.state.filter.session[j]);
                            // Add the visit to the temp variable then add to the sessions to be queried
                            temp.push(key);
                            sessionInfo.push(temp);
                        }
                    }
                }

                DocTypes.push(category);
                // keep track of the number of requests waiting for a response
                semaphore++;
                sectionedSessions = JSON.stringify(sessionInfo);
                $.ajax({
                    type: "POST",
                    url: loris.BaseURL + "/AjaxHelper.php?Module=dataquery&script=retrieveCategoryDocs.php",
                    data: {
                        DocType: category,
                        Sessions: sectionedSessions
                    },
                    dataType: 'text',
                    success: function (data) {
                        if (data) {
                            var i,
                                row,
                                rows,
                                identifier,
                                sessiondata = that.state.sessiondata;
                            data = JSON.parse(data);
                            rows = data.rows;
                            for (i = 0; i < rows.length; i += 1) {
                                /*
                                 * each row is a JSON object of the
                                 * form:
                                 * {
                                 *  "key" : [category, pscid, vl],
                                 *  "value" : [pscid, vl],
                                 *  "doc": {
                                 *      Meta: { stuff }
                                 *      data: { "FieldName" : "Value", .. }
                                 * }
                                 */
                                row = rows[i];
                                identifier = row.value;
                                if (!sessiondata.hasOwnProperty(identifier)) {
                                    sessiondata[identifier] = {};
                                }

                                sessiondata[identifier][row.key[0]] = row.doc;
                            }
                            that.setState({ 'sessiondata': sessiondata });
                        }
                        console.log("Received data");
                        semaphore--;
                        ajaxComplete();
                    }
                });
            }
        }
    },
    getRowData: function (displayID) {
        // Build the queried data to be displayed in the data table

        var sessiondata = this.state.sessiondata;
        var sessions = this.getSessions();
        var fields = this.state.fields.sort();
        var downloadableFields = this.state.downloadableFields;
        var i, j;
        var rowdata = [];
        var currow = [];
        var Identifiers = [];
        var RowHeaders = [];
        var fileData = [];
        var href;

        if (displayID === 0) {
            // Displaying the data in the cross-sectional way

            // Add the fields as the tables headers
            for (i = 0; fields && i < fields.length; i += 1) {
                RowHeaders.push(fields[i]);
            }

            // Build the table rows, using the session data as the row identifier
            for (var session in sessiondata) {
                currow = [];
                for (i = 0; fields && i < fields.length; i += 1) {
                    var fieldSplit = fields[i].split(",");
                    currow[i] = '.';
                    var sd = sessiondata[session];
                    if (sd[fieldSplit[0]] && sd[fieldSplit[0]].data[fieldSplit[1]] && downloadableFields[fields[i]]) {
                        // If the current field has data and is downloadable, create a download link
                        href = loris.BaseURL + "/mri/jiv/get_file.php?file=" + sd[fieldSplit[0]].data[fieldSplit[1]];
                        currow[i] = React.createElement(
                            "a",
                            { href: href },
                            sd[fieldSplit[0]].data[fieldSplit[1]]
                        );
                        fileData.push("file/" + sd[fieldSplit[0]]._id + "/" + encodeURIComponent(sd[fieldSplit[0]].data[fieldSplit[1]]));
                    } else if (sd[fieldSplit[0]]) {
                        // else if field is not null add data and string
                        currow[i] = sd[fieldSplit[0]].data[fieldSplit[1]];
                    }
                }
                rowdata.push(currow);
                Identifiers.push(session);
            }
        } else {
            // Displaying the data in the longitudinal way

            var Visits = {},
                visit,
                identifier,
                temp,
                colHeader,
                index,
                instrument,
                fieldSplit;

            // Loop trough session data building the row identifiers and desired visits
            for (var session in sessiondata) {
                sessiondata[session.toUpperCase()] = sessiondata[session];
                delete session[session];
                temp = session.split(',');
                visit = temp[1].toUpperCase();
                if (!Visits[visit]) {
                    Visits[visit] = true;
                }
                identifier = temp[0].toUpperCase();
                if (Identifiers.indexOf(identifier) === -1) {
                    Identifiers.push(identifier);
                }
            }

            // Loop through the desired fields, adding a row header for each visit if it
            // has been selected in the build phase
            for (i = 0; fields && i < fields.length; i += 1) {
                for (visit in Visits) {
                    temp = fields[i].split(",");
                    instrument = this.state.selectedFields[temp[0]];
                    if (instrument && instrument[temp[1]] && instrument[temp[1]][visit]) {
                        RowHeaders.push(visit + ' ' + fields[i]);
                    }
                }
            }

            // Build the row data for the giving identifiers and headers
            for (identifier in Identifiers) {
                currow = [];
                for (colHeader in RowHeaders) {
                    temp = Identifiers[identifier] + ',' + RowHeaders[colHeader].split(' ')[0];
                    index = sessiondata[temp];
                    if (!index) {
                        currow.push(".");
                    } else {
                        temp = index[RowHeaders[colHeader].split(',')[0].split(' ')[1]];
                        fieldSplit = RowHeaders[colHeader].split(' ')[1].split(",");
                        if (temp) {
                            if (temp.data[RowHeaders[colHeader].split(',')[1]] && downloadableFields[fieldSplit[0] + ',' + fieldSplit[1]]) {
                                // Add a downloadable link if the field is set and downloadable
                                href = loris.BaseURL + "/mri/jiv/get_file.php?file=" + temp.data[RowHeaders[colHeader].split(',')[1]];
                                temp = React.createElement(
                                    "a",
                                    { href: href },
                                    temp.data[RowHeaders[colHeader].split(',')[1]]
                                );
                            } else {
                                temp = temp.data[RowHeaders[colHeader].split(',')[1]];
                            }
                        } else {
                            temp = '.';
                        }
                        currow.push(temp);
                    }
                }
                rowdata.push(currow);
            }
        }
        return { 'rowdata': rowdata, 'Identifiers': Identifiers, 'RowHeaders': RowHeaders, 'fileData': fileData };
    },
    dismissAlert: function () {
        // Used to dismiss alerts
        this.setState({
            alertLoaded: false,
            alertSaved: false
        });
    },
    resetQuery: function () {
        // Used to reset the current query
        this.setState({
            fields: [],
            criteria: {},
            selectedFields: {}
        });
    },
    changeDataDisplay: function (displayID) {
        // Change the display format of the data table
        var rowdata = this.getRowData(displayID);
        this.setState({
            grouplevel: displayID,
            rowData: rowdata
        });
    },
    updateFilter: function (filter) {
        // Update the filter
        var that = this;
        this.setState(function (state) {
            if (filter.children.length === 0) {
                filter.session = that.props.AllSessions;
            }
            return { 'filter': filter };
        });
    },
    render: function () {
        // Renders the html for the component

        var tabs = [],
            tabsNav = [],
            alert = React.createElement("div", null);

        // Add the info tab
        tabs.push(React.createElement(InfoTabPane, {
            TabId: "Info",
            UpdatedTime: this.props.UpdatedTime,
            Loading: this.state.loading
        }));

        // Add the field select tab
        tabs.push(React.createElement(FieldSelectTabPane, {
            TabId: "DefineFields",
            categories: this.props.categories,
            onFieldChange: this.fieldChange,
            selectedFields: this.state.selectedFields,
            Visits: this.props.Visits,
            fieldVisitSelect: this.fieldVisitSelect,
            Loading: this.state.loading
        }));

        // Add the filter builder tab
        tabs.push(React.createElement(FilterSelectTabPane, {
            TabId: "DefineFilters",
            categories: this.props.categories,
            filter: this.state.filter,
            updateFilter: this.updateFilter,
            Visits: this.props.Visits,
            Loading: this.state.loading
        }));

        // Define the data displayed type and add the view data tab
        var displayType = this.state.grouplevel === 0 ? "Cross-sectional" : "Longitudinal";
        tabs.push(React.createElement(ViewDataTabPane, {
            TabId: "ViewData",
            Fields: this.state.fields,
            Criteria: this.state.criteria,
            Sessions: this.getSessions(),
            Data: this.state.rowData.rowdata,
            RowInfo: this.state.rowData.Identifiers,
            RowHeaders: this.state.rowData.RowHeaders,
            FileData: this.state.rowData.fileData,
            onRunQueryClicked: this.runQuery,
            displayType: displayType,
            changeDataDisplay: this.changeDataDisplay,
            Loading: this.state.loading
        }));

        // Add the stats tab
        tabs.push(React.createElement(StatsVisualizationTabPane, {
            TabId: "Statistics",
            Fields: this.state.rowData.RowHeaders,
            Data: this.state.rowData.rowdata,
            Loading: this.state.loading
        }));

        // Add the manage saved queries tab
        tabs.push(React.createElement(ManageSavedQueriesTabPane, { TabId: "SavedQueriesTab",
            userQueries: this.state.queryIDs.User,
            globalQueries: this.state.queryIDs.Shared,
            onSaveQuery: this.saveCurrentQuery,
            queryDetails: this.state.savedQueries,
            queriesLoaded: this.state.queriesLoaded,
            Loading: this.state.loading
        }));

        // Display load alert if alert is present
        if (this.state.alertLoaded) {
            alert = React.createElement(
                "div",
                { className: "alert alert-success", role: "alert" },
                React.createElement(
                    "button",
                    { type: "button", className: "close", "aria-label": "Close", onClick: this.dismissAlert },
                    React.createElement(
                        "span",
                        { "aria-hidden": "true" },
                        "×"
                    )
                ),
                React.createElement(
                    "strong",
                    null,
                    "Success"
                ),
                " Query Loaded."
            );
        }

        // Display save alert if alert is present
        if (this.state.alertSaved) {
            alert = React.createElement(
                "div",
                { className: "alert alert-success", role: "alert" },
                React.createElement(
                    "button",
                    { type: "button", className: "close", "aria-label": "Close", onClick: this.dismissAlert },
                    React.createElement(
                        "span",
                        { "aria-hidden": "true" },
                        "×"
                    )
                ),
                React.createElement(
                    "strong",
                    null,
                    "Success"
                ),
                " Query Saved."
            );
        }
        var widthClass = "col-md-12";
        var sideBar = React.createElement("div", null);

        // Display the field sidebar for certain tabs
        if (this.state.fields.length > 0 && this.state.ActiveTab !== 'ViewData' && this.state.ActiveTab !== 'Statistics' && this.state.ActiveTab !== 'Info') {
            widthClass = "col-md-10";
            sideBar = React.createElement(
                "div",
                { className: "col-md-2" },
                React.createElement(FieldsSidebar, {
                    Fields: this.state.fields,
                    Criteria: this.state.criteria,
                    resetQuery: this.resetQuery
                })
            );
        }
        return React.createElement(
            "div",
            null,
            alert,
            React.createElement(
                "div",
                { className: widthClass },
                React.createElement(
                    "nav",
                    { className: "nav nav-tabs" },
                    React.createElement(
                        "ul",
                        { className: "nav nav-tabs navbar-left", "data-tabs": "tabs" },
                        React.createElement(
                            "li",
                            { role: "presentation", className: "active" },
                            React.createElement(
                                "a",
                                { href: "#Info", "data-toggle": "tab" },
                                "Info"
                            )
                        ),
                        React.createElement(
                            "li",
                            { role: "presentation" },
                            React.createElement(
                                "a",
                                { href: "#DefineFields", "data-toggle": "tab" },
                                "Define Fields"
                            )
                        ),
                        React.createElement(
                            "li",
                            { role: "presentation" },
                            React.createElement(
                                "a",
                                { href: "#DefineFilters", "data-toggle": "tab" },
                                "Define Filters"
                            )
                        ),
                        React.createElement(
                            "li",
                            { role: "presentation" },
                            React.createElement(
                                "a",
                                { href: "#ViewData", "data-toggle": "tab" },
                                "View Data"
                            )
                        ),
                        React.createElement(
                            "li",
                            { role: "presentation" },
                            React.createElement(
                                "a",
                                { href: "#Statistics", "data-toggle": "tab" },
                                "Statistical Analysis"
                            )
                        )
                    ),
                    React.createElement(SavedQueriesList, {
                        userQueries: this.state.queryIDs.User,
                        globalQueries: this.state.queryIDs.Shared,
                        queryDetails: this.state.savedQueries,
                        queriesLoaded: this.state.queriesLoaded,
                        onSelectQuery: this.loadSavedQuery,
                        loadedQuery: this.state.loadedQuery
                    })
                ),
                React.createElement(
                    "div",
                    { className: "tab-content" },
                    tabs
                )
            ),
            sideBar
        );
    }
});

RDataQueryApp = React.createFactory(DataQueryApp);
