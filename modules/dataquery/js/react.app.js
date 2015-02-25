SavedQueriesList = React.createClass({displayName: 'SavedQueriesList',
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

        for(var i = 0; i < this.props.userQueries.length; i += 1) {
            userSaved.push(React.createElement("li", null, React.createElement("a", {href: "#", onClick: this.loadQuery(this.props.userQueries[i])}, this.props.userQueries[i])));
        }
        for(var i = 0; i < this.props.globalQueries.length; i += 1) {
            globalSaved.push(React.createElement("li", null, React.createElement("a", {href: "#"}, this.props.globalQueries[i])));
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
                 React.createElement("li", {role: "presentation"}, React.createElement("a", {href: "#"}, "Managed Saved Queries"))
             )
            );
    }
});
DataQueryApp = React.createClass({displayName: 'DataQueryApp',
    getInitialState: function() {
        return {
            fields: [],
            criteria: {}
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
                    value: criteriaItem.state.value
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
        tabs.push(React.createElement(ViewDataTabPane, {
                TabId: "ViewData", 
                Fields: this.state.fields, 
                Criteria: this.state.criteria}
        ));
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
                    React.createElement(SavedQueriesList, {
                        userQueries: this.props.SavedQueries.User, 
                        globalQueries: this.props.SavedQueries.Shared, 
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
