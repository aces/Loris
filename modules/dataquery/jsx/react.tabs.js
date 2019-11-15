/**
 *  The following file contains the components used for displaying the tab content
 *
 *  @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 *  @author   Jordan Stirling <jstirling91@gmail.com>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://github.com/mohadesz/Loris-Trunk
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

/*
 *  The following componet is used to indicate to users that their data is currently
 *  loading
 */
class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {};

  }

  render() {
    return (
      <div className='row'>
        <h3 className='text-center loading-header'>
          We are currently working hard to load your data. Please be patient.
        </h3>
        <div className='spinner'>
          <div className='bounce1'></div>
          <div className='bounce2'></div>
          <div className='bounce3'></div>
        </div>
      </div>
    );
  }
}

/*
 *  The following component is the base component for displaying the tab's contnet
 */
class TabPane extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let classList = 'tab-pane';
    if (this.props.Active) {
      classList += ' active'
    }
    if (this.props.Loading) {
      return (
        <div className={classList} id={this.props.TabId}>
          <Loading/>
        </div>
      );
    }
    return (
      <div key={this.props.TabId}className={classList} id={this.props.TabId}>
        <h1>{this.props.Title}</h1>
        {this.props.children}
      </div>
    );
  }
}

/*
 *  The following component is used for displaying the info tab content
 */
class InfoTabPane extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <TabPane
        Title='Welcome to the Data Query Tool'
        TabId={this.props.TabId}
        Active={this.props.Active}
        Loading={this.props.Loading}
      >
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
          <dd>Either save your current query or see the criteria of previously saved quer ies here.</dd>
        </dl>
      </TabPane>
    );
  }
}

/*
 *  The following component is used for displaying the field select tab content
 */
class FieldSelectTabPane extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <TabPane
        TabId={this.props.TabId}
        Loading={this.props.Loading}
        Active={this.props.Active}
      >
        <FieldSelector
          title='Fields'
          items={this.props.categories}
          onFieldChange={this.props.onFieldChange}
          selectedFields={this.props.selectedFields || ''}
          Visits={this.props.Visits}
          fieldVisitSelect={this.props.fieldVisitSelect}
        />
      </TabPane>
    );
  }
}

/*
 *  The following component is used for displaying the filter builder tab content
 */
class FilterSelectTabPane extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <TabPane TabId={this.props.TabId} Loading={this.props.Loading}>
        <FilterBuilder items={this.props.categories}
                       updateFilter={this.props.updateFilter}
                       filter={this.props.filter}
                       Visits={this.props.Visits}
                       Active={this.props.Active}
        />
      </TabPane>
    );
  }
}

/*
 *  The following component is used for displaying the view data tab content
 */
class ViewDataTabPane extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sessions: []
    };
    this.runQuery = this.runQuery.bind(this);
    this.changeDataDisplay = this.changeDataDisplay.bind(this);
    this.getOrCreateProgressElement = this.getOrCreateProgressElement.bind(this);
    this.getOrCreateDownloadLink = this.getOrCreateDownloadLink.bind(this);
    this.downloadData = this.downloadData.bind(this);
  }

  runQuery() {
    this.props.runQuery(this.props.Fields, this.props.Sessions);
  }

  changeDataDisplay(displayID) {
    // Wrapper function to change the data display type
    this.props.changeDataDisplay(displayID);
  }

  getOrCreateProgressElement(id) {
    // Helper function to display the progress of downloading the downloadable
    // fields into a ZIP folder
    let element = document.getElementById(id),
      progress;

    if (element) {
      return element;
    }

    progress = document.getElementById('progress');

    element = document.createElement('div');
    element.setAttribute('id', id);
    progress.appendChild(element);
    return element;
  }

  getOrCreateDownloadLink(fileName, type) {
    // Helper function to create and click a downloadable link to download the
    // downloadable fields into a ZIP folder
    let element = document.getElementById('DownloadLink' + fileName),
      parentEl,
      el2;

    if (element) {
      return element;
    }


    parentEl = document.getElementById('downloadlinksUL');

    element = document.createElement('a');
    element.download = fileName;
    element.type = type;
    element.textContent = 'Zip file: ' + fileName;
    element.setAttribute('id', 'DownloadLink' + fileName);
    el2 = document.createElement('li');
    el2.appendChild(element);
    parentEl.appendChild(el2);
    return element;
  }

  downloadData() {
    // Download the downloadable fields into a ZIP folder
    // Makes use of a web worker to format and download the data
    let zip = new JSZip(),
      i = 0,
      FileList = this.props.FileData,
      CompleteMask = new Array(FileList.length),
      saveworker,
      dataURLs = [],
      multiLinkHandler = (buffer) => {
        return ((ce) => {
          let downloadLink = document.getElementById('DownloadLink'),
            dv = new DataView(buffer),
            blb;

          ce.preventDefault();
          blb = new Blob([dv], {type: 'application/zip'});

          downloadLink.href = window.URL.createObjectURL(blb);
          downloadLink.download = this.download;
          downloadLink.type = 'application/zip';
          downloadLink.click();

          window.URL.revokeObjectURL(downloadLink.href);
        });
      };

    // Does this work if we hold a global reference instead of a closure
    // to the object URL?
    window.dataBlobs = [];

    if (FileList.length < 100 || confirm('You are trying to download more than 100 files. This may be slow or crash your web browser.\n\nYou may want to consider splitting your query into more, smaller queries by defining more restrictive filters.\n\nPress OK to continue with attempting to download current files or cancel to abort.')) {
      saveworker = new Worker(loris.BaseURL + '/dataquery/js/workers/savezip.js');
      saveworker.addEventListener('message', (e) => {
        let link,
          progress,
          FileName,
          NewFileName,
          downloadLinks,
          i;
        if (e.data.cmd === 'SaveFile') {
          progress = this.getOrCreateProgressElement('download_progress');
          //progress.textContent = "Downloaded files";
          //hold a reference to the blob so that chrome doesn't release it. This shouldn't
          //be required.
          window.dataBlobs[e.data.FileNo - 1] = new Blob([e.data.buffer], {type: 'application/zip'});
          ;
          dataURLs[e.data.FileNo - 1] = window.URL.createObjectURL(window.dataBlobs[e.data.FileNo - 1]);

          link = this.getOrCreateDownloadLink(e.data.Filename, 'application/zip');
          link.href = dataURLs[e.data.FileNo - 1];
          //link.onclick = multiLinkHandler(e.data.buffer);
          //link.href = "#";
          progress = this.getOrCreateProgressElement('zip_progress');
          progress.textContent = '';

        } else if (e.data.cmd === 'Progress') {
          progress = this.getOrCreateProgressElement('download_progress');
          progress.innerHTML = 'Downloading files: <progress value="' + e.data.Complete + '" max="' + e.data.Total + '">' + e.data.Complete + ' out of ' + e.data.Total + '</progress>';
        } else if (e.data.cmd === 'Finished') {
          if (dataURLs.length === 1) {
            $('#downloadlinksUL li a')[0].click();
          }

          if (dataURLs.length > 1) {
            progress = document.getElementById('downloadlinks');
            progress.style.display = 'initial';

            downloadLinks = $('#downloadlinksUL li a');
            for (i = 0; i < dataURLs.length; i += 1) {
              FileName = downloadLinks[i].id.slice('DownloadLinkFiles-'.length, -4);
              NewFileName = 'files-' + FileName + 'of' + e.data.NumFiles + '.zip';
              downloadLinks[i].download = NewFileName;
              downloadLinks[i].href = dataURLs[i];
              downloadLinks[i].textContent = 'Zip file: ' + NewFileName;
            }
          }
          progress = this.getOrCreateProgressElement('download_progress');
          progress.textContent = 'Finished generating zip files';
          //this.terminate();

        } else if (e.data.cmd === 'CreatingZip') {
          progress = this.getOrCreateProgressElement('zip_progress');
          progress.textContent = 'Creating a zip file with current batch of downloaded files. Process may be slow before proceeding.';
        }

      });

      saveworker.postMessage({Files: FileList, BaseURL: loris.BaseURL});
    }
  }

  render() {
    let downloadData;
    let buttons = (
      <div className='row'>
        <div className='commands col-xs-12 form-group'>
          <button className='btn btn-primary' onClick={this.runQuery}>Run Query</button>
          <button className='btn btn-primary' onClick={this.downloadData}>Download Data as ZIP</button>
        </div>
        <div id='progress' className='col-xs-12'></div>
        <div id='downloadlinks' className='col-xs-12'>
          <ul id='downloadlinksUL'></ul>
        </div>
      </div>
    );
    let criteria = [];
    for (let el in  this.props.Criteria) {
      if (!this.props.Criteria.hasOwnProperty(el)) {
        continue;
      }
      let item = this.props.Criteria[el];
      if (item === undefined) {
        criteria.push(
          <div className='alert alert-warning' role='alert'>
            {el} has been added as a filter but not had criteria defined.
          </div>
        );
      } else {
        criteria.push(
          <div className='row'>
            <span className='col-sm-3'>{el}</span>
            <span className='col-sm-3'>{item.operator}</span>
            <span className='col-sm-3'>{item.value}</span>
          </div>
        );
      }

    }
    return (
      <TabPane
        TabId={this.props.TabId}
        Loading={this.props.Loading}
        Active={this.props.Active}
      >
        <h2>Query Criteria</h2>
        {criteria}
        {buttons}
        <div className='form-group form-horizontal row'>
          <label htmlFor='selected-input' className='col-sm-1 control-label'>Data</label>
          <div className='col-sm-4'>
            <div className='btn-group'>
              <button id='selected-input' type='button' className='btn btn-default dropdown-toggle' data-toggle='dropdown'>
                <span id='search_concept'>{this.props.displayType}</span>
                <span className='caret'></span>
              </button>
              <ul className='dropdown-menu' role='menu'>
                <li onClick={this.changeDataDisplay.bind(this, 0)}>
                  <div className='col-sm-12'>
                    <h5 className="">Cross-sectional</h5>
                  </div>
                </li>
                <li onClick={this.changeDataDisplay.bind(this, 1)}>
                  <div className='col-sm-12'>
                    <h5 className=''>Longitudinal</h5>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <StaticDataTable
          Headers={this.props.RowHeaders}
          RowNumLabel='Identifiers'
          Data={this.props.Data}
          RowNameMap={this.props.RowInfo}
        />
      </TabPane>
    );
  }
}
ViewDataTabPane.propTypes = {
  runQuery: PropTypes.func.isRequired,
};

/*
 *  The following component is used for displaying the scatterplot graph
 *  in the stats tab using flot. The following code is a modification of
 *  code used in the couchApp implementation of the DQT
 */
class ScatterplotGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.lsFit = this.lsFit.bind(this);
    this.minmaxx = this.minmaxx.bind(this);
    this.updateScatterplot = this.updateScatterplot.bind(this);
  }

  lsFit(data) {
    let i = 0,
      means = jStat(data).mean(),
      xmean = means[0],
      ymean = means[1],
      interim = 0,
      numerator = 0,
      denominator = 0,
      slope,
      xi,
      yi;

    for (i = 0; i < data.length; i += 1) {
      xi = data[i][0];
      yi = data[i][1];
      numerator += (xi - xmean) * (yi - ymean);
      denominator += ((xi - xmean) * (xi - xmean));
    }

    slope = numerator / denominator;

    return [(ymean - slope * xmean), slope];
  }

  minmaxx(arr) {
    let i, min, max;

    for (i = 0; i < arr.length; i += 1) {
      if (arr[i][0] < min || min === undefined) {
        if (arr[i][0] !== undefined && arr[i][0] !== null) {
          min = arr[i][0];
        }
      }
      if (arr[i][0] > max || max === undefined) {
        if (arr[i][0] !== undefined && arr[i][0] !== null) {
          max = arr[i][0];
        }
      }
    }
    return [min, max];
  }

  updateScatterplot() {
    let xaxis = document.getElementById('scatter-xaxis').value,
      yaxis = document.getElementById('scatter-yaxis').value,
      grouping = document.getElementById('scatter-group').value,
      data = this.props.Data,
      points = [],
      min,
      max,
      field1 = [],
      field2 = [],
      grouped_points = {},
      i = 0,
      group_label,
      minmax,
      LS,
      slope,
      start,
      plots = [],
      label,
      plotY = (x) => {
        return [x, start + (slope * x)];
      },
      dataset;

    for (i = 0; i < data.length; i += 1) {
      points.push([data[i][xaxis], data[i][yaxis]]);
      field1.push(data[i][xaxis]);
      field2.push(data[i][yaxis]);
      if (grouping) {
        group_label = data[i][grouping];
        if (!(grouped_points[group_label] instanceof Array)) {
          grouped_points[group_label] = [];
        }
        grouped_points[group_label].push([data[i][xaxis], data[i][yaxis]]);
      }
    }

    if (grouping === 'ungrouped') {
      minmax = this.minmaxx(points);
      min = minmax[0];
      max = minmax[1];
      LS = this.lsFit(points);
      slope = LS[1];
      start = LS[0];

      $.plot('#scatterplotdiv', [{

        label: 'Data Points',
        data: points,
        points: {show: true}
      }, // Least Squares Fit
        {
          label: 'Least Squares Fit',
          data: jStat.seq(min, max, 3, plotY),
          lines: {show: true}
        }], {});
    } else {
      minmax = this.minmaxx(points);
      min = minmax[0];
      max = minmax[1];
      i = 0;

      for (dataset in grouped_points) {
        if (grouped_points.hasOwnProperty(dataset)) {
          label = document.getElementById("scatter-group").selectedOptions.item(0).textContent + " = " + dataset;
          plots.push({
            color: i,
            label: dataset,
            data: grouped_points[dataset],
            points: {show: true}
          });
          LS = this.lsFit(grouped_points[dataset]);
          //LS = lsFit(grouped_points[dataset].convertNumbers());
          slope = LS[1];
          start = LS[0];
          plots.push({
            color: i,
            // label: "LS Fit for " + dataset,
            data: jStat.seq(min, max, 3, plotY),
            lines: {show: true}
          });
          i += 1;
        }
      }
      $.plot('#scatterplotdiv', plots, {});
    }

    $('#correlationtbl tbody').children().remove();
    $('#correlationtbl tbody').append('<tr><td>' + jStat.covariance(field1, field2) + '</td><td>' + jStat.corrcoeff(field1, field2) + '</td></tr>');
  }

  render() {
    let options = this.props.Fields.map((element, key) => {
        console.log(element);
        return (
          <option value={key}>
            {element}
          </option>
        );
      }),
      scatterStyle = {
        width: '500px',
        height: '500px'
      };
    return (
      <div>
        <h2>Scatterplot</h2>

        <div className='col-xs-4 col-md-3'>
          Column for X Axis
        </div>
        <div className='col-xs-8 col-md-3'>
          <select id='scatter-xaxis' onChange={this.updateScatterplot}>
            <option>None</option>
            {options}
          </select>
        </div>

        <div className='col-xs-4 col-md-3'>
          Column for Y Axis
        </div>
        <div className='col-xs-8 col-md-3'>
          <select id='scatter-yaxis' onChange={this.updateScatterplot}>
            <option>None</option>
            {options}
          </select>
        </div>

        <div className='col-xs-4 col-md-3'>
          Group by column
        </div>
        <div className='col-xs-8 col-md-3'>
          <select id='scatter-group' onChange={this.updateScatterplot}>
            <option>None</option>
            {options}
          </select>
        </div>
        <h3>Scatterplot</h3>
        <div id='scatterplotdiv' style={scatterStyle}></div>
        <h3>Statistics</h3>
        <table id='correlationtbl'>
          <thead>
          <tr>
            <th>Covariance</th>
            <th>Correlation Coefficient</th>
          </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      </div>
    );
  }
}

/*
 *  The following component is used for displaying the stats tab content
 */
class StatsVisualizationTabPane extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayed: false
    };
  }

  render() {
    let content = (
      <div>Statistics not yet calculated.</div>
    );
    // if(this.state.displayed === false) {
    //     var content = <div>Statistics not yet calculated.</div>;
    //     // return <TabPane content={content} TabId={this.props.TabId} />;
    // } else
    if (this.props.Data.length === 0) {
      let content = <div>Could not calculate stats, query not run</div>;
      // return <TabPane content={content} TabId={this.props.TabId} />;
    } else {
      let stats = jStat(this.props.Data),
        min = stats.min(),
        max = stats.max(),
        stddev = stats.stdev(),
        mean = stats.mean(),
        meandev = stats.meandev(),
        meansqerr = stats.meansqerr(),
        quartiles = stats.quartiles(),
        rows = [];


      for (let i = 0; i < this.props.Fields.length; i += 1) {
        rows.push(<tr key={'fields_'.concat(i)}>
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

      let statsTable = (
        <table className='table table-hover table-primary table-bordered colm-freeze'>
          <thead>
          <tr className='info'>
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

      content = (
        <div>
          <h2>Basic Statistics</h2>
          {statsTable}

          <ScatterplotGraph
            Fields={this.props.Fields}
            Data={this.props.Data}
          />
        </div>
      );
    }
    return (
      <TabPane TabId={this.props.TabId} Loading={this.props.Loading} Active={this.props.Active}>
        {content}
      </TabPane>
    );
  }
}
StatsVisualizationTabPane.propTypes = {
  Data: PropTypes.array,
};
StatsVisualizationTabPane.defaultProps = {
  Data: []
};

/*
 *  The following component is used for displaying a popout dialog for saving the current
 *  query
 */
class SaveQueryDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queryName: '',
      shared: false
    };
    this.editName = this.editName.bind(this);
    this.editPublic = this.editPublic.bind(this);
    this.onSaveClicked = this.onSaveClicked.bind(this);
    this.onDismissClicked = this.onDismissClicked.bind(this);
  }

  editName(e) {
    this.setState({queryName: e.target.value});
  }

  editPublic(e) {
    this.setState({shared: e.target.checked});
  }

  onSaveClicked() {
    // Should do validation before doing anything here.. ie query name is entered, doesn't already
    // exist, there are fields selected..
    if (this.props.onSaveClicked) {
      this.props.onSaveClicked(this.state.queryName, this.state.shared);
    }
  }

  onDismissClicked() {
    if (this.props.onDismissClicked) {
      this.props.onDismissClicked();
    }
  }

  render() {
    return (
      <div className='modal show'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <button type='button' className='close' aria-label='Close' onClick={this.onDismissClicked}><span aria-hidden='true'>&times;</span></button>
              <h4 className='modal-title' id='myModalLabel'>Save Current Query</h4>
            </div>
            <div className='modal-body'>
              <p>Enter the name you would like to save your query under here:</p>
              <div className='input-group'>
                Query Name: <input type='text' className='form-control' placeholder='My Query' value={this.state.queryName} onChange={this.editName}/>
              </div>
              <p>Make query a publicly shared query? <input type='checkbox' checked={this.state.shared ? 'checked' : ''} onChange={this.editPublic} aria-label='Shared Query'/></p>

            </div>
            <div className='modal-footer'>
              <button type='button' className='btn btn-default' onClick={this.onDismissClicked}>Close</button>
              <button type='button' className='btn btn-primary' onClick={this.onSaveClicked}>Save changes</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

/*
 *  The following component is used for displaying the filter of a individual query in a tree
 *  like structure
 */
class ManageSavedQueryFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let filterItem,
      filter = this.props.filterItem;
    if (filter.activeOperator) {
      let logicOp = 'AND',
        children = filter.children.map((element, key) => {
          return <ManageSavedQueryFilter
            filterItem={element}
          />
        });
      if (filter.activeOperator === 1) {
        logicOp = 'OR'
      }
      return (
        <li>
          <span>{logicOp}</span>
          <ul className='savedQueryTree'>
            {children}
          </ul>
        </li>
      )
    } else {
      filter = this.props.filterItem;
      if (filter.instrument) {
        let operator;
        switch (filter.operator) {
          case 'equal':
            operator = '=';
            break;
          case 'notEqual':
            operator = '!=';
            break;
          case 'lessThanEqual':
            operator = '<=';
            break;
          case 'greaterThanEqual':
            operator = '>=';
            break;
          default:
            operator = filter.operator;
            break;
        }
        filterItem = (
          <span>{filter.instrument},{filter.field} {operator} {filter.value}</span>
        )
      } else {
        filterItem = (
          <span>{filter.Field} {filter.Operator} {filter.Value}</span>
        )
      }
    }
    return (
      <li>{filterItem}</li>
    );
  }
}

/*
 *  The following component is used for displaying the individual saved queries in the
 *  manage saved queries tab
 */
class ManageSavedQueryRow extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let fields = [];
    let filters;
    if (this.props.Query.Fields && Array.isArray(this.props.Query.Fields)) {
      for (let i = 0; i < this.props.Query.Fields.length; i += 1) {
        fields.push(<li>{this.props.Query.Fields[i]}</li>);
      }
    } else if (this.props.Query.Fields) {
      for (let instrument in this.props.Query.Fields) {
        for (let field in this.props.Query.Fields[instrument]) {
          if (field === "allVisits") {
            continue;
          } else {
            fields.push(<li>{instrument},{field}</li>);
          }
        }
      }
    }

    if (fields.length === 0) {
      fields.push(<li>No fields defined</li>);
    }

    if (this.props.Query.Conditions) {
      let operator,
        filter;
      if (this.props.Query.Conditions.activeOperator) {
        if (this.props.Query.Conditions.children) {
          if (this.props.Query.Conditions.activeOperator === 0) {
            operator = (<span>AND</span>)
          } else {
            operator = (<span>OR</span>)
          }
          filter = this.props.Query.Conditions.children.map((element, key) => {
            return (
              <ManageSavedQueryFilter
                key={key}
                filterItem={element}
              />
            );
          });
        } else {
          operator = (<span>No filters defined</span>);
        }
      } else {
        if (this.props.Query.Conditions.length === 0) {
          operator = (<span>No filters defined</span>);
        } else {
          operator = (<span>AND</span>);
          filter = this.props.Query.Conditions.map((element, key) => {
            return (
              <ManageSavedQueryFilter
                key={key}
                filterItem={element}
              />
            );
          });
        }
      }
      filters = (
        <div className='tree'>
          <ul className='firstUL savedQueryTree'>
            <li>
              {operator}
              <ul className='savedQueryTree'>
                {filter}
              </ul>
            </li>
          </ul>
        </div>
      );
    }
    if (!filters) {
      filters = (<strong>No filters defined</strong>);
    }
    return (
      <tr>
        <td>{this.props.Name}</td>
        <td>
          <ul>{fields}</ul>
        </td>
        <td>{filters}</td>
      </tr>
    );
  }
}
ManageSavedQueryRow.propTypes = {
  Name: PropTypes.string,
  Query: PropTypes.object,
};
ManageSavedQueryRow.defaultProps = {
  Name: 'Unknown',
  Query: {
    Fields: []
  },
};

/*
 *  The following component is used for displaying the manage saved queries tab content
 */
class ManageSavedQueriesTabPane extends Component {
  constructor(props) {
    super(props);
    this.state = {
      savePrompt: false,
      queriesLoaded: false,
      queries: {}
    };
    this.dismissDialog = this.dismissDialog.bind(this);
    this.saveQuery = this.saveQuery.bind(this);
    this.savedQuery = this.savedQuery.bind(this);
  }

  dismissDialog() {
    this.setState({savePrompt: false});
  }

  saveQuery() {
    this.setState({savePrompt: true});
  }

  savedQuery(name, shared) {
    if (this.props.onSaveQuery) {
      this.props.onSaveQuery(name, shared, 'false');
    }
    this.setState({savePrompt: false});
  }

  render() {
    let queryRows = [];
    if (this.props.queriesLoaded) {
      for (let i = 0; i < this.props.userQueries.length; i += 1) {
        let query = this.props.queryDetails[this.props.userQueries[i]];
        let name = 'Unnamed Query: ' + this.props.userQueries[i];
        if (query.Meta.name) {
          name = query.Meta.name;
        }
        queryRows.push(
          <ManageSavedQueryRow Name={name} Query={query}/>
        );
      }
    } else {
      queryRows.push(
        <tr key='loading'>
          <td colSpan="3">Loading saved query details</td>
        </tr>
      );
    }

    let savePrompt = '';
    if (this.state.savePrompt) {
      savePrompt = <SaveQueryDialog onDismissClicked={this.dismissDialog} onSaveClicked={this.savedQuery}/>;

    }
    let content = (
      <div>
        <h2>Your currently saved queries</h2>
        <button onClick={this.saveQuery}>Save Current Query</button>
        <table className='table table-hover table-primary table-bordered colm-freeze'>
          <thead>
          <tr key='info' className='info'>
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
    return (
      <TabPane TabId={this.props.TabId} Loading={this.props.Loading}>
        {content}
      </TabPane>
    );
  }
}
ManageSavedQueriesTabPane.propTypes = {
  userQueries: PropTypes.array,
  globalQueries: PropTypes.array,
  queriesLoaded: PropTypes.bool,
  queryDetails: PropTypes.object,
};
ManageSavedQueriesTabPane.defaultProps = {
  userQueries: [],
  globalQueries: [],
  queriesLoaded: false,
  queryDetails: {}
};

window.Loading = Loading;
window.TabPane = TabPane;
window.InfoTabPane = InfoTabPane;
window.FieldSelectTabPane = FieldSelectTabPane;
window.FilterSelectTabPane = FilterSelectTabPane;
window.ViewDataTabPane = ViewDataTabPane;
window.ScatterplotGraph = ScatterplotGraph;
window.StatsVisualizationTabPane = StatsVisualizationTabPane;
window.SaveQueryDialog = SaveQueryDialog;
window.ManageSavedQueryFilter = ManageSavedQueryFilter;
window.ManageSavedQueryRow = ManageSavedQueryRow;
window.ManageSavedQueriesTabPane = ManageSavedQueriesTabPane;

export default {
  Loading,
  TabPane,
  InfoTabPane,
  FieldSelectTabPane,
  FilterSelectTabPane,
  ViewDataTabPane,
  ScatterplotGraph,
  StatsVisualizationTabPane,
  SaveQueryDialog,
  ManageSavedQueryFilter,
  ManageSavedQueryRow,
  ManageSavedQueriesTabPane
};
