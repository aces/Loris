/**
 *  The following file contains the components used for displaying the tab content
 *
 *  @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 *  @author   Jordan Stirling <jstirling91@gmail.com>
*   @author   Alizée Wickenheiser <alizee.wickenheiser@mcgill.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://github.com/mohadesz/Loris-Trunk
 */

import React, {Component, useState} from 'react';
import PropTypes from 'prop-types';

/*
 *  The following component is used to indicate to users
 *  that their data is currently loading.
 */
const Loading = (props) => {
  return (
    <div className='row' style={{padding: '60px 0 0 0'}}>
      <h2 className='text-center loading-header'>
        We are currently working hard to load your data.
      </h2>
      <h3 className='text-center loading-header'>
        Please be patient 😴
      </h3>
      <div className='spinner'>
        <div className='bounce1'/>
        <div className='bounce2'/>
        <div className='bounce3'/>
      </div>
    </div>
  );
};

/*
 *  The following component is the base component for displaying the tab's contnet
 */
const TabPane = (props) => {
  let classList = 'tab-pane';
  if (props.Active) {
    classList += ' active'
  }
  if (props.Loading) {
    return (
      <div className={classList} id={props.TabId}>
        <Loading/>
      </div>
    );
  }
  return (
    <div key={props.TabId}className={classList} id={props.TabId}>
      <h1>{props.Title}</h1>
      {props.children}
    </div>
  );
};

/*
 *  The following component is used for displaying the info tab content
 */
const InfoTabPane = (props) => {
  return (
    <TabPane
      Title='Welcome to the Data Query Tool'
      TabId={props.TabId}
      Active={props.Active}
      Loading={props.Loading}
    >
      <p>Data was last updated on {props.UpdatedTime}.</p>
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
};

/*
 *  The following component is used for displaying the field select tab content
 */
const FieldSelectTabPane = (props) => {
  return (
    <TabPane
      TabId={props.TabId}
      Loading={props.Loading}
      Active={props.Active}
    >
      <FieldSelector
        title='Fields'
        items={props.categories}
        onFieldChange={props.onFieldChange}
        selectedFields={props.selectedFields}
        Visits={props.Visits}
        fieldVisitSelect={props.fieldVisitSelect}
      />
    </TabPane>
  );
};

/*
 *  The following component is used for displaying the filter builder tab content
 */
const FilterSelectTabPane = (props) => {
  return (
    <TabPane TabId={props.TabId} Loading={props.Loading}>
      <FilterBuilder items={props.categories}
                     updateFilter={props.updateFilter}
                     filter={props.filter}
                     Visits={props.Visits}
                     Active={props.Active}
      />
    </TabPane>
  );
};

/*
 *  The following component is used for displaying the view data tab content
 */
class ViewDataTabPane extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sessions: [],
      dataDisplay: 'Cross-sectional',
      runQueryClicked: false,
    };
    this.runQuery = this.runQuery.bind(this);
    this.changeDataDisplay = this.changeDataDisplay.bind(this);
    this.getOrCreateProgressElement = this.getOrCreateProgressElement.bind(this);
    this.getOrCreateDownloadLink = this.getOrCreateDownloadLink.bind(this);
    this.downloadData = this.downloadData.bind(this);
    this.handleDataDisplay = this.handleDataDisplay.bind(this);
    this.setDataForCSV = this.setDataForCSV.bind(this);
    this.downloadDataCSV = this.downloadDataCSV.bind(this);
  }

  handleDataDisplay(formElement, value) {
    const state = Object.assign({}, this.state);
    state.dataDisplay = value;
    this.setState(state);
    switch (value) {
      case 'Cross-sectional':
        this.changeDataDisplay(0);
        break;
      case 'Longitudinal':
        this.changeDataDisplay(1);
        break;
      default:
        break;
    }
  }

  runQuery() {
    this.setState({
      runQueryClicked: true
    });
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

    if (FileList.length === 0) {
      alert('No Imaging Files to download');
    }

    if (FileList.length < 100 || confirm('You are trying to download more than 100 files. This may be slow or crash your web browser.\n\nYou may want to consider splitting your query into more, smaller queries by defining more restrictive filters.\n\nPress OK to continue with attempting to download current files or cancel to abort.')) {
      saveworker = new Worker(loris.BaseURL + '/dqt/js/workers/savezip.js');
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

  setDataForCSV(csvData) {
    this.setState({csvData: csvData});
  }

  downloadDataCSV() {
    const csvworker = new Worker(loris.BaseURL + '/js/workers/savecsv.js');

    csvworker.addEventListener('message', (e) => {
      if (e.data.cmd === 'SaveCSV') {
        const dataDate = new Date().toISOString();
        const dataURL = window.URL.createObjectURL(e.data.message);
        const link = document.createElement('a');
        link.download = 'data-' + dataDate + '.csv';
        link.type = 'text/csv';
        link.href = dataURL;
        document.body.appendChild(link);
        $(link)[0].click();
        document.body.removeChild(link);
      }
    });
    csvworker.postMessage({
      cmd: 'SaveFile',
      data: this.state.csvData,
      headers: this.props.Headers,
      identifiers: this.props.RowNameMap,
    });
  }

  render() {

    let otherButtons = this.state.runQueryClicked ? (
      <>
        <div className='flex-row-item'>
          <button className='visualized-data'
                  onClick={this.props.displayVisualizedData}>
            <span className='glyphicon glyphicon-picture'/>
            &nbsp;&nbsp;Visualized Data
          </button>
        </div>
        <div className='flex-row-item'>
          <div style={{
            width: 'auto',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}>
            <button className='btn btn-primary'
                    onClick={this.downloadDataCSV}
                    style={{minWidth: '200px',
                      minHeight: '30px',
                      alignSelf: 'center',
                      margin: '10px 0 10px 0'
                    }}>
              Download Table as CSV <span className='glyphicon glyphicon-download-alt'/>
            </button>
            <button className='btn btn-primary'
                    style={{
                      minWidth: '200px',
                      minHeight: '30px',
                      alignSelf: 'center'
                    }}
                    onClick={this.downloadData}>
              Download Imaging Files <span className='glyphicon glyphicon-download-alt'/>
            </button>
          </div>
        </div>
      </>
    ) : null;

    let buttons = (
      <>
        <div className='flex-row-container'>
          <div className='flex-row-item'>
            <button className='run-query'
                    onClick={this.runQuery}
                    disabled={(this.props.Fields === undefined || this.props.Fields.length === 0) ?? true}
            >
              <span className='glyphicon glyphicon-play'/>
              &nbsp;&nbsp;Run Query
            </button>
          </div>
          {otherButtons}
        </div>
      <div className='row'>
          <div id='progress' className='col-xs-12'/>
          <div id='downloadlinks' className='col-xs-12'>
            <ul id='downloadlinksUL'/>
          </div>
        </div>
      </>
    );
    let criteria = [];
    for (let el in this.props.Criteria) {
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

    const queryTable = this.state.runQueryClicked ? (
      <StaticDataTable
        Headers={this.props.RowHeaders}
        RowNumLabel='Identifiers'
        Data={this.props.Data}
        RowNameMap={this.props.RowInfo}
        displayCSV={false}
        getDataCSV={this.setDataForCSV}
      />
    ) : (
      <>
        <h2 className='col-xs-12' style={{color: '#0A3572'}}>
          The Query still needs to be run.
        </h2>
      </>
    );

    return (
      <TabPane
        TabId={this.props.TabId}
        Loading={this.props.Loading}
        Active={this.props.Active}
      >
        {criteria}
        {buttons}
        <div className='flex-row-container-second'>
          <div style={{
            maxWidth: '500px',
            border: '1px solid #b7ccd2',
            boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.05)'
          }}>
            <RadioElement
              name='dataDisplayRadioElement'
              options={{
                'Cross-sectional': 'Cross-sectional',
                'Longitudinal': 'Longitudinal'
              }}
              checked={this.state.dataDisplay}
              onUserInput={this.handleDataDisplay}
            />
          </div>
        </div>
        {queryTable}
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
    $('#correlationtbl tbody').append(
      '<tr><td>' + jStat.covariance(field1, field2) + '</td><td>' + jStat.corrcoeff(field1, field2) + '</td></tr>'
    );
  }

  render() {
    let options = this.props.Fields.map((element, key) => {
        return (
          <option key={key}
                  value={key}>
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
    let content;
    if (this.props.Data.length === 0) {
      content = (
        <h1 className='col-xs-12' style={{color: '#0A3572'}}>
          Visualized Data cannot be calculated until query is run.
        </h1>
      );
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
        rows.push(<tr key={'fields_' + i}>
          <td>{min && min[i] ? min[i].toString() : ''}</td>
          <td>{max && max[i] ? max[i].toString() : ''}</td>
          <td>{stddev && stddev[i] ? stddev[i].toString() : ''}</td>
          <td>{mean && mean[i] ? mean[i].toString() : ''}</td>
          <td>{meandev && meandev[i] ? meandev[i].toString() : ''}</td>
          <td>{meansqerr && meansqerr[i] ? meansqerr[i].toString() : ''}</td>
          <td>{quartiles && quartiles[i] && quartiles[i][0] ? quartiles[i][0].toString() : ''}</td>
          <td>{quartiles && quartiles[i] && quartiles[i][1] ? quartiles[i][1].toString() : ''}</td>
          <td>{quartiles && quartiles[i] && quartiles[i][2] ? quartiles[i][2].toString() : ''}</td>
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
StatsVisualizationTabPane.defaultProps = {
  Data: []
};
StatsVisualizationTabPane.propTypes = {
  Data: PropTypes.array,
};

/*
 *  The following component is used for displaying a popout dialog for saving the current
 *  query
 */
const SaveQueryDialog = (props) => {

  const [queryName, setQueryName] = useState('');
  const [shared, setShared] = useState(false);

  const editName = (e) => {
    setQueryName(e.target.value);
  };

  const editPublic = (e) => {
    setShared(e.target.checked);
  };

  const onSaveClicked = () => {
    // Should do validation before doing anything here.. ie query name is entered, doesn't already
    // exist, there are fields selected..
    if (props.onSaveClicked) {
      props.onSaveClicked(queryName, shared);
    }
  };

  const onDismissClicked = () => {
    if (props.onDismissClicked) {
      props.onDismissClicked();
    }
  };

  return (
    <div className='modal show' style={{marginTop: '100px'}}>
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <button type='button'
                    className='close'
                    aria-label='Close'
                    onClick={onDismissClicked}
            >
              <span aria-hidden='true'>&times;</span>
            </button>
            <h4 className='modal-title'
                id='myModalLabel'
                style={{color:'#fff'}}>
              Save Current Query
            </h4>
          </div>
          <div className='modal-body'>
            <p>Enter the name you would like to save your query under here:</p>
            <div className='input-group'>
              Query Name:&nbsp;
              <input type='text'
                     className='form-control'
                     placeholder='My Query'
                     value={queryName}
                     onChange={editName}/>
            </div>
            <p>Make query a publicly shared query?&nbsp;
              <input type='checkbox'
                     checked={shared ? 'checked' : ''}
                     onChange={editPublic}
                     aria-label='Shared Query'/>
            </p>
          </div>
          <div className='modal-footer'>
            <button type='button'
                    className='btn btn-default'
                    onClick={onDismissClicked}>
              Close
            </button>
            <button type='button'
                    className='btn btn-primary'
                    onClick={onSaveClicked}>
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

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
      let children = filter.children.map((element, key) => {
        return <ManageSavedQueryFilter
          filterItem={element}
        />
      });
      let logicOp = filter.activeOperator === 1
        ? 'OR'
        : 'AND';
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
        fields.push(<li key={i}>{this.props.Query.Fields[i]}</li>);
      }
    } else if (this.props.Query.Fields) {
      for (let instrument in this.props.Query.Fields) {
        if (this.props.Query.Fields.hasOwnProperty(instrument)) {
          for (let field in this.props.Query.Fields[instrument]) {
            if (this.props.Query.Fields[instrument].hasOwnProperty(field)
              && field !== 'allVisits'
            ) {
              fields.push(<li key={instrument}>{instrument},{field}</li>);
            }
          }
        }
      }
    }

    if (fields.length === 0) {
      fields.push(<li key={'no_fields_defined'}>No fields defined</li>);
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
  Name: PropTypes.object,
  Query: PropTypes.object,
};
ManageSavedQueryRow.defaultProps = {
  Name: null,
  Query: {
    Fields: []
  },
};

/*
 *  The following component is used for displaying the manage saved queries tab content
 */
const ManageSavedQueriesTabPane = (props) => {

  const loadQuery = (queryName) => {
    // Loads in the selected query
    props.onSelectQuery(
      props.queryDetails[queryName].Fields,
      props.queryDetails[queryName].Conditions
    );
  };

  let queryRows = [];
  if (props.queriesLoaded) {
    for (let i = 0; i < props.userQueries.length; i += 1) {
      let query = props.queryDetails[props.userQueries[i]];
      let name = 'Unnamed Query: ' + props.userQueries[i];
      if (query.Meta.name) {
        name = query.Meta.name;
      }
      const queryName = (
        <a href='#' onClick={() => loadQuery(props.userQueries[i])}>
          {name}
        </a>
      );
      queryRows.push(
        <ManageSavedQueryRow key={name} Name={queryName} Query={query}/>
      );
    }
  } else {
    queryRows.push(
      <tr key='loading'>
        <td colSpan='3'>Loading saved query details</td>
      </tr>
    );
  }

  let content = (
    <>
      <h2 style={{
        color: 'rgb(10, 53, 114)',
        textAlign: 'center',
        paddingTop: '0'
      }}>User Saved Queries</h2>
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
    </>
  );

  return (
    <TabPane TabId={props.TabId} Loading={props.Loading}>
      {content}
    </TabPane>
  );
};
ManageSavedQueriesTabPane.defaultProps = {
  userQueries: [],
  globalQueries: [],
  queriesLoaded: false,
  queryDetails: {}
};
ManageSavedQueriesTabPane.propTypes = {
  userQueries: PropTypes.array,
  globalQueries: PropTypes.array,
  queriesLoaded: PropTypes.bool,
  queryDetails: PropTypes.object,
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
