TabPane = React.createClass({
    mixins: [React.addons.PureRenderMixin],
    render: function() {
        var classList = "tab-pane";
        if(this.props.Active) {
            classList += " active"
        }
        return (
            <div className={classList} id={this.props.TabId}>
                <h1>{this.props.Title}</h1>
                {this.props.children}
            </div>
            );
    }
});

InfoTabPane = React.createClass({
    mixins: [React.addons.PureRenderMixin],
    render: function() {
        return <TabPane Title="Welcome to the Data Query Tool"
                    TabId={this.props.TabId} Active={true}>
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
                            <dt>Manage Saved Queries</dt>
                            <dd>Either save your current query or see the criteria of previously saved quer  ies here.</dd>
                          </dl>
                </TabPane>
    }
});

FieldSelectTabPane = React.createClass({
    mixins: [React.addons.PureRenderMixin],
    render: function() {
        return <TabPane TabId={this.props.TabId}>
                    <FieldSelector title="Fields"
                        items={this.props.categories}
                        onFieldChange={this.props.onFieldChange}
                        selectedFields={this.props.selectedFields}
                    />
            </TabPane>
    }

});

FilterSelectTabPane = React.createClass({
    mixins: [React.addons.PureRenderMixin],
    render: function() {
        return <TabPane TabId={this.props.TabId}>
                    <FieldSelector title="Filters"
                        items={this.props.categories}
                        type="Criteria"
                        onFieldChange={this.props.onFieldChange}
                        onCriteriaChange={this.props.onCriteriaChange}
                        selectedFields={this.props.selectedFields} Criteria={this.props.Criteria}
                    />
               </TabPane>
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
        return <TabPane TabId={this.props.TabId}>
                    <h2>Query Criteria</h2>{criteria} {buttons}
                    <h2>Data</h2>
                    <DataTable
                        Headers={this.props.Fields}
                        Identifiers={this.props.Sessions}
                        Data={this.props.Data}
                    />
               </TabPane>
    }
});

ScatterplotGraph = React.createClass({
    render: function() {
        return (
            <div>
                <h2>Scatterplot</h2>

                <div className="col-xs-4 col-md-3">
                    Column for X Axis
                </div>
                <div className="col-xs-8 col-md-3">
                    <select>
                        <option>None</option>
                    </select>
                </div>

                <div className="col-xs-4 col-md-3">
                    Column for Y Axis
                </div>
                <div className="col-xs-8 col-md-3">
                    <select>
                        <option>None</option>
                    </select>
                </div>

                <div className="col-xs-4 col-md-3">
                    Group by column
                </div>
                <div className="col-xs-8 col-md-3">
                    <select>
                        <option>None</option>
                    </select>
                </div>
            </div>
        );
    }
});
StatsVisualizationTabPane = React.createClass({
    getDefaultProps: function() {
        return {
            'Data' : []
        };
    },
    getInitialState: function() {
        return {
            'displayed': false
        }
    },
    render: function() {
        if(this.state.displayed === false) {
            var content = <div>Statistics not yet calculated.</div>;
            return <TabPane content={content} TabId={this.props.TabId} />;
        }
        if(this.props.Data.length === 0) {
            var content = <div>Could not calculate stats, query not run</div>;
            return <TabPane content={content} TabId={this.props.TabId} />;
        }
        var stats = jStat(this.props.Data),
            min = stats.min(),
            max = stats.max(),
            stddev = stats.stdev(),
            mean = stats.mean(),
            meandev = stats.meandev(),
            meansqerr = stats.meansqerr(),
            quartiles = stats.quartiles(),
            rows = [];


      for(var i = 0; i < this.props.Fields.length; i += 1) {
          rows.push(<tr>
              <td>{this.props.Fields[i]}</td>
              <td>{min[i]}</td>
              <td>{max[i]}</td>
              <td>{stddev[i]}</td>
              <td>{mean[i]}</td>
              <td>{meandev[i]}</td>
              <td>{meansqerr[i]}</td>
              <td>{quartiles[i][0]}</td>
              <td>{quartiles[i][1]}</td>
              <td>{quartiles[i][2]}</td>
          </tr>);
      }

      var statsTable = (
          <table className="table table-hover table-primary table-bordered colm-freeze">
            <thead>
                <tr className="info">
                    <th>Measure</th>
                    <th>Min</th>
                    <th>Max</th>
                    <th>Standard Deviation</th>
                    <th>Mean</th>
                    <th>Mean Deviation</th>
                    <th>Mean Squared Error</th>
                    <th>First Quartile</th>
                    <th>Second Quartile</th>
                    <th>Third Quartile</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
          </table>
      );

      var content = (
          <div>
          <h2>Basic Statistics</h2>
          {statsTable}

          <ScatterplotGraph />
          </div>
          );
      return <TabPane content={content} TabId={this.props.TabId} />;
    }
});

SaveQueryDialog = React.createClass({
    getInitialState: function() {
        return {
            'queryName' : '',
            'shared' : false
        };
    },
    editName: function(e) {
        this.setState({ queryName : e.target.value });
    },
    editPublic: function(e) {
        this.setState({ shared : e.target.checked });
    },
    onSaveClicked: function() {
        // Should do validation before doing anything here.. ie query name is entered, doesn't already
        // exist, there are fields selected..
        if(this.props.onSaveClicked) {
            this.props.onSaveClicked(this.state.queryName, this.state.shared);
        }
    },
    onDismissClicked: function() {
        if(this.props.onDismissClicked) {
            this.props.onDismissClicked();
        }
    },
    render: function() {
        return (
            <div className="modal show">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" aria-label="Close" onClick={this.onDismissClicked}><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title" id="myModalLabel">Save Current Query</h4>
                        </div>
                        <div className="modal-body">
                            <p>Enter the name you would like to save your query under here:</p>
                            <div className="input-group">
                                Query Name: <input type="text" className="form-control" placeholder="My Query" value={this.state.queryName} onChange={this.editName} />
                            </div>
                            <p>Make query a publicly shared query? <input type="checkbox" checked={this.state.shared ? 'checked' : ''} onChange={this.editPublic} aria-label="Shared Query" /></p>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" onClick={this.onDismissClicked}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={this.onSaveClicked} >Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
            );
    }
});
ManageSavedQueryRow = React.createClass({
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
        if(this.props.Query.Fields) {
            for(var i = 0; i < this.props.Query.Fields.length; i += 1) {
                fields.push(<li>{this.props.Query.Fields[i]}</li>);
            }
        }

        if(fields.length === 0) {
            fields.push(<li>No fields defined</li>);
        }

        if(this.props.Query.Conditions) {
            for(var i = 0; i < this.props.Query.Conditions.length; i += 1) {
                var filter = this.props.Query.Conditions[i];
                filters.push(<li>{filter.Field} {filter.Operator} {filter.Value}</li>);
            }
        }
        if(filters.length === 0) {
            filters.push(<li>No filters defined</li>);
        }
        return (
                    <tr>
                        <td>{this.props.Name}</td>
                        <td><ul>{fields}</ul></td>
                        <td><ul>{filters}</ul></td>
                    </tr>
        );
    }
});
ManageSavedQueriesTabPane = React.createClass({
    dismissDialog: function() {
        this.setState({ 'savePrompt' : false });
    },
    getInitialState: function() {
        return {
            'savePrompt' : false,
            'queriesLoaded' : false,
            'queries' : {}
        };
    },
    saveQuery: function() {
        this.setState({ 'savePrompt' : true });
    },
    savedQuery: function(name, shared) {
        if(this.props.onSaveQuery) {
            this.props.onSaveQuery(name, shared);
        }
        this.setState({ 'savePrompt' : false });
    },
    getDefaultProps: function() {
        return {
            userQueries: [],
            globalQueries: [],
            queriesLoaded: false,
            queryDetails: {}
        };
    },
    render: function() {
        var queryRows = [];
        if(this.props.queriesLoaded) {
            for(var i = 0; i < this.props.userQueries.length; i += 1) {
                var query = this.props.queryDetails[this.props.userQueries[i]];
                var name = "Unnamed Query: " + this.props.userQueries[i];
                if(query.Meta.name) {
                    name = query.Meta.name;
                }

                queryRows.push(
                        <ManageSavedQueryRow Name={name} Query={query} />
                    );

            }
        } else {
            queryRows.push(
                <tr>
                    <td colSpan="3">Loading saved query details</td>
                </tr>
            );
        }

        var savePrompt = '';
        if(this.state.savePrompt) {
            savePrompt = <SaveQueryDialog onDismissClicked={this.dismissDialog} onSaveClicked={this.savedQuery}/>;

        }
        var content = (
            <div>
                <h2>Your currently saved queries</h2>
                <button onClick={this.saveQuery}>Save Current Query</button>
                <table className="table table-hover table-primary table-bordered colm-freeze">
                    <thead>
                        <tr className="info">
                            <th>Query Name</th>
                            <th>Fields</th>
                            <th>Filters</th>
                        </tr>
                    </thead>
                    <tbody>
                        {queryRows}
                    </tbody>
                </table>
                {savePrompt}
            </div>
        );
        return <TabPane content={content} TabId={this.props.TabId} />;
    }
});
