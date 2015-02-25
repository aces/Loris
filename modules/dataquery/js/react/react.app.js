SavedQueriesList = React.createClass({
    loadQuery: function(queryName) {
        var that = this;
        return function() {
            $.getJSON("AjaxHelper.php?Module=dataquery&script=GetDoc.php", { DocID: queryName},
            function(data) {
                if(that.props.onSelectQuery) {
                    that.props.onSelectQuery(data.Fields, data.Conditions);
                }

                console.log(data);
            }
            );
        }
    },
    render: function() {
        var userSaved = [];
        var globalSaved = [];

        for(var i = 0; i < this.props.userQueries.length; i += 1) {
            userSaved.push(<li><a href="#" onClick={this.loadQuery(this.props.userQueries[i])}>{this.props.userQueries[i]}</a></li>);
        }
        for(var i = 0; i < this.props.globalQueries.length; i += 1) {
            globalSaved.push(<li><a href="#">{this.props.globalQueries[i]}</a></li>);
        }
        return (
             <ul className="nav nav-tabs navbar-right">
                 <li className="dropdown">
                     <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Load Saved Query <span className="caret"></span></a>
                     <ul className="dropdown-menu" role="menu">
                        <li role="presentation" className="dropdown-header">User Saved Queries</li>
                        {userSaved}
                        <li role="presentation" className="dropdown-header">Shared Saved Queries</li>
                        {globalSaved}
                     </ul>
                 </li>
                 <li role="presentation"><a href="#">Managed Saved Queries</a></li>
             </ul>
            );
    }
});
DataQueryApp = React.createClass({
    getInitialState: function() {
        return {
            fields: [],
            criteria: {}
        };
    },
    loadSavedQuery: function (fields, criteria) {
        console.log("Loading a query");
        console.log(fields);
        console.log(criteria);
        console.log("Loaded a query");
        this.setState({fields: fields});
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
        if (criteriaItem.state.operator === '=') {
            ajaxRetrieve("queryEqual.php");
        } else if (criteriaItem.state.operator === '!=') {
            ajaxRetrieve("queryNotEqual.php");
        } else if (criteriaItem.state.operator === '<=') {
            ajaxRetrieve("queryLessThanEqual.php");
        } else if (criteriaItem.state.operator === '>=') {
            ajaxRetrieve("queryGreaterThanEqual.php");
        } else if (criteriaItem.state.operator === 'startsWith') {
            ajaxRetrieve("queryStartsWith.php");
        } else if (criteriaItem.state.operator === 'contains') {
            ajaxRetrieve("queryContains.php");
        }
    },
    render: function() {
        var tabs = [], tabsNav = [];
        tabs.push(<InfoTabPane TabId="Info" UpdatedTime={this.props.UpdatedTime}/>);
        tabs.push(<FieldSelectTabPane categories={this.props.categories} TabId="DefineFields" onFieldChange={this.fieldChange} selectedFields={this.state.fields}/>);
        tabs.push(<FilterSelectTabPane categories={this.props.categories} TabId="DefineFilters" onCriteriaChange={this.criteriaChange} onFieldChange={this.criteriaFieldChange} />);
        tabs.push(<ViewDataTabPane TabId="ViewData" Fields={this.state.fields} Criteria={this.state.criteria} />);
        tabs.push(<StatsVisualizationTabPane TabId="Statistics" />);

        return <div>
                <nav className="nav nav-tabs">
                    <ul className="nav nav-tabs navbar-left" data-tabs="tabs">
                        <li role="presentation" className="active"><a href="#Info" data-toggle="tab">Info</a></li>
                        <li role="presentation"><a href="#DefineFields" data-toggle="tab">Define Fields</a></li>
                        <li role="presentation"><a href="#DefineFilters" data-toggle="tab">Define Filters</a></li>
                        <li role="presentation"><a href="#ViewData" data-toggle="tab">View Data</a></li>
                        <li role="presentation"><a href="#Statistics" data-toggle="tab">Statistical Analysis</a></li>
                    </ul>
                    <SavedQueriesList
                        userQueries={this.props.SavedQueries.User}
                        globalQueries={this.props.SavedQueries.Shared}
                        onSelectQuery={this.loadSavedQuery}
                    />
                </nav>
                <div className="tab-content">
                    {tabs}
                </div>
            </div>;
    }
});

RDataQueryApp = React.createFactory(DataQueryApp);
