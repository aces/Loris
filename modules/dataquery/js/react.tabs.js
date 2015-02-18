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
        var content = React.createElement(FieldSelector, {title: "Fields", items: this.props.categories, onFieldChange: this.props.onFieldChange})
        return React.createElement(TabPane, {content: content, TabId: this.props.TabId})
    }

});

FilterSelectTabPane = React.createClass({displayName: 'FilterSelectTabPane',
    render: function() {
        var content = React.createElement(FieldSelector, {title: "Filters", items: this.props.categories, type: "Criteria", onFieldChange: this.props.onFieldChange, onCriteriaChange: this.props.onCriteriaChange})
        return React.createElement(TabPane, {content: content, TabId: this.props.TabId})
    }
});

ViewDataTabPane = React.createClass({displayName: 'ViewDataTabPane',
    runQuery: function() {
        if (this.props.Criteria.length === 0) {
            // Get all the candidates
        } else {
            // Get an array where of the results of each criteria
            var sessionsArrays = [];
            for (var el in  this.props.Criteria) {
                if(this.props.Criteria.hasOwnProperty(el)) {
                    sessionsArrays.push(this.props.Criteria[el].sessions)
                }
            }

            // Then do an intersection on the sessions that came out of each
            // criteria (equivalent to a logical AND between the operators)
            var sessions = arrayIntersect(sessionsArrays);
            console.log(sessions);
        }
    },
    render: function() {
        var headers = [];
        for(var i = 0; i < this.props.Fields.length; i += 1) {
            headers.push(React.createElement("th", null, this.props.Fields[i]));
        }
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
                        React.createElement("span", {className: "col-sm-3"}, item.value), 
                        React.createElement("span", {className: "col-sm-3"}, item.sessions)
                    )
                    );
            }

        }
        var content = React.createElement("div", null, React.createElement("h2", null, "Query Criteria"), criteria, " ", buttons, React.createElement("h2", null, "Data"), " ", React.createElement("table", {className: "table table-hover table-primary table-bordered"}, React.createElement("thead", null, React.createElement("tr", {className: "info"}, headers))));
        return React.createElement(TabPane, {content: content, TabId: this.props.TabId});
    }
});

StatsVisualizationTabPane = React.createClass({displayName: 'StatsVisualizationTabPane',
    render: function() {
        var content = React.createElement("div", null, "Stats go here");
        return React.createElement(TabPane, {content: content, TabId: this.props.TabId});
    }
});

DataQueryApp = React.createClass({displayName: 'DataQueryApp',
    getInitialState: function() {
        return {
            fields: [],
            criteria: {}
        };
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
            fields[fieldName] = undefined;
        } else if(changeType === 'remove') {
            delete fields[fieldName];
        }
        this.setState({ criteria: fields });
    },
    criteriaChange: function(fieldName, criteriaItem) {
        var criteria = this.state.criteria;
        criteria[fieldName] = criteriaItem.state;
        this.setState({ criteria: criteria} );
    },
    render: function() {
        var tabs = [], tabsNav = [];
        tabs.push(React.createElement(InfoTabPane, {TabId: "Info", UpdatedTime: this.props.UpdatedTime}));
        tabs.push(React.createElement(FieldSelectTabPane, {categories: this.props.categories, TabId: "DefineFields", onFieldChange: this.fieldChange}));
        tabs.push(React.createElement(FilterSelectTabPane, {categories: this.props.categories, TabId: "DefineFilters", onCriteriaChange: this.criteriaChange, onFieldChange: this.criteriaFieldChange}));
        tabs.push(React.createElement(ViewDataTabPane, {TabId: "ViewData", Fields: this.state.fields, Criteria: this.state.criteria}));
        tabs.push(React.createElement(StatsVisualizationTabPane, {TabId: "Statistics"}));

        return React.createElement("div", null, 
                React.createElement("nav", {className: "nav nav-tabs"}, 
                    React.createElement("ul", {className: "nav nav-tabs navbar-left", 'data-tabs': "tabs"}, 
                        React.createElement("li", {role: "presentation", className: "active"}, React.createElement("a", {href: "#Info", 'data-toggle': "tab"}, "Info")), 
                        React.createElement("li", {role: "presentation"}, React.createElement("a", {href: "#DefineFields", 'data-toggle': "tab"}, "Define Fields")), 
                        React.createElement("li", {role: "presentation"}, React.createElement("a", {href: "#DefineFilters", 'data-toggle': "tab"}, "Define Filters")), 
                        React.createElement("li", {role: "presentation"}, React.createElement("a", {href: "#ViewData", 'data-toggle': "tab"}, "View Data")), 
                        React.createElement("li", {role: "presentation"}, React.createElement("a", {href: "#Statistics", 'data-toggle': "tab"}, "Statistical Analysis"))
                    ), 
                    React.createElement("ul", {className: "nav nav-tabs navbar-right"}, 
                        React.createElement("li", {className: "dropdown"}, 
                            React.createElement("a", {href: "#", className: "dropdown-toggle", 'data-toggle': "dropdown", role: "button", 'aria-expanded': "false"}, "Load Saved Query ", React.createElement("span", {className: "caret"})), 
                            React.createElement("ul", {className: "dropdown-menu", role: "menu"}, 
                                React.createElement("li", null, React.createElement("a", {href: "#"}, "Query 1")), 
                                React.createElement("li", null, React.createElement("a", {href: "#"}, "Query 2")), 
                                React.createElement("li", null, React.createElement("a", {href: "#"}, "Query 3"))
                            )
                        ), 
                        React.createElement("li", {role: "presentation"}, React.createElement("a", {href: "#"}, "Managed Saved Queries"))
                    )
                ), 
                React.createElement("div", {className: "tab-content"}, 
                    tabs
                )
            );
    }
});
