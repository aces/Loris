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
    render: function() {
        var buttons = React.createElement("div", {className: "commands"}, React.createElement("button", {onClick: this.runQuery}, "Run Query"))
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
                React.createElement(DataTable, {Headers: this.props.Fields, Identifiers: this.props.Sessions})
            )
                );
        return React.createElement(TabPane, {content: content, TabId: this.props.TabId});
    }
});

DataTable = React.createClass({displayName: 'DataTable',
    getDefaultProps: function() {
        return {
            Identifiers: [],
            Headers: [],
            Data: {}
        };
    },
    render: function() {
        var headers = [React.createElement("th", null, "Identifier")];
        for(var i = 0; i < this.props.Headers.length; i += 1) {
            headers.push(React.createElement("th", null, this.props.Headers[i]));
        }
        var rows = [];

        for(var i = 0; i < this.props.Identifiers.length; i += 1) {
            rows.push(
                React.createElement("tr", {colSpan: headers.length}, 
                    React.createElement("td", null, this.props.Identifiers[i].join())
                )
            );
        }

        return (
            React.createElement("table", {className: "table table-hover table-primary table-bordered"}, 
                React.createElement("thead", null, 
                    React.createElement("tr", {className: "info"}, headers)
                ), 
                React.createElement("tbody", null, 
                    rows
                ), 
                React.createElement("tfoot", null, 
                    React.createElement("tr", null, React.createElement("td", {className: "info", colSpan: headers.length}, rows.length, " rows"))
                )
            )
        );
    }
});

StatsVisualizationTabPane = React.createClass({displayName: 'StatsVisualizationTabPane',
    render: function() {
        var content = React.createElement("div", null, "Stats go here");
        return React.createElement(TabPane, {content: content, TabId: this.props.TabId});
    }
});
