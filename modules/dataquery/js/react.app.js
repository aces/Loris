SavedQueriesList = React.createClass({displayName: 'SavedQueriesList',
    getDefaultProps: function() {
        queriesLoaded: false
    },
    componentDidMount: function() {
    },
    loadQuery: function(queryName) {
        var that = this;
        return function() {
            $.getJSON("AjaxHelper.php?Module=dataquery&script=GetDoc.php", { DocID: queryName},
            function(data) {
                if(that.props.onSelectQuery) {
                    that.props.onSelectQuery(data.Fields, data.Conditions);
                }
            }
            );
        }
    },
    render: function() {
        var userSaved = [];
        var globalSaved = [];
        var queryName, curQuery;

        if(this.props.queriesLoaded === false) {
            return React.createElement("div", null);
        }
        for(var i = 0; i < this.props.userQueries.length; i += 1) {
            curQuery = this.props.queryDetails[this.props.userQueries[i]];
            console.log(curQuery.Meta);
            if(curQuery.Meta && curQuery.Meta.name) {
                queryName = curQuery.Meta.name;
            } else {
                queryName = this.props.userQueries[i];
            }
            userSaved.push(React.createElement("li", {key: this.props.userQueries[i]}, React.createElement("a", {href: "#", onClick: this.loadQuery(this.props.userQueries[i])}, queryName)));
        }
        for(var i = 0; i < this.props.globalQueries.length; i += 1) {
            globalSaved.push(React.createElement("li", {key: this.props.globalQueries[i]}, React.createElement("a", {href: "#"}, this.props.globalQueries[i])));
        }
        return (
             React.createElement("ul", {className: "nav nav-tabs navbar-right"}, 
                 React.createElement("li", {className: "dropdown"}, 
                     React.createElement("a", {href: "#", className: "dropdown-toggle", 'data-toggle': "dropdown", role: "button", 'aria-expanded': "false"}, "Load Saved Query ", React.createElement("span", {className: "caret"})), 
                     React.createElement("ul", {className: "dropdown-menu", role: "menu"}, 
                        React.createElement("li", {role: "presentation", className: "dropdown-header"}, "User Saved Queries"), 
                        userSaved, 
                        React.createElement("li", {role: "presentation", className: "dropdown-header"}, "Shared Saved Queries"), 
                        globalSaved
                     )
                 ), 
                 React.createElement("li", {role: "presentation"}, React.createElement("a", {href: "#SavedQueriesTab", 'data-toggle': "tab"}, "Manage Saved Queries"))
             )
            );
    }
});
DataQueryApp = React.createClass({displayName: 'DataQueryApp',
    componentDidMount: function() {
        // The left and right menu items are part of the same menu, but bootstrap considers
        // them two separate ones, so we need to make sure that only one is selected by removing
        // "active" from all the tab classes and only adding it to the really active one
        var domNode = this.getDOMNode();
        $(domNode).find('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
            $(domNode).find('li').removeClass("active");
            if(e.target) {
                e.target.classList.add("active");
                // Both the <li> tag and the <a> tag should be active
                if(e.target.parentNode) {
                    e.target.parentNode.classList.add("active");
                }
            }
        });

        // Load the save queries' details
        var promises = [];
        var that = this;
        for (var i = 0; i < this.props.SavedQueries.User.length; i += 1) {
            var curRequest;
            curRequest = Promise.resolve(
                    $.ajax("AjaxHelper.php?Module=dataquery&script=GetDoc.php&DocID=" + that.props.SavedQueries.User[i]), {
                        data: {
                            DocID: that.props.SavedQueries.User[i]
                        },
                        dataType: 'json'
                    }).then(function(value) {
                        var queries = that.state.savedQueries;

                        queries[value._id] = value;
                        that.setState({ 'savedQueries' : queries});
                    });
            promises.push(curRequest);
        }

        var allDone = Promise.all(promises).then(function(value) {
            that.setState({ 'queriesLoaded' : true });

        });
    },
    saveCurrentQuery: function(name, shared) {
        $.post("AjaxHelper.php?Module=dataquery&script=saveQuery.php",
            {
                Fields: this.state.fields,
                Filters: this.state.criteria,
                QueryName: name,
                SharedQuery: shared,
            }, function(data) {
            });

    },
    getInitialState: function() {
        return {
            fields: [],
            criteria: {},
            sessiondata: {},
            grouplevel: 0,
            savedQueries: {},
            queriesLoaded: false
        };
    },
    loadSavedQuery: function (fields, criteria) {
        var criteriaState = {};
        for(var i = 0; i < criteria.length; i +=1 ) {
            var critObj = criteria[i];

            criteriaState[critObj.Field] = {
                "operator" : critObj.Operator,
                "value"    : critObj.Value
            }
        }
        this.setState({
            fields: fields,
            criteria: criteriaState
        });
    },
    fieldChange: function(changeType, fieldName) {
        var fields = this.state.fields;
        var idx = fields.indexOf(fieldName);
        if (changeType === 'add') {
            if(idx === -1) {
                fields.push(fieldName);
            }
        } else if (changeType === 'remove') {
            if(idx > -1) {
                fields.splice(idx, 1);
            }
        }
        this.setState({ fields: fields });
    },
    criteriaFieldChange: function(changeType, fieldName) {
        var fields = this.state.criteria;
        if(changeType === 'add') {
            fields[fieldName] = {
                "operator" : '=',
                'value'    : ''
            }
        } else if(changeType === 'remove') {
            delete fields[fieldName];
        }
        this.setState({ criteria: fields });
    },
    criteriaChange: function(fieldName, criteriaItem) {
        var criteria = this.state.criteria;
        var fieldArray = fieldName.split(",");
        var that = this;
        var responseHandler = function(data) {
            var state = that.state.criteria,
                cstate = state[fieldName];

            cstate.sessions = data;
            state[fieldName] = cstate;

            that.setState(state);
        };
        criteria[fieldName] = criteriaItem;
        this.setState({ criteria: criteria} );

        var ajaxRetrieve = function(script) {
            $.get("AjaxHelper.php?Module=dataquery&script=" + script,
                  {
                    category: fieldArray[0],
                    field: fieldArray[1],
                    value: criteriaItem.value
                  },
                  responseHandler,
                  'json'
            );
        };
        if (criteriaItem.operator === '=') {
            ajaxRetrieve("queryEqual.php");
        } else if (criteriaItem.operator === '!=') {
            ajaxRetrieve("queryNotEqual.php");
        } else if (criteriaItem.operator === '<=') {
            ajaxRetrieve("queryLessThanEqual.php");
        } else if (criteriaItem.operator === '>=') {
            ajaxRetrieve("queryGreaterThanEqual.php");
        } else if (criteriaItem.operator === 'startsWith') {
            ajaxRetrieve("queryStartsWith.php");
        } else if (criteriaItem.operator === 'contains') {
            ajaxRetrieve("queryContains.php");
        }
    },
    getSessions: function() {
        if (Object.keys(this.state.criteria).length === 0) {
            return this.props.AllSessions;
        }

        // Get an array where of the results of each criteria
        var sessionsArrays = [];
        for (var el in  this.state.criteria) {
            if(this.state.criteria.hasOwnProperty(el)) {
                var crit = this.state.criteria[el];
                if(crit.sessions) {
                    sessionsArrays.push(crit.sessions)
                }
            }
        }

        // Then do an intersection on the sessions that came out of each
        // criteria (equivalent to a logical AND between the operators)
        var sessions = arrayIntersect(sessionsArrays);
        return sessions;
    },
    runQuery: function(fields, sessions) {
        var DocTypes = [], that = this;
        // Get list of DocTypes to be retrieved
        for(var i = 0 ; i < fields.length; i += 1) {
            var field_split = fields[i].split(",");
            var category = field_split[0];
            if(DocTypes.indexOf(category) === -1) {
                // Found a new type of doc, retrieve the data
                DocTypes.push(category);
                $.ajax({
                    type: "POST",
                    url: "AjaxHelper.php?Module=dataquery&script=retrieveCategoryDocs.php",
                    data: {
                        DocType: category,
                        Sessions: sessions
                    },
                    dataType: 'text',
                    success: function(data) {
                        var i, row, rows, identifier,
                            sessiondata = that.state.sessiondata;
                        data = JSON.parse(data);
                        rows = data.rows;
                        for(i = 0; i < rows.length; i += 1) {
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
                            if(!sessiondata.hasOwnProperty(identifier)) {
                                sessiondata[identifier] = {
                                }
                            }

                            sessiondata[identifier][row.key[0]] = row.doc;

                        }
                        that.setState({ 'sessiondata' : sessiondata});
                        console.log("Received data");
                    }
                });

            }
        }

    },
    getRowData: function() {
        var sessiondata = this.state.sessiondata;
        var sessions = this.getSessions();
        var fields = this.state.fields;
        var i, j;
        var rowdata = [];
        var currow;

        if(this.state.grouplevel === 0) {
            for(j = 0; j < sessions.length; j += 1) {
                var currow = [];
                for(i = 0; i < fields.length; i += 1) {
                    var fieldSplit = fields[i].split(",")
                        currow[i] = '.';
                    var sd = sessiondata[sessions[j]];
                    if(sd) {
                        currow[i] = sd[fieldSplit[0]].data[fieldSplit[1]];
                    }

                }
                rowdata.push(currow);
            }
        } else {
            var Prefixes = [], prefix;
            for(i = 0; i < sessions.length; i += 1) {
                if(sessions[i] === []) {
                    continue;
                }
                prefix = sessions[i].pop().toUpperCase();
                if (Prefixes.indexOf(prefix) === -1) {
                    Prefixes.push(prefix);
                }
            }
            Prefixes.sort();
            console.log(Prefixes);


            /*
            for (el in obj) {
                if (obj.hasOwnProperty(el)) {
                    identifier = el.split(',');
                    i = parseInt(group_level, 10);
                    prefix = [];
                    while (i > 0) {
                        i -= 1;
                        prefix.push(identifier.pop());
                    }
                    sPrefix = prefix.join("_").toUpperCase();
                    // Create a new row. We'll initialize it to empty after we know how many columns there are,
                    // which depends on how many prefixes are found in this loop.
                    row = [];
                    row[0] = identifier.join(",");
                    existingRows[identifier.join(",")] = row;
                    if (Prefixes.indexOf(sPrefix) === -1) {
                        Prefixes.push(sPrefix);
                    }
                }
            }
            */
        }
        return rowdata;
    },
    render: function() {
        var tabs = [], tabsNav = [];
        tabs.push(React.createElement(InfoTabPane, {
                TabId: "Info", 
                UpdatedTime: this.props.UpdatedTime}
        ));
        tabs.push(React.createElement(FieldSelectTabPane, {
                TabId: "DefineFields", 
                categories: this.props.categories, 
                onFieldChange: this.fieldChange, 
                selectedFields: this.state.fields}
        ));
        tabs.push(React.createElement(FilterSelectTabPane, {
                TabId: "DefineFilters", 
                categories: this.props.categories, 
                onCriteriaChange: this.criteriaChange, 
                onFieldChange: this.criteriaFieldChange, 
                selectedFields: Object.keys(this.state.criteria), 
                Criteria: this.state.criteria}
            )
        );
        var rowData = this.getRowData();
        tabs.push(React.createElement(ViewDataTabPane, {
                TabId: "ViewData", 
                Fields: this.state.fields, 
                Criteria: this.state.criteria, 
                Sessions: this.getSessions(), 
                Data: rowData, 
                onRunQueryClicked: this.runQuery}
        ));
        tabs.push(React.createElement(StatsVisualizationTabPane, {TabId: "Statistics", 
                Fields: this.state.fields, 
                Data: rowData}));
        tabs.push(React.createElement(ManageSavedQueriesTabPane, {TabId: "SavedQueriesTab", 
                        userQueries: this.props.SavedQueries.User, 
                        globalQueries: this.props.SavedQueries.Shared, 
                        onSaveQuery: this.saveCurrentQuery, 
                        queryDetails: this.state.savedQueries, 
                        queriesLoaded: this.state.queriesLoaded}
                ));

        return React.createElement("div", null, 
                React.createElement("nav", {className: "nav nav-tabs"}, 
                    React.createElement("ul", {className: "nav nav-tabs navbar-left", 'data-tabs': "tabs"}, 
                        React.createElement("li", {role: "presentation", className: "active"}, React.createElement("a", {href: "#Info", 'data-toggle': "tab"}, "Info")), 
                        React.createElement("li", {role: "presentation"}, React.createElement("a", {href: "#DefineFields", 'data-toggle': "tab"}, "Define Fields")), 
                        React.createElement("li", {role: "presentation"}, React.createElement("a", {href: "#DefineFilters", 'data-toggle': "tab"}, "Define Filters")), 
                        React.createElement("li", {role: "presentation"}, React.createElement("a", {href: "#ViewData", 'data-toggle': "tab"}, "View Data")), 
                        React.createElement("li", {role: "presentation"}, React.createElement("a", {href: "#Statistics", 'data-toggle': "tab"}, "Statistical Analysis"))
                    ), 
                    React.createElement(SavedQueriesList, {
                        userQueries: this.props.SavedQueries.User, 
                        globalQueries: this.props.SavedQueries.Shared, 
                        queryDetails: this.state.savedQueries, 
                        queriesLoaded: this.state.queriesLoaded, 
                        onSelectQuery: this.loadSavedQuery}
                    )
                ), 
                React.createElement("div", {className: "tab-content"}, 
                    tabs
                )
            );
    }
});

RDataQueryApp = React.createFactory(DataQueryApp);
