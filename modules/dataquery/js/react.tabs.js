TabPane = React.createClass({displayName: 'TabPane',
    render: function() {
        var classList = "tab-pane";
        if(this.props.Active) {
            classList += " active"
        }
        return (
            React.createElement("div", {className: classList, id: this.props.TabId}, 
                React.createElement("h1", null, this.props.Title), 
                this.props.content
            )
            );
    }
});

InfoTabPane = React.createClass({displayName: 'InfoTabPane',
    render: function() {
        content = React.createElement("div", null, 
            React.createElement("p", null, "Data was last updated on ", this.props.UpdatedTime, "."), 
            React.createElement("p", null, "Please define or use your query by using the following tabs."), 
            React.createElement("dl", null, 
                React.createElement("dt", null, "Define Fields"), 
                React.createElement("dd", null, "Define the fields to be added to your query here."), 
                React.createElement("dt", null, "Define Filters"), 
                React.createElement("dd", null, "Define the criteria to filter the data for your query here."), 
                React.createElement("dt", null, "View Data"), 
                React.createElement("dd", null, "See the results of your query."), 
                React.createElement("dt", null, "Statistical Analysis"), 
                React.createElement("dd", null, "Visualize or see basic statistical measures from your query here."), 
                React.createElement("dt", null, "Load Saved Query"), 
                React.createElement("dd", null, "Load a previously saved query (by name) by selecting from this menu."), 
                React.createElement("dt", null, "Managed Saved Queries"), 
                React.createElement("dd", null, "Either save your current query or see the criteria of previously saved quer  ies here.")
              )
        );
        return React.createElement(TabPane, {title: "Welcome to the Data Query Tool", 
            content: content, TabId: this.props.TabId, Active: true})
    }
});

FieldSelectTabPane = React.createClass({displayName: 'FieldSelectTabPane',
    render: function() {
        var content = React.createElement(FieldSelector, {title: "Fields", items: this.props.categories, onFieldChange: this.props.onFieldChange, selectedFields: this.props.selectedFields})
        return React.createElement(TabPane, {content: content, TabId: this.props.TabId})
    }

});

FilterSelectTabPane = React.createClass({displayName: 'FilterSelectTabPane',
    render: function() {
        var content = React.createElement(FieldSelector, {title: "Filters", items: this.props.categories, type: "Criteria", onFieldChange: this.props.onFieldChange, onCriteriaChange: this.props.onCriteriaChange, selectedFields: this.props.selectedFields, Criteria: this.props.Criteria})
        return React.createElement(TabPane, {content: content, TabId: this.props.TabId})
    }
});

ViewDataTabPane = React.createClass({displayName: 'ViewDataTabPane',
    getInitialState: function() {
        return { 'sessions' : [] }
    },
    runQuery: function() {
        if(this.props.onRunQueryClicked) {
            this.props.onRunQueryClicked(this.props.Fields, this.props.Sessions);
        }
    },
    downloadCSV: function() {
        var headers = this.props.Fields,
            csvworker = new Worker('GetJS.php?Module=dataquery&file=workers/savecsv.js');


        csvworker.addEventListener('message', function (e) {
            var dataURL, dataDate, link;
            if (e.data.cmd === 'SaveCSV') {
                dataDate = new Date().toISOString();
                dataURL = window.URL.createObjectURL(e.data.message);
                link = document.createElement("a");
                link.download = "data-" + dataDate + ".csv";
                link.type = "text/csv";
                link.href = dataURL;
                $(link)[0].click();

            }
        });
        csvworker.postMessage({
            cmd: 'SaveFile',
            data: this.props.Data,
            headers: headers,
            identifiers: this.props.Sessions
        });
    },
    render: function() {
        var buttons = (
            React.createElement("div", {className: "commands"}, 
                React.createElement("button", {onClick: this.runQuery}, "Run Query"), 
                React.createElement("button", {onClick: this.downloadCSV}, "Download Table as CSV")
            )
            );
        var criteria = [];
        for (var el in  this.props.Criteria) {
            if(!this.props.Criteria.hasOwnProperty(el)) {
                continue;
            }
            var item = this.props.Criteria[el];
            if(item === undefined) {
                criteria.push(
                    React.createElement("div", {className: "alert alert-warning", role: "alert"}, 
                        el, " has been added as a filter but not had criteria defined."
                    )
                );
            } else {
                criteria.push(
                    React.createElement("div", {className: "row"}, 
                        React.createElement("span", {className: "col-sm-3"}, el), 
                        React.createElement("span", {className: "col-sm-3"}, item.operator), 
                        React.createElement("span", {className: "col-sm-3"}, item.value)
                    )
                    );
            }

        }
        var content = (
            React.createElement("div", null, 
                React.createElement("h2", null, "Query Criteria"), criteria, " ", buttons, 
                React.createElement("h2", null, "Data"), 
                React.createElement(DataTable, {Headers: this.props.Fields, Identifiers: this.props.Sessions, Data: this.props.Data})
            )
                );
        return React.createElement(TabPane, {content: content, TabId: this.props.TabId});
    }
});

StatsVisualizationTabPane = React.createClass({displayName: 'StatsVisualizationTabPane',
    render: function() {
        var content = React.createElement("div", null, "Stats go here");
        return React.createElement(TabPane, {content: content, TabId: this.props.TabId});
    }
});

SaveQueryDialog = React.createClass({displayName: 'SaveQueryDialog',
    render: function() {
        return (
            React.createElement("div", {className: "modal fade", id: "myModal", tabindex: "-1", role: "dialog", 'aria-labelledby': "myModalLabel", 'aria-hidden': "true"}, 
                React.createElement("div", {className: "modal-dialog"}, 
                    React.createElement("div", {className: "modal-content"}, 
                        React.createElement("div", {className: "modal-header"}, 
                            React.createElement("button", {type: "button", className: "close", 'data-dismiss': "modal", 'aria-label': "Close"}, React.createElement("span", {'aria-hidden': "true"}, "×")), 
                            React.createElement("h4", {className: "modal-title", id: "myModalLabel"}, "Modal title")
                        ), 
                        React.createElement("div", {className: "modal-body"}, 
                            "Abc"
                        ), 
                        React.createElement("div", {className: "modal-footer"}, 
                            React.createElement("button", {type: "button", className: "btn btn-default", 'data-dismiss': "modal"}, "Close"), 
                            React.createElement("button", {type: "button", className: "btn btn-primary"}, "Save changes")
                        )
                    )
                )
            )
            );
    }
});
ManageSavedQueryRow = React.createClass({displayName: 'ManageSavedQueryRow',
    getDefaultProps: function() {
        return {
            'Name': 'Unknown',
            'Query': {
                'Fields': []
            }
        }
    },
    render: function() {
        var fields = [];
        var filters = [];
        for(var i = 0; i < this.props.Query.Fields.length; i += 1) {
            fields.push(React.createElement("li", null, this.props.Query.Fields[i]));
        }

        if(fields.length === 0) {
            fields.push(React.createElement("li", null, "No fields defined"));
        }

        for(var i = 0; i < this.props.Query.Conditions.length; i += 1) {
            var filter = this.props.Query.Conditions[i];
            filters.push(React.createElement("li", null, filter.Field, " ", filter.Operator, " ", filter.Value));
        }
        if(filters.length === 0) {
            filters.push(React.createElement("li", null, "No filters defined"));
        }
        return (
                    React.createElement("tr", null, 
                        React.createElement("td", null, this.props.Name), 
                        React.createElement("td", null, React.createElement("ul", null, fields)), 
                        React.createElement("td", null, React.createElement("ul", null, filters))
                    )
        );
    }
});
ManageSavedQueriesTabPane = React.createClass({displayName: 'ManageSavedQueriesTabPane',
    componentDidMount: function() {
        var promises = [];
        var that = this;
        console.log(this.props.userQueries);
        for (var i = 0; i < this.props.userQueries.length; i += 1) {
            var curRequest;
            curRequest = Promise.resolve(
                $.ajax("AjaxHelper.php?Module=dataquery&script=GetDoc.php&DocID=" + that.props.userQueries[i]), {
                    data: {
                        DocID: that.props.userQueries[i]
                    },
                    dataType: 'json'
                }).then(function(value) {
                    var queries = that.state.queries;

                    queries[value._id] = value;
                    that.setState({ 'queries' : queries});
                    console.log(value);
                });
            promises.push(curRequest);
        }

        var allDone = Promise.all(promises).then(function(value) {
            that.setState({ 'queriesLoaded' : true });

        });
    },
    getInitialState: function() {
        return {
            'savePrompt' : false,
            'queriesLoaded' : false,
            'queries' : {}
        };
    },
    saveQuery: function() {
        if(this.props.onSaveQuery) {
            this.props.onSaveQuery(); //todo: add (name, shared parameters)
        }
    },
    getDefaultProps: function() {
        return {
            userQueries: [],
            globalQueries: []
        };
    },
    render: function() {
        var queryRows = [];
        if(this.state.queriesLoaded) {
            for(var i = 0; i < this.props.userQueries.length; i += 1) {
                var query = this.state.queries[this.props.userQueries[i]];
                queryRows.push(
                        React.createElement(ManageSavedQueryRow, {Name: this.props.userQueries[i], Query: query})
                    );

            }
        } else {
            queryRows.push(
                React.createElement("tr", null, 
                    React.createElement("td", {colSpan: "3"}, "Loading saved query details")
                )
            );
        }
        var content = (
            React.createElement("div", null, 
                React.createElement("h2", null, "Your currently saved queries"), 
                React.createElement("button", {onClick: this.saveQuery}, "Save Current Query"), 
                React.createElement("table", {className: "table table-hover table-primary table-bordered colm-freeze"}, 
                    React.createElement("thead", null, 
                        React.createElement("tr", {className: "info"}, 
                            React.createElement("th", null, "Query Name"), 
                            React.createElement("th", null, "Fields"), 
                            React.createElement("th", null, "Filters")
                        )
                    ), 
                    React.createElement("tbody", null, 
                        queryRows
                    )
                ), 
                React.createElement(SaveQueryDialog, null)
            )
        );
        return React.createElement(TabPane, {content: content, TabId: this.props.TabId});
    }
});
