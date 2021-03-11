/**
 * This is the React class for the eeg_session.
 *
 * @author Alizée Wickenheiser.
 * @version 0.0.1
 *
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import StaticDataTable from 'jsx/StaticDataTable';
import {FilePanel} from './components/electrophysiology_session_panels';
import {SummaryPanel} from './components/electrophysiology_session_summary';
import {DownloadPanel} from './components/DownloadPanel';
import Sidebar from './components/Sidebar';
import SidebarContent from './components/SidebarContent';
import EEGLabSeriesProvider
  from './react-series-data-viewer/src/eeglab/EEGLabSeriesProvider';
import SeriesRenderer
  from './react-series-data-viewer/src/series/components/SeriesRenderer';
import EEGMontage
  from './react-series-data-viewer/src/series/components/EEGMontage';

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
          subproject: '',
        },
      },
      database: [
        {
          file: {
            name: '',
            task: {
              frequency: {
                sampling: '',
                powerline: '',
              },
              channel: [
                {
                  name: '',
                  value: '',
                },
                {
                  name: '',
                  value: '',
                },
                {
                  name: '',
                  value: '',
                },
                {
                  name: '',
                  value: '',
                },
              ],
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
                type: 'physiological_file',
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
                type: 'physiological_annotation_files',
                file: '',
              },
              {
                type: 'all_files',
                file: '',
              },
              {
                type: 'physiological_fdt_file',
                file: '',
              },
            ],
          },
          chunkDirectoryURL: null,
          epochsTableURL: null,
          electrodesTableUrls: null,
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
      })
      .then((data) => {
        const database = data.database.map((dbEntry) => ({
          ...dbEntry,
          // EEG Visualisation urls
          chunkDirectoryURL:
            dbEntry
            && dbEntry.file.chunks_url
            && loris.BaseURL
              + '/electrophysiology_browser/file_reader/?file='
              + dbEntry.file.chunks_url,
          epochsTableURL:
            dbEntry
            && dbEntry.file.downloads[3].file
            && loris.BaseURL
              + '/electrophysiology_browser/file_reader/?file='
              + dbEntry.file.downloads[3].file,
          electrodesTableUrls:
            dbEntry
            && dbEntry.file.downloads[1].file
            && loris.BaseURL
              + '/electrophysiology_browser/file_reader/?file='
              + dbEntry.file.downloads[1].file,
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
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
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
          chunkDirectoryURL,
          epochsTableURL,
          electrodesTableUrls,
        } = this.state.database[i];
        database.push(
          <div key={i}>
            <FilePanel
              id={'filename_panel_' + i}
              title={this.state.database[i].file.name}
              data={this.state.database[i].file}
            >
              <div className="react-series-data-viewer-scoped col-xs-12">
                <EEGLabSeriesProvider
                  chunkDirectoryURLs={chunkDirectoryURL}
                  epochsTableURLs={epochsTableURL}
                  electrodesTableUrls={electrodesTableUrls}
                >
                  <SeriesRenderer />
                  <div className='row'>
                    <div className='col-sm-3'>
                      <SummaryPanel
                        data={this.state.database[i].file}
                        id={'filename_summary_' + i}
                      />
                    </div>
                    <EEGMontage />
                    <div className='col-sm-4'>
                      <DownloadPanel
                        id={'file_download_' + i}
                        data={this.state.database[i].file}
                      />
                    </div>
                  </div>
                </EEGLabSeriesProvider>
              </div>
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
              'Subproject',
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
                this.state.patient.info.subproject,
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
  eegSidebarDOM.style.top =
  eegSidebarDOM.style.bottom =
  eegSidebarDOM.style.left = '0';
  eegSidebarDOM.style.display = 'table-cell';
  eegSidebarDOM.style.height = 'calc(100%);';
  eegSidebarDOM.style.position = 'fixed';
  eegSidebarDOM.id = 'eegSidebar';

  let page = document.getElementById('page');
  page.style.verticalAlign = 'top';
  page.style.position = 'relative';
  page.style.width = 'auto';
  page.style.marginLeft = '150px';
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
  ReactDOM.render(eegSessionView, document.getElementById('eegSessionView'));
  ReactDOM.render(eegSidebar, document.getElementById('eegSidebar'));
};
