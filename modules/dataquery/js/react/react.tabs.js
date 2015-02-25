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
            headers.push(<th>{this.props.Fields[i]}</th>);
        }
        var buttons = <div className="commands"><button onClick={this.runQuery}>Run Query</button></div>
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
                        <span className="col-sm-3">{el}</span>
                        <span className="col-sm-3">{item.operator}</span>
                        <span className="col-sm-3">{item.value}</span>
                        <span className="col-sm-3">{item.sessions}</span>
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
