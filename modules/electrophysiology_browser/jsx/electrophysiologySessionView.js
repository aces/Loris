/**
 * This is the React class for the eeg_session.
 *
 * @author Alizée Wickenheiser.
 * @version 0.0.1
 */

import {createRoot} from 'react-dom/client';
import {createPortal} from 'react-dom';
import React, {Component, useState} from 'react';
import PropTypes from 'prop-types';
import i18n from 'I18nSetup';
import {withTranslation} from 'react-i18next';
import DataTable from 'jsx/DataTable';
import RecordingSection from './components/RecordingSection';
import Sidebar from './components/Sidebar';
import frStrings from '../locale/fr/LC_MESSAGES/electrophysiology_browser.json';
import jaStrings from '../locale/ja/LC_MESSAGES/electrophysiology_browser.json';
import zhStrings from '../locale/zh/LC_MESSAGES/electrophysiology_browser.json';

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
    this.getSplitData = this.getSplitData.bind(this);
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
        datasetTagEndorsements:
          dbEntry
          && dbEntry.file.datasetTagEndorsements,
        eegMontage:
          dbEntry
          && dbEntry.file.eegMontage,
      }));

      this.setState({
        setup: {data},
        isLoaded: true,
        database: database,
        patient: {
          info: data.patient,
        },
      });

      this.props.onSessionNavigationChange({
        next: !data.nextSession
          ? undefined
          : dataURL + data.nextSession + outputTypeArg,
        previous: !data.prevSession
          ? undefined
          : dataURL + data.prevSession + outputTypeArg,
      });
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
    const {t} = this.props;
    if (!this.state.isLoaded) {
      return (
        <button className='btn-info has-spinner'>
          {t('Loading...', {ns: 'loris'})}
          <span
            className='glyphicon glyphicon-refresh glyphicon-refresh-animate'>
          </span>
        </button>
      );
    }

    if (this.state.isLoaded) {
      const database = this.state.database.map((dbEntry, i) => {
        return (
          <RecordingSection
            key={i}
            dbEntry={dbEntry}
            fileIndex={i}
            getSplitData={this.getSplitData}
            patient={this.state.patient.info}
            t={t}
          />
        );
      });

      return (
        <div id='lorisworkspace'>
          <DataTable
            fields={[
              {label: t('PSCID', {ns: 'loris'}), show: true},
              {label: t('DCCID', {ns: 'loris'}), show: true},
              {label: t('Visit Label', {ns: 'loris'}), show: true},
              {label: t('Site', {ns: 'loris', count: 1}), show: true},
              {label: t('DoB', {ns: 'loris'}), show: true},
              {label: t('Sex', {ns: 'loris'}), show: true},
              {
                label: t('Output Type', {ns: 'electrophysiology_browser'}),
                show: true,
              },
              {label: t('Cohort', {ns: 'loris', count: 1}), show: true},
            ]}
            data={[
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
            freezeColumn={t('PSCID', {ns: 'loris'})}
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
  onSessionNavigationChange: PropTypes.func.isRequired,
  sessionid: PropTypes.string,
  t: PropTypes.func,
};
ElectrophysiologySessionView.defaultProps = {
  module: '',
};

/**
 * Electrophysiology session page.
 *
 * Renders the session view and places the session navigation sidebar in its
 * DOM container.
 *
 * @param {object} props - React Component properties
 * @return {React.ReactNode} React markup for the component
 */
function ElectrophysiologySessionPage(props) {
  const {sessionid, sidebarContainer, t} = props;
  const [navigation, setNavigation] = useState({
    next: undefined,
    previous: undefined,
  });

  return (
    <>
      {createPortal(
        <Sidebar
          next={navigation.next}
          previous={navigation.previous}
          t={t}
        />,
        sidebarContainer
      )}
      <ElectrophysiologySessionView
        module={props.module}
        onSessionNavigationChange={setNavigation}
        sessionid={sessionid}
        t={t}
      />
    </>
  );
}

ElectrophysiologySessionPage.propTypes = {
  module: PropTypes.string.isRequired,
  sidebarContainer: PropTypes.object.isRequired,
  sessionid: PropTypes.string,
  t: PropTypes.func,
};

ElectrophysiologySessionPage.defaultProps = {
  module: '',
};

/**
 * Render EEGSession on page load.
 */
window.onload = function() {
  i18n.addResourceBundle('ja', 'electrophysiology_browser', jaStrings);
  i18n.addResourceBundle('fr', 'electrophysiology_browser', frStrings);
  i18n.addResourceBundle('zh', 'electrophysiology_browser', zhStrings);
  const i18nNamespaces = ['electrophysiology_browser', 'loris'];

  const page = document.getElementById('page');
  page.classList.add('eegBrowser');

  const wrapDOM = document.getElementById('wrap');

  const pathparts = window.location.pathname.split('/');

  const EegSessionPage =
    withTranslation(i18nNamespaces)(ElectrophysiologySessionPage);

  // Create a wrapper div in which react component will be loaded.
  const EEGSessionViewAppDOM = document.createElement('div');
  EEGSessionViewAppDOM.id = 'eegSessionView';

  // Append wrapper div to page content.
  const rootDOM = document.getElementById('lorisworkspace');
  rootDOM.appendChild(EEGSessionViewAppDOM);

  // Render the React Components.
  createRoot(EEGSessionViewAppDOM).render(
    <EegSessionPage
      module={'eegSessionView'}
      sidebarContainer={wrapDOM}
      sessionid={pathparts[pathparts.length - 1]}
    />
  );
};
