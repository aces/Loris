TabPane = React.createClass({
    render: function() {
        var classList = "tab-pane";
        if(this.props.Active) {
            classList += " active"
        }
        return (
            <div className={classList} id={this.props.TabId}>
                <h1>{this.props.Title}</h1>
                {this.props.content}
            </div>
            );
    }
});

InfoTabPane = React.createClass({
    render: function() {
        content = <div>
            <p>Data was last updated on {this.props.UpdatedTime}.</p>
            <p>Please define or use your query by using the following tabs.</p>
            <dl>
                <dt>Define Fields</dt>
                <dd>Define the fields to be added to your query here.</dd>
                <dt>Define Filters</dt>
                <dd>Define the criteria to filter the data for your query here.</dd>
                <dt>View Data</dt>
                <dd>See the results of your query.</dd>
                <dt>Statistical Analysis</dt>
                <dd>Visualize or see basic statistical measures from your query here.</dd>
                <dt>Load Saved Query</dt>
                <dd>Load a previously saved query (by name) by selecting from this menu.</dd>
                <dt>Managed Saved Queries</dt>
                <dd>Either save your current query or see the criteria of previously saved quer  ies here.</dd>
              </dl>
        </div>;
        return <TabPane title="Welcome to the Data Query Tool"
            content={content} TabId={this.props.TabId} Active={true}/>
    }
});

FieldSelectTabPane = React.createClass({
    render: function() {
        var content = <FieldSelector title="Fields" items={this.props.categories} onFieldChange={this.props.onFieldChange} />
        return <TabPane content={content} TabId={this.props.TabId} />
    }

});

FilterSelectTabPane = React.createClass({
    render: function() {
        var content = <FieldSelector title="Filters" items={this.props.categories} type="Criteria" onFieldChange={this.props.onFieldChange} onCriteriaChange={this.props.onCriteriaChange}/>
        return <TabPane content={content} TabId={this.props.TabId} />
    }
});

ViewDataTabPane = React.createClass({
    render: function() {
        var headers = [];
        for(var i = 0; i < this.props.Fields.length; i += 1) {
            headers.push(<th>{this.props.Fields[i]}</th>);
        }
        var buttons = <div className="commands"><button>Run Query</button></div>
        var criteria = [];
        for (var el in  this.props.Criteria) {
            if(!this.props.Criteria.hasOwnProperty(el)) {
                continue;
            }
            var item = this.props.Criteria[el];
            if(item === undefined) {
                criteria.push(
                    <div className="alert alert-warning" role="alert">
                        {el} has been added as a filter but not had criteria defined.
                    </div>
                );
            } else {
                criteria.push(
                    <div className="row">
                        <span className="col-sm-4">{el}</span>
                        <span className="col-sm-4">{item.operator}</span>
                        <span className="col-sm-4">{item.value}</span>
                    </div>
                    );
            }

        }
        var content = <div><h2>Query Criteria</h2>{criteria} {buttons}<h2>Data</h2> <table className="table table-hover table-primary table-bordered"><thead><tr className="info">{headers}</tr></thead></table></div>;
        return <TabPane content={content} TabId={this.props.TabId} />;
    }
});

StatsVisualizationTabPane = React.createClass({
    render: function() {
        var content = <div>Stats go here</div>;
        return <TabPane content={content} TabId={this.props.TabId} />;
    }
});

DataQueryApp = React.createClass({
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
        tabs.push(<InfoTabPane TabId="Info" UpdatedTime={this.props.UpdatedTime}/>);
        tabs.push(<FieldSelectTabPane categories={this.props.categories} TabId="DefineFields" onFieldChange={this.fieldChange}/>);
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
                    <ul className="nav nav-tabs navbar-right">
                        <li className="dropdown">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Load Saved Query <span className="caret"></span></a>
                            <ul className="dropdown-menu" role="menu">
                                <li><a href="#">Query 1</a></li>
                                <li><a href="#">Query 2</a></li>
                                <li><a href="#">Query 3</a></li>
                            </ul>
                        </li>
                        <li role="presentation"><a href="#">Managed Saved Queries</a></li>
                    </ul>
                </nav>
                <div className="tab-content">
                    {tabs}
                </div>
            </div>;
    }
});

RDataQueryApp = React.createFactory(DataQueryApp);
