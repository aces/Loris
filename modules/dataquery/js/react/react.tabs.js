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
                <dt>Manage Saved Queries</dt>
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
    componentDidMount: function() {
        var promises = [];
        var that = this;
        for (var i = 0; i < this.props.userQueries.length; i += 1) {
            var curRequest;
            curRequest = Promise.resolve(
                $.ajax("AjaxHelper.php?Module=dataquery&script=GetDoc.php&DocID=" + that.props.userQueries[i]), {
                    data: {
                        DocID: that.props.userQueries[i]
                    },
                    dataType: 'json'
                }).then(function(value) {
                    var queries = that.state.queries;

                    queries[value._id] = value;
                    that.setState({ 'queries' : queries});
                });
            promises.push(curRequest);
        }

        var allDone = Promise.all(promises).then(function(value) {
            that.setState({ 'queriesLoaded' : true });

        });
    },
    getInitialState: function() {
        return {
            'savePrompt' : false,
            'queriesLoaded' : false,
            'queries' : {}
        };
    },
    saveQuery: function() {
        if(this.props.onSaveQuery) {
            this.props.onSaveQuery(); //todo: add (name, shared parameters)
        }
    },
    getDefaultProps: function() {
        return {
            userQueries: [],
            globalQueries: []
        };
    },
    render: function() {
        var queryRows = [];
        if(this.state.queriesLoaded) {
            for(var i = 0; i < this.props.userQueries.length; i += 1) {
                var query = this.state.queries[this.props.userQueries[i]];
                queryRows.push(
                        <ManageSavedQueryRow Name={this.props.userQueries[i]} Query={query} />
                    );

            }
        } else {
            queryRows.push(
                <tr>
                    <td colSpan="3">Loading saved query details</td>
                </tr>
            );
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
                <SaveQueryDialog />
            </div>
        );
        return <TabPane content={content} TabId={this.props.TabId} />;
    }
});
