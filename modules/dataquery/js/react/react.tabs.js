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
        var content = <FieldSelector title="Fields" items={this.props.categories} onFieldChange={this.props.onFieldChange} selectedFields={this.props.selectedFields}/>
        return <TabPane content={content} TabId={this.props.TabId} />
    }

});

FilterSelectTabPane = React.createClass({
    render: function() {
        var content = <FieldSelector title="Filters" items={this.props.categories} type="Criteria" onFieldChange={this.props.onFieldChange} onCriteriaChange={this.props.onCriteriaChange} selectedFields={this.props.selectedFields} Criteria={this.props.Criteria}/>
        return <TabPane content={content} TabId={this.props.TabId} />
    }
});

ViewDataTabPane = React.createClass({
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
            <div className="commands">
                <button onClick={this.runQuery}>Run Query</button>
                <button onClick={this.downloadCSV}>Download Table as CSV</button>
            </div>
            );
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
                    </div>
                    );
            }

        }
        var content = (
            <div>
                <h2>Query Criteria</h2>{criteria} {buttons}
                <h2>Data</h2>
                <DataTable Headers={this.props.Fields} Identifiers={this.props.Sessions} Data={this.props.Data} />
            </div>
                );
        return <TabPane content={content} TabId={this.props.TabId} />;
    }
});

StatsVisualizationTabPane = React.createClass({
    render: function() {
        var content = <div>Stats go here</div>;
        return <TabPane content={content} TabId={this.props.TabId} />;
    }
});

SaveQueryDialog = React.createClass({
    render: function() {
        return (
            <div className="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title" id="myModalLabel">Modal title</h4>
                        </div>
                        <div className="modal-body">
                            Abc
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
            );
    }
});
ManageSavedQueriesTabPane = React.createClass({
    getInitialState: function() {
        return {
            'savePrompt' : false
        };
    },
    saveQuery: function() {
    },
    getDefaultProps: function() {
        return {
            userQueries: [],
            globalQueries: []
        };
    },
    render: function() {
        var queryRows = [];
        for(var i = 0; i < this.props.userQueries.length; i += 1) {
            queryRows.push(<tr><td colSpan="3">{this.props.userQueries[i]}</td></tr>);

        }
        var content = (
            <div>
                <h2>Your currently saved queries</h2>
                <button onClick={this.saveQuery}>Save Current Query</button>
                <table>
                    <thead>
                        <tr>
                            <th>Query Name</th>
                            <th>Fields</th>
                            <th>Filters</th>
                        </tr>
                    </thead>
                    <tbody>
                        {queryRows}
                    </tbody>
                </table>
                <SaveQueryDialog />
            </div>
        );
        return <TabPane content={content} TabId={this.props.TabId} />;
    }
});
