SavedQueriesList = React.createClass({
    getDefaultProps: function() {
        queriesLoaded: false
    },
    componentDidMount: function() {
    },
    loadQuery: function(queryName) {
        this.props.onSelectQuery(
            this.props.queryDetails[queryName].Fields,
            this.props.queryDetails[queryName].Conditions
        );
    },
    render: function() {
        var userSaved = [];
        var globalSaved = [];
        var queryName, curQuery;

        if(this.props.queriesLoaded === false) {
            return <div />;
        }
        for(var i = 0; i < this.props.userQueries.length; i += 1) {
            curQuery = this.props.queryDetails[this.props.userQueries[i]];
            console.log(curQuery.Meta);
            if(curQuery.Meta && curQuery.Meta.name) {
                queryName = curQuery.Meta.name;
            } else {
                queryName = this.props.userQueries[i];
            }
            userSaved.push(<li key={this.props.userQueries[i]}><a href="#" onClick={this.loadQuery.bind(this, this.props.userQueries[i])}>{queryName}</a></li>);
        }
        for(var i = 0; i < this.props.globalQueries.length; i += 1) {
            curQuery = this.props.queryDetails[this.props.globalQueries[i]];
            console.log(curQuery.Meta);
            if(curQuery.Meta && curQuery.Meta.name) {
                queryName = curQuery.Meta.name;
            } else {
                queryName = this.props.globalQueries[i];
            }
            globalSaved.push(<li key={this.props.globalQueries[i]}><a href="#" onClick={this.loadQuery.bind(this, this.props.globalQueries[i])}>{queryName}</a></li>);
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
                 <li role="presentation"><a href="#SavedQueriesTab" data-toggle="tab">Manage Saved Queries</a></li>
             </ul>
            );
    }
});
DataQueryApp = React.createClass({
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
        for(var key in this.state.queryIDs){
            console.log(this.state.queryIDs[key][0]);
            for (var i = 0; i < this.state.queryIDs[key].length; i += 1) {
                var curRequest;
                curRequest = Promise.resolve(
                        $.ajax(loris.BaseURL + "/AjaxHelper.php?Module=dataquery&script=GetDoc.php&DocID=" + that.state.queryIDs[key][i]), {
                            data: {
                                DocID: that.state.queryIDs[key][i]
                            },
                            dataType: 'json'
                        }).then(function(value) {
                            var queries = that.state.savedQueries;

                            queries[value._id] = value;
                            that.setState({ 'savedQueries' : queries});
                        });
                promises.push(curRequest);
            }
        }

        var allDone = Promise.all(promises).then(function(value) {
            that.setState({ 'queriesLoaded' : true });

        });
        var component = this;
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            component.setState({
                ActiveTab: e.target.getAttribute("href").substr(1)
            });
        })
    },
    saveFilterRule: function(rule) {
        var savedRule = {
            "field"      : rule.field,
            "operator"   : rule.operator,
            "value"      : rule.value,
            "instrument" : rule.instrument
        }
        return savedRule;
    },
    saveFilterGroup: function(group) {
        var savedFilter = {
            "activeOperator" : group.activeOperator,
            "children"       : []
        };
        for(var i = 0; i < group.children.length; i++) {
            if(group.children[i].type === "rule") {
                savedFilter.children.push(this.saveFilterRule(group.children[i]));
            } else if(group.children[i].type === "group") {
                savedFilter.children.push(this.saveFilterGroup(group.children[i]));
            }
        }
        return savedFilter;
    },
    saveCurrentQuery: function(name, shared) {
        var that = this,
            filter = this.saveFilterGroup(this.state.filter);

        $.post(loris.BaseURL + "/AjaxHelper.php?Module=dataquery&script=saveQuery.php",
            {
                Fields: this.state.fields,
                Filters: filter,
                QueryName: name,
                SharedQuery: shared,
            }, function(data) {
                var id = JSON.parse(data).id,
                    queryIDs = that.state.queryIDs;
                if (shared === true) {
                    queryIDs.Shared.push(id);
                } else {
                    queryIDs.User.push(id);
                }
                $.get(loris.BaseURL + "/AjaxHelper.php?Module=dataquery&script=GetDoc.php&DocID=" + id, function(value) {
                        var queries = that.state.savedQueries;

                        queries[value._id] = value;
                        that.setState({
                            'savedQueries' : queries,
                            'queryIDs' : queryIDs,
                            alertLoaded: false,
                            alertSaved: true
                        });
                    });
            });

    },
    getInitialState: function() {
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
            ActiveTab :  'Info',
            rowData: {},
            filter: {
                type: "group",
                activeOperator: 0,
                children: [
                    {
                        type: "rule"
                    }
                ],
                session: this.props.AllSessions
            },
            selectedFields : {}
        };
    },
    loadFilterRule: function(rule) {
        var script;
        if(!rule.type){
            rule.type = "rule"
        }
        $.ajax({
            url: loris.BaseURL + "/AjaxHelper.php?Module=dataquery&script=datadictionary.php",
            success: function(data) {
                rule.fields = data;
            },
            async: false,
            data: { category: rule.instrument },
            dataType: 'json'
        });
        for(var i = 0; i < rule.fields.length; i++){
            if(rule.fields[i].key[1] === rule.field){
                rule.fieldType = rule.fields[i].value.Type;
                break;
            }
        }
        switch(rule.operator) {
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
            success: function(data) {
                rule.session = data;
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
    loadFilterGroup: function(group) {
        for(var i = 0; i < group.children.length; i++){
            if(group.children[i].activeOperator) {
                if(!group.children[i].type){
                    group.children[i].type = "group"
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
        var filterState = {};
        if(Array.isArray(criteria)){
            filterState = {
                type: "group",
                activeOperator: 0,
                children: []
            };
            filterState.children = criteria.map(function(item){
                var fieldInfo = item.Field.split(",");
                    rule = {
                        "instrument" : fieldInfo[0],
                        "field"      : fieldInfo[1],
                        "value"      : item.Value,
                        "type"       : "rule"
                    };
                switch(item.Operator) {
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
        } else {
            filterState = criteria;
        }
        filterState = this.loadFilterGroup(filterState);
        this.setState(function(state) {
           return  {
                fields: fields,
                filter: filterState,
                alertLoaded: true,
                alertSaved: false
            }
        });
    },
    fieldVisitSelect: function(action, visit, field) {
        this.setState(function(state){
            var temp = state.selectedFields[field.instrument];
            if(action === "check") {
                temp[field.field][visit] = visit;
                temp.allVisits[visit]++;
            } else {
                delete temp[field.field][visit];
                if(temp.allVisits[visit] === 1){
                    delete temp.allVisits[visit];
                } else {
                    temp.allVisits[visit]--;
                }
            }
            return temp;
        });
    },
    fieldChange: function(fieldName, category) {
        var that = this;
        this.setState(function(state){
            var selectedFields = state.selectedFields,
                fields = state.fields.slice(0);
            if(!selectedFields[category]){
                selectedFields[category] = {};
                selectedFields[category][fieldName] = JSON.parse(JSON.stringify(that.props.Visits));
                selectedFields[category].allVisits = {};
                for(var key in that.props.Visits){
                    selectedFields[category].allVisits[key] = 1;
                }
                fields.push(category + "," + fieldName);
            } else if(selectedFields[category][fieldName]){
                for(var key in selectedFields[category][fieldName]){
                    if(selectedFields[category].allVisits[key] === 1){
                        delete selectedFields[category].allVisits[key];
                    } else {
                        selectedFields[category].allVisits[key]--;
                    }
                }
                delete selectedFields[category][fieldName];
                var idx = fields.indexOf(category + "," + fieldName);
                fields.splice(idx, 1);
                if(Object.keys(selectedFields[category]).length === 1){
                    delete selectedFields[category];
                }
            } else {
                selectedFields[category][fieldName] = JSON.parse(JSON.stringify(that.props.Visits));
                for(var key in that.props.Visits){
                    if(selectedFields[category].allVisits[key]){
                        selectedFields[category].allVisits[key]++;
                    } else {
                        selectedFields[category].allVisits[key] = 1;
                    }
                }
                fields.push(category + "," + fieldName);
            }
            return {
                selectedFields: selectedFields,
                fields: fields
            };
        });
        //clone the fields array so that setState triggers a rerender
        // if we don't clone it and mutate it s etState thinks that the state has not changed
        // this.setState(function(state){
        //     var fields = state.fields.slice(0);
        //     var idx = fields.indexOf(fieldName);
        //     if (changeType === 'add') {
        //         if(idx === -1) {
        //             fields.push(fieldName);
        //         }
        //     } else if (changeType === 'remove') {
        //         if(idx > -1) {
        //             fields.splice(idx, 1);
        //         }
        //     }
        //     return { fields: fields, loadedQuery: '' };
        // });
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
        this.setState({ criteria: fields, loadedQuery: '' });
    },
    getSessions: function() {
        if(this.state.filter.children.length > 0) {
            return this.state.filter.session;
        } else {
            return this.props.AllSessions;
        }
    },
    runQuery: function(fields, sessions) {
        var DocTypes = [],
            that = this,
            semaphore = 0,
            ajaxComplete = function(){
                if(semaphore == 0){
                    var rowdata = that.getRowData(that.state.grouplevel);
                    that.setState({'rowData': rowdata});
                }
            };
        this.setState({
            "rowData" : {},
            "sessiondata" : {}
        });
        // Get list of DocTypes to be retrieved
        for(var i = 0 ; i < fields.length; i += 1) {
            var field_split = fields[i].split(",");
            var category = field_split[0];
            if(DocTypes.indexOf(category) === -1) {
                // Found a new type of doc, retrieve the data
                DocTypes.push(category);
                semaphore++;
                $.ajax({
                    type: "POST",
                    url: loris.BaseURL + "/AjaxHelper.php?Module=dataquery&script=retrieveCategoryDocs.php",
                    data: {
                        DocType: category,
                        Sessions: sessions
                    },
                    dataType: 'text',
                    success: function(data) {
                        if(data) {
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
                        }
                        console.log("Received data");
                        semaphore--;
                        ajaxComplete();
                    }
                });

            }
        }
    },
    getRowData: function(displayID) {
        var sessiondata = this.state.sessiondata;
        var sessions = this.getSessions();
        var fields = this.state.fields;
        var i, j;
        var rowdata = [];
        var currow = [];
        var Identifiers = [];
        var RowHeaders = [];

        if(displayID === 0) {
            for(i = 0; fields && i < fields.length; i += 1) {
                RowHeaders.push(fields[i]);
            }
            for(var session in sessiondata){
                currow = [];
                for(i = 0; fields && i < fields.length; i += 1) {
                    var fieldSplit = fields[i].split(",")
                        currow[i] = '.';
                    var sd = sessiondata[session];
                    if(sd[fieldSplit[0]]) {
                        currow[i] = sd[fieldSplit[0]].data[fieldSplit[1]];
                    }

                }
                rowdata.push(currow);
                Identifiers.push(session);
            }
            console.log(rowdata);
        } else {
            var Visits = [],
                visit, identifier, temp, colHeader, index;
            for(var session in sessiondata){
                sessiondata[session.toUpperCase()] = sessiondata[session];
                delete session[session];
                temp = session.split(',')
                visit = temp[1].toUpperCase();
                if (Visits.indexOf(visit) === -1) {
                    Visits.push(visit);
                }
                identifier = temp[0].toUpperCase();
                if (Identifiers.indexOf(identifier) === -1) {
                    Identifiers.push(identifier);
                }
            }
            Visits.sort();
            for(visit in Visits){
                for(i = 0; fields && i < fields.length; i += 1){
                    RowHeaders.push(Visits[visit] + '_' + fields[i])
                }
            }
            for(identifier in Identifiers){
                currow = [];
                for(colHeader in RowHeaders){
                    temp = Identifiers[identifier] +',' + RowHeaders[colHeader]
                    .split('_')[0];
                    index = sessiondata[temp];
                    if(!index){
                        currow.push(".");
                    } else {
                        temp = index[RowHeaders[colHeader].split(',')[0].split('_')[1]];
                        if(temp){
                            temp = temp.data[RowHeaders[colHeader].split(',')[1]];
                        } else {
                            temp = '.';
                        }
                        currow.push(temp);
                    }
                }
                rowdata.push(currow);
            }
        }
        return {'rowdata': rowdata, 'Identifiers': Identifiers, 'RowHeaders': RowHeaders};
    },
    dismissAlert: function() {
        this.setState({
            alertLoaded: false,
            alertSaved: false
        });
    },
    resetQuery: function(){
        this.setState({
            fields: [],
            criteria: {}
        });
    },
    changeDataDisplay: function(displayID){
        var rowdata = this.getRowData(displayID);
        this.setState({
            grouplevel: displayID,
            rowData: rowdata
        });
    },
    updateFilter: function(filter) {
        this.setState({
            filter: filter
        });
    },
    render: function() {
        var tabs = [], tabsNav = [], alert = <div />;
        tabs.push(<InfoTabPane
                TabId="Info"
                UpdatedTime={this.props.UpdatedTime}
        />);
        tabs.push(<FieldSelectTabPane
                TabId="DefineFields"
                categories={this.props.categories}
                onFieldChange={this.fieldChange}
                selectedFields={this.state.selectedFields}
                Visits={this.props.Visits}
                fieldVisitSelect = {this.fieldVisitSelect}
        />);
        // tabs.push(<FilterSelectTabPane
        //         TabId="DefineFilters"
        //         categories={this.props.categories}
        //         onFieldChange={this.criteriaFieldChange}
        //         selectedFields={Object.keys(this.state.criteria)}
        //         Criteria={this.state.criteria}
        //     />
        // );
        tabs.push(<FilterSelectTabPane
                TabId="DefineFilters"
                categories={this.props.categories}
                filter={this.state.filter}
                updateFilter={this.updateFilter}
                Visits={this.props.Visits}
            />
        );
        var displayType = (this.state.grouplevel === 0) ? "Cross-sectional" : "Longitudial";
        tabs.push(<ViewDataTabPane
                TabId="ViewData"
                Fields={this.state.fields}
                Criteria={this.state.criteria}
                Sessions={this.getSessions()}
                Data={this.state.rowData.rowdata}
                RowInfo={this.state.rowData.Identifiers}
                RowHeaders={this.state.rowData.RowHeaders}
                onRunQueryClicked={this.runQuery}
                displayType={displayType}
                changeDataDisplay={this.changeDataDisplay}
        />);
        tabs.push(<StatsVisualizationTabPane TabId="Statistics"
                Fields={this.state.rowData.RowHeaders}
                Data={this.state.rowData.rowdata} />);
        tabs.push(<ManageSavedQueriesTabPane TabId="SavedQueriesTab"
                        userQueries={this.state.queryIDs.User}
                        globalQueries={this.state.queryIDs.Shared}
                        onSaveQuery={this.saveCurrentQuery}
                        queryDetails={this.state.savedQueries}
                        queriesLoaded={this.state.queriesLoaded}
                />);

        if(this.state.alertLoaded) {
            alert = (
                <div className="alert alert-success" role="alert">
                    <button type="button" className="close" aria-label="Close" onClick={this.dismissAlert}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <strong>Success</strong> Query Loaded.
                </div>
            )
        }
        if(this.state.alertSaved) {
            alert = (
                <div className="alert alert-success" role="alert">
                    <button type="button" className="close" aria-label="Close" onClick={this.dismissAlert}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <strong>Success</strong> Query Saved.
                </div>
            )
        }
        var widthClass = "col-md-12";
        var sideBar = <div />
        if(this.state.fields.length > 0
            && this.state.ActiveTab !== 'ViewData'
            && this.state.ActiveTab !== 'Statistics'
            && this.state.ActiveTab !== 'Info'
        ) {
            widthClass = "col-md-10";
            sideBar = <div className="col-md-2">
                    <FieldsSidebar
                        Fields={this.state.fields}
                        Criteria={this.state.criteria}
                        resetQuery={this.resetQuery}
                    />
                </div>;
        }
        return <div>
                    {alert}
                    <div className={widthClass}>
                        <nav className="nav nav-tabs">
                            <ul className="nav nav-tabs navbar-left" data-tabs="tabs">
                                <li role="presentation" className="active"><a href="#Info" data-toggle="tab">Info</a></li>
                                <li role="presentation"><a href="#DefineFields" data-toggle="tab">Define Fields</a></li>
                                <li role="presentation"><a href="#DefineFilters" data-toggle="tab">Define Filters</a></li>
                                <li role="presentation"><a href="#ViewData" data-toggle="tab">View Data</a></li>
                                <li role="presentation"><a href="#Statistics" data-toggle="tab">Statistical Analysis</a></li>
                            </ul>
                            <SavedQueriesList
                                userQueries={this.state.queryIDs.User}
                                globalQueries={this.state.queryIDs.Shared}
                                queryDetails={this.state.savedQueries}
                                queriesLoaded={this.state.queriesLoaded}
                                onSelectQuery={this.loadSavedQuery}
                                loadedQuery={this.state.loadedQuery}
                            />
                        </nav>
                        <div className="tab-content">
                            {tabs}
                        </div>
                    </div>
                    {sideBar}

            </div>;
    }
});

RDataQueryApp = React.createFactory(DataQueryApp);
