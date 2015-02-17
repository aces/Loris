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
        var fieldArray = fieldName.split(",");
        var that = this;
        var responseHandler = function(data) {
            var state = that.state.criteria,
                cstate = state[fieldName];

            cstate.sessions = data;
            state[fieldName] = cstate;

            that.setState(state);
        };
        criteria[fieldName] = criteriaItem.state;
        this.setState({ criteria: criteria} );

        if (criteriaItem.state.operator === '=') {
            $.get("AjaxHelper.php?Module=dataquery&script=queryEqual.php",
                  {
                    category: fieldArray[0],
                    field: fieldArray[1],
                    value: criteriaItem.state.value
                  },
                  responseHandler,
                  'json'
            );
        }
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

RDataQueryApp = React.createFactory(DataQueryApp);
