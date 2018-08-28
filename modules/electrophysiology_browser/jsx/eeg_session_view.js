/**
 * This is the React class for the eeg_session.
 *
 * @author Alizée Wickenheiser.
 * @version 0.0.1
 *
 */

import StaticDataTable from 'jsx/StaticDataTable';
import {FilePanel, DetailsPanel} from './components/eeg_session_panels';
import Sidebar from './components/Sidebar'
import SidebarContent from './components/SidebarContent'

class EEGSessionView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      url: {
        params: {
          sessionID: '',
          outputType: ''
        }
      },
      patient: {
        info: {
          pscid: '',
          dccid: '',
          visit_label: '',
          site: '',
          dob: '',
          gender: '',
          output_type: '',
          subproject: ''
        }
      },
      database: [
        {
          file: {
            name: '',
            task: {
              frequency: {
                sampling: '',
                powerline: ''
              },
              channel: [
                {
                  name: '',
                  value: ''
                },
                {
                  name: '',
                  value: ''
                },
                {
                  name: '',
                  value: ''
                },
                {
                  name: '',
                  value: ''
                }
              ],
              reference: ''
            },
            details: {
              task: {
                description: ''
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
                model_name: ''
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
              subject_artifact_description: ''
            }
          },
        }
      ]
    };

    // Bind component instance to custom methods
    this.fetchData = this.fetchData.bind(this);
    this.collectParams = this.collectParams.bind(this);
  }

  /**
   * Fetch data when component mounts.
   */
  componentDidMount() {
    this.collectParams();
    this.fetchData();
  }

  /**
   * Post-Render when we can access the DOM.
   */
  componentDidUpdate(prevProps, prevState) {
    console.log('componentDidUpdate');
  }

  /**
   * Retrieve params from the browser URL and save it in state.
   */
  collectParams() {
    const url = new URL(window.location.href);
    const outputType = url.searchParams.get('outputType');
    this.state.url.params = {
      sessionID: url.searchParams.get('sessionID'),
      outputType: outputType === null ? 'all_types' : outputType
    };
  }

  /**
   * Retrieve data from the provided URL and save it in state.
   */
  fetchData() {

    $.ajax(loris.BaseURL + '/electrophysiology_browser/ajax/get_electrophysiology_session_data.php', {
      method: 'GET',
      dataType: 'json',
      data: this.state.url.params,
      success: function(data) {
        console.log(data);
        this.getState((appState) => {
          appState.setup = {
            data
          };
          appState.isLoaded = true;
          appState.patient.info = data.patient;
          let database = [];
          for (let i = 0; i < data.database.length; i++) {
            database.push(data.database[i]);
          }
          appState.database = database;
          this.setState(appState);
          //console.log(JSON.stringify(appState));
          //console.log(appState.database);
        });
      }.bind(this),
      error: function(error) {
        console.log('ajax (get) - error!');
        console.log(JSON.stringify(error));
      }
    });
  }

  /**
   * Retrieve the previous state.
   */
  getState(callback) {
    this.setState((prevState) => {
      callback(prevState);
    });
  }

  /**
   * Render the HTML.
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
        database.push(
          <div>
            <FilePanel
              id={'filename_panel_' + i}
              title={'(' + this.state.database[i].file.name + ')'}
              data={this.state.database[i].file}
            />

            {/*<DetailsPanel*/}
            {/*id={'data_panel_' + i}*/}
            {/*title={'DATA DETAILS (' + i + ')'}*/}
            {/*data={this.state.database[i].file.details}*/}
            {/*/>*/}
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
              'Gender',
              'Output Type',
              'Subproject'
            ]}
            Data={[
              [
                this.state.patient.info.pscid,
                this.state.patient.info.dccid,
                this.state.patient.info.visit_label,
                this.state.patient.info.site,
                this.state.patient.info.dob,
                this.state.patient.info.gender,
                this.state.patient.info.output_type,
                this.state.patient.info.subproject
              ]
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

EEGSessionView.propTypes = {
  module: React.PropTypes.string.isRequired,
};
EEGSessionView.defaultProps = {
  module: ''
};

/**
 * Render EEGSession on page load.
 */
window.onload = function() {

  const sidebar_content = <SidebarContent/>;

  const eegSidebar = (
    <Sidebar
      content={sidebar_content}
      open={true}
      docked={true}>
    </Sidebar>
  );

  const eegSidebarDOM = document.createElement('div');
  eegSidebarDOM.style.top = '0';
  eegSidebarDOM.style.bottom = '0';
  eegSidebarDOM.style.left = '0';
  eegSidebarDOM.style.display = 'table-cell';
  eegSidebarDOM.style.height = 'calc(100%);';
  eegSidebarDOM.style.position = 'fixed';
  eegSidebarDOM.id = 'eegSidebar';

  let page = document.getElementById('page');
  page.style.verticalAlign = 'top';
  page.style.position = 'relative';
  page.style.width = 'auto';
  page.style.marginLeft = '256px';
  const wrapDOM = document.getElementById('wrap');
  wrapDOM.insertBefore(eegSidebarDOM, page);

  const eegSessionView = (
    <EEGSessionView
      module={'eegSessionView'}
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