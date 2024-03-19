/* global EEG_VIS_ENABLED */

/**
 * This is the React class for the eeg_session.
 *
 * @author Alizée Wickenheiser.
 * @version 0.0.1
 */

import {createRoot} from 'react-dom/client';
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import StaticDataTable from 'jsx/StaticDataTable';
import Panel from 'jsx/Panel';
import {FilePanel} from './components/electrophysiology_session_panels';
import {SummaryPanel} from './components/electrophysiology_session_summary';
import {DownloadPanel} from './components/DownloadPanel';
import Sidebar from './components/Sidebar';
import SidebarContent from './components/SidebarContent';

let EEGLabSeriesProvider;
let SeriesRenderer;
let EEGMontage;
if (EEG_VIS_ENABLED) {
  EEGLabSeriesProvider = require(
    './react-series-data-viewer/src/eeglab/EEGLabSeriesProvider'
  ).default;
  SeriesRenderer = require(
    './react-series-data-viewer/src/series/components/SeriesRenderer'
  ).default;
  EEGMontage = require(
    './react-series-data-viewer/src/series/components/EEGMontage'
  ).default;
}

/**
 * Electrophysiology Session View page
 *
 * View session page of the electrophysiology module
 *
 * @author Alizée Wickenheiser
 */
class ElectrophysiologySessionView extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      url: {
        params: {
          sessionID: '',
          outputType: '',
        },
      },
      prevSession: '',
      nextSession: '',
      patient: {
        info: {
          pscid: '',
          dccid: '',
          visit_label: '',
          site: '',
          dob: '',
          sex: '',
          output_type: '',
          cohort: '',
        },
      },
      database: [
        {
          file: {
            name: '',
            summary: {
              frequency: {
                sampling: '',
                powerline: '',
              },
              channel_count: [],
              reference: '',
            },
            details: {
              task: {
                description: '',
              },
              instructions: '',
              eeg: {
                ground: '',
                placement_scheme: '',
              },
              trigger_count: '',
              record_type: '',
              cog: {
                atlas_id: '',
                poid: '',
              },
              institution: {
                name: '',
                address: '',
              },
              misc: {
                channel_count: '',
              },
              manufacturer: {
                name: '',
                model_name: '',
              },
              cap: {
                manufacturer: '',
                model_name: '',
              },
              hardware_filters: '',
              recording_duration: '',
              epoch_length: '',
              device: {
                version: '',
                serial_number: '',
              },
              subject_artifact_description: '',
            },
            downloads: [
              {
                type: 'physiological_files',
                file: '',
              },
              {
                type: 'physiological_electrode_file',
                file: '',
              },
              {
                type: 'physiological_channel_file',
                file: '',
              },
              {
                type: 'physiological_task_event_file',
                file: '',
              },
              {
                type: 'all_files',
                file: '',
              },
            ],
          },
          chunksURL: null,
          epochsURL: null,
          electrodesURL: null,
          coordSystemURL: null,
          events: null,
          splitData: null,
        },
      ],
    };

    // Bind component instance to custom methods
    this.collectParams = this.collectParams.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  /**
   * Fetch data when component mounts.
   */
  componentDidMount() {
    this.collectParams();
    this.fetchData();
  }

  /**
   * Retrieve params from the browser URL and save it in state.
   */
  collectParams() {
    const url = new URL(window.location.href);
    const outputType = url.searchParams.get('outputType');
    this.state.url.params = {
      outputType: outputType === null ? 'all_types' : outputType,
    };
  }

  /**
   * Retrieve data from the provided URL and save it in state.
   *
   * @return {object}
   */
  fetchData() {
    const dataURL = loris.BaseURL + '/electrophysiology_browser/sessions/';
    const sessionID = this.props.sessionid;
    const outputTypeArg = '?outputType=' + this.state.url.params['outputType'];
    return fetch(
        dataURL + sessionID + outputTypeArg,
        {credentials: 'same-origin'}
    ).then((resp) => {
      if (!resp.ok) {
        throw Error(resp.statusText);
      }
      return resp.json();
    }).then((data) => {
      const database = data.database.map((dbEntry) => ({
        ...dbEntry,
        // EEG Visualization urls
        chunksURLs:
            dbEntry
            && dbEntry.file.chunks_urls.map(
            (url) =>
                loris.BaseURL
                + '/electrophysiology_browser/file_reader/?file='
                + url
            ),
        epochsURL:
            dbEntry
            && dbEntry.file?.epochsURL
            && [loris.BaseURL
              + '/electrophysiology_browser/file_reader/?file='
              + dbEntry.file.epochsURL],
        electrodesURL:
            dbEntry
            && dbEntry.file.downloads.map(
              (group) =>
                group.links['physiological_electrode_file']?.file
                && loris.BaseURL
                  + '/electrophysiology_browser/file_reader/?file='
                  + group.links['physiological_electrode_file'].file
          ),
        coordSystemURL:
          dbEntry
          && dbEntry.file.downloads.map(
            (group) =>
              group.links['physiological_coord_system_file']?.file
              && loris.BaseURL
              + '/electrophysiology_browser/file_reader/?file='
              + group.links['physiological_coord_system_file'].file
          ),
        events:
          dbEntry
          && dbEntry.file.events,
        hedSchema:
          dbEntry
          && dbEntry.file.hedSchema,
        datasetTags:
          dbEntry
          && dbEntry.file.datasetTags,
      }));

      this.setState({
        setup: {data},
        isLoaded: true,
        database: database,
        patient: {
          info: data.patient,
        },
      });

      document.getElementById(
          'nav_next'
      ).href = dataURL + data.nextSession + outputTypeArg;
      document.getElementById(
          'nav_previous'
      ).href = dataURL + data.prevSession + outputTypeArg;
      if (data.prevSession !== '') {
        document.getElementById('nav_previous').style.display = 'block';
      }
      if (data.nextSession !== '') {
        document.getElementById('nav_next').style.display = 'block';
      }
    })
    .catch((error) => {
      this.setState({error: true});
      console.error(error);
    });
  }

  /**
   * Retrieve the previous state.
   *
   * @param {object} callback
   */
  getState(callback) {
    this.setState((prevState) => {
      callback(prevState);
    });
  }

  /**
   * Get split data for split index
   *
   * @param {number} physioFileID
   * @param {number} fileIndex
   * @param {number} splitIndex
   */
  getSplitData(physioFileID, fileIndex, splitIndex) {
    const dataURL = loris.BaseURL
        + '/electrophysiology_browser/split_data';
    const formData = new FormData();
    formData.append('physioFileID', physioFileID);
    formData.append('splitIndex', splitIndex);

    fetch(
        dataURL, {
          method: 'POST',
          body: formData,
        }).then((resp) => {
      if (!resp.ok) {
        throw Error(resp.statusText);
      }

      resp.json().then((splitData) => {
        const database = JSON.parse(JSON.stringify(this.state.database));
        database[fileIndex].file.splitData = splitData;
        this.setState({database});
      });
    }).catch((error) => {
      this.setState({error: true});
      console.error(error);
    });
  }

  /**
   * Renders the React component.
   *
   * @return {JSX|void} - React markup for the component
   */
  render() {
    if (!this.state.isLoaded) {
      return (
        <button className='btn-info has-spinner'>
          Loading
          <span
            className='glyphicon glyphicon-refresh glyphicon-refresh-animate'>
          </span>
        </button>
      );
    }

    if (this.state.isLoaded) {
      let database = [];
      for (let i = 0; i < this.state.database.length; i++) {
        const {
          chunksURLs,
          epochsURL,
          events,
          hedSchema,
          datasetTags,
          electrodesURL,
          coordSystemURL,
        } = this.state.database[i];
        const file = this.state.database[i].file;
        const splitPagination = [];
        for (const j of Array(file.splitData?.splitCount).keys()) {
          splitPagination.push(
            <a
              key={j}
              className={
                    'btn btn-xs btn-primary split-nav'
                  + (file.splitData?.splitIndex === j ? ' active' : '')
              }
              onClick={() => this.getSplitData(file.id, i, j)}
            >{j+1}</a>
          );
        }
        database.push(
          <div key={i}>
            <FilePanel
              id={'filename_panel_' + i}
              title={this.state.database[i].file.name}
              data={this.state.database[i].file.details}
            >
              {EEG_VIS_ENABLED &&
              <div className="react-series-data-viewer-scoped col-xs-12">
                <EEGLabSeriesProvider
                  chunksURL={
                    chunksURLs?.[file.splitData?.splitIndex] || chunksURLs
                  }
                  epochsURL={epochsURL}
                  events={events}
                  electrodesURL={electrodesURL}
                  coordSystemURL={coordSystemURL}
                  hedSchema={hedSchema}
                  datasetTags={datasetTags}
                  physioFileID={this.state.database[i].file.id}
                  samplingFrequency={
                    this.state.database[i].file.summary[0].value
                  }
                >
                  <Panel
                    id='channel-viewer'
                    title={
                      'Signal Viewer' + (file.splitData
                              ? ' [split '+(file.splitData?.splitIndex+1)+']'
                              : ''
                      )
                    }
                  >
                  {file.splitData &&
                    <>
                      <span
                        style={{
                          color: '#064785',
                          fontWeight: 'bold',
                          fontSize: '14px',
                          paddingRight: '15px',
                        }}
                      >
                      Viewing signal split file:
                      </span>
                      <a
                        className={
                          'btn btn-xs btn-default split-nav'
                          + (file.splitData.splitIndex === 0
                            ? ' disabled'
                            : '')
                        }
                        onClick={() => this.getSplitData(
                          file.id,
                          i,
                          file.splitData.splitIndex-1
                        )}
                      >
                      {'<'}
                      </a>
                      {splitPagination}
                      <a
                        className={
                              'btn btn-xs btn-default split-nav'
                            + (file.splitData.splitIndex
                            === (file.splitData.splitCount-1)
                                ? ' disabled'
                                : '')
                        }
                        onClick={
                          () => this.getSplitData(
                              file.id,
                              i,
                              file.splitData.splitIndex+1
                          )
                        }
                      >
                      {'>'}
                      </a>
                    </>
                  }
                  <SeriesRenderer
                    physioFileID={this.state.database[i].file.id}
                  />
                  </Panel>
                  <div className='row'>
                    <div className='col-md-6 col-lg-4'>
                      <SummaryPanel
                        id={'filename_summary_' + i}
                        data={this.state.database[i].file.summary}
                      />
                    </div>
                    <EEGMontage />
                    <div className='col-md-6 col-lg-4'>
                      <DownloadPanel
                        id={'file_download_' + i}
                        downloads={this.state.database[i].file.downloads}
                        physioFileID={this.state.database[i].file.id}
                        outputType={this.state.database[i].file.output_type}
                      />
                    </div>
                  </div>
                </EEGLabSeriesProvider>
              </div>}
            </FilePanel>
          </div>
        );
      }

      return (
        <div id='lorisworkspace'>
          <StaticDataTable
            Headers={[
              'PSCID',
              'DCCID',
              'Visit Label',
              'Site',
              'DOB',
              'Sex',
              'Output Type',
              'Cohort',
            ]}
            Data={[
              [
                this.state.patient.info.pscid,
                this.state.patient.info.dccid,
                this.state.patient.info.visit_label,
                this.state.patient.info.site,
                this.state.patient.info.dob,
                this.state.patient.info.sex,
                this.state.patient.info.output_type,
                this.state.patient.info.cohort,
              ],
            ]}
            freezeColumn='PSCID'
            Hide={{rowsPerPage: true, downloadCSV: true, defaultColumn: true}}
          />
          {database}
        </div>
      );
    }
  }
}

ElectrophysiologySessionView.propTypes = {
  module: PropTypes.string.isRequired,
  sessionid: PropTypes.string,
};
ElectrophysiologySessionView.defaultProps = {
  module: '',
};

/**
 * Render EEGSession on page load.
 */
window.onload = function() {
  const sidebarContent = (
      <SidebarContent previous={'previous'} next={'next'}/>
);

  const eegSidebar = (
      <Sidebar
  content={sidebarContent}
  open={true}
  docked={true}>
      </Sidebar>
);

  const eegSidebarDOM = document.createElement('div');
  eegSidebarDOM.id = 'eegSidebar';

  const page = document.getElementById('page');
  page.classList.add('eegBrowser');

  const wrapDOM = document.getElementById('wrap');
  wrapDOM.insertBefore(eegSidebarDOM, page);

  const pathparts = window.location.pathname.split('/');
  const eegSessionView = (
      <ElectrophysiologySessionView
  module={'eegSessionView'}
  sessionid={pathparts[pathparts.length - 1]}
  />
);
  // Create a wrapper div in which react component will be loaded.
  const EEGSessionViewAppDOM = document.createElement('div');
  EEGSessionViewAppDOM.id = 'eegSessionView';

  // Append wrapper div to page content.
  const rootDOM = document.getElementById('lorisworkspace');
  rootDOM.appendChild(EEGSessionViewAppDOM);

  // Render the React Components.
  createRoot(
    document.getElementById('eegSessionView')
  ).render(eegSessionView);

  createRoot(
    document.getElementById('eegSidebar')
  ).render(eegSidebar);
};
