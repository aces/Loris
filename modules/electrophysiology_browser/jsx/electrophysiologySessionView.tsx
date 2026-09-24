/**
 * This is the React class for the eeg_session.
 *
 * @author Alizée Wickenheiser.
 * @version 0.0.1
 */

import {createRoot} from 'react-dom/client';
import {createPortal} from 'react-dom';
import React, {useEffect, useState} from 'react';
import type {ComponentType, ReactElement} from 'react';
import type {TFunction} from 'i18next';
import i18n from 'I18nSetup';
import {withTranslation} from 'react-i18next';
import LegacyDataTable from 'jsx/DataTable';
import RecordingSection from './components/RecordingSection';
import type {
  RecordingDatabaseEntry,
  RecordingFile,
} from './components/RecordingSection';
import Sidebar from './components/Sidebar';
import frStrings from '../locale/fr/LC_MESSAGES/electrophysiology_browser.json';
import jaStrings from '../locale/ja/LC_MESSAGES/electrophysiology_browser.json';
import zhStrings from '../locale/zh/LC_MESSAGES/electrophysiology_browser.json';

declare const loris: {
  BaseURL: string;
};

type SessionDataTableProps = {
  fields: Array<{label: string; show: boolean}>;
  data: string[][];
  freezeColumn: string;
  Hide: {
    rowsPerPage: boolean;
    downloadCSV: boolean;
    defaultColumn: boolean;
  };
};

const DataTable = LegacyDataTable as unknown as
  ComponentType<SessionDataTableProps>;

type Navigation = {
  next?: string;
  previous?: string;
};

/* API response field names are defined by the server. */
/* eslint-disable camelcase */
type PatientInfo = {
  pscid: string;
  dccid: string;
  visit_label: string;
  site: string;
  dob: string;
  sex: string;
  output_type: string;
  cohort: string;
};

type RawRecordingFile = RecordingFile & {
  chunks_urls: string[];
  eventsURL?: string;
  events: RecordingDatabaseEntry['events'];
  hedSchema: RecordingDatabaseEntry['hedSchema'];
  datasetTags: RecordingDatabaseEntry['datasetTags'];
  datasetTagEndorsements: RecordingDatabaseEntry['datasetTagEndorsements'];
  eegMontage?: string;
};
/* eslint-enable camelcase */

type RawRecording = {
  file: RawRecordingFile;
  [key: string]: unknown;
};

type SessionResponse = {
  database: RawRecording[];
  patient: PatientInfo;
  nextSession?: string;
  prevSession?: string;
};

type SessionState = {
  isLoaded: boolean;
  error?: boolean;
  patient: {info: PatientInfo};
  recordings: RecordingDatabaseEntry[];
};

type SessionViewProps = {
  navigation: Navigation;
  onSessionNavigationChange: (navigation: Navigation) => void;
  sidebarContainer: Element;
  sessionid?: string;
  t: TFunction;
};

type SessionPageProps = {
  sidebarContainer: Element;
  sessionid?: string;
  t: TFunction;
};

/**
 * Electrophysiology Session View page
 *
 * View session page of the electrophysiology module
 *
 * @author Alizée Wickenheiser
 */
function ElectrophysiologySessionView(
  props: SessionViewProps
): ReactElement {
  const {
    navigation,
    onSessionNavigationChange,
    sessionid,
    sidebarContainer,
    t,
  } = props;
  const [navigationRequest, setNavigationRequest] = useState<{
    targetID: string;
    sequence: number;
    viewerPanel?: 'eventList' | 'hedEndorsement';
  }>();
  const [state, setState] = useState<SessionState>({
    isLoaded: false,
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
    recordings: [],
  });

  useEffect(() => {
    const url = new URL(window.location.href);
    const selectedOutputType = url.searchParams.get('outputType')
      ?? 'all_types';
    const dataURL = loris.BaseURL + '/electrophysiology_browser/sessions/';
    const outputTypeArg = `?outputType=${selectedOutputType}`;
    const fileReaderURL = `${loris.BaseURL}`
      + '/electrophysiology_browser/file_reader/?file=';

    /** Load session. */
    async function loadSession(): Promise<void> {
      try {
        const response = await fetch(
          `${dataURL}${sessionid}${outputTypeArg}`,
          {credentials: 'same-origin'}
        );
        if (!response.ok) {
          throw Error(response.statusText);
        }

        const data = await response.json() as SessionResponse;
        const recordings: RecordingDatabaseEntry[] = data.database.map(
          (recording) => ({
            ...recording,
            chunksURLs: recording.file.chunks_urls.map(
              (chunkURL) => fileReaderURL + chunkURL
            ),
            eventsURL: recording.file.eventsURL
              ? [fileReaderURL + recording.file.eventsURL]
              : undefined,
            electrodesURL: recording.file.downloads.map((group) => {
              const file = group.links.physiological_electrode_file?.file;
              return file && fileReaderURL + file;
            }),
            coordSystemURL: recording.file.downloads.map((group) => {
              const file = group.links.physiological_coord_system_file?.file;
              return file && fileReaderURL + file;
            }),
            events: recording.file.events,
            hedSchema: recording.file.hedSchema,
            datasetTags: recording.file.datasetTags,
            datasetTagEndorsements: recording.file.datasetTagEndorsements,
            eegMontage: recording.file.eegMontage,
          })
        );

        setState({
          isLoaded: true,
          recordings,
          patient: {info: data.patient},
        });

        onSessionNavigationChange({
          next: data.nextSession
            ? `${dataURL}${data.nextSession}${outputTypeArg}`
            : undefined,
          previous: data.prevSession
            ? `${dataURL}${data.prevSession}${outputTypeArg}`
            : undefined,
        });
      } catch (error) {
        setState((previousState) => ({...previousState, error: true}));
        console.error(error);
      }
    }

    void loadSession();
  }, [sessionid, onSessionNavigationChange]);

  /**
   * Get split data for split index
   *
   * @param {number} physioFileID - Recording identifier.
   * @param {number} fileIndex - Recording index.
   * @param {number} splitIndex - Split index.
   */
  async function getSplitData(
    physioFileID: number,
    fileIndex: number,
    splitIndex: number
  ): Promise<void> {
    const dataURL = `${loris.BaseURL}/electrophysiology_browser/split_data`;
    const formData = new FormData();
    formData.append('physioFileID', String(physioFileID));
    formData.append('splitIndex', String(splitIndex));

    try {
      const response = await fetch(dataURL, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw Error(response.statusText);
      }

      const splitData = await response.json() as RecordingFile['splitData'];
      setState((previousState) => ({
        ...previousState,
        recordings: previousState.recordings.map((recording, index) =>
          index === fileIndex
            ? {
              ...recording,
              file: {...recording.file, splitData},
            }
            : recording
        ),
      }));
    } catch (error) {
      setState((previousState) => ({...previousState, error: true}));
      console.error(error);
    }
  }

  /** Navigate to. */
  function navigateTo(
    targetID: string,
    viewerPanel?: 'eventList' | 'hedEndorsement'
  ): void {
    setNavigationRequest((previousRequest) => ({
      targetID,
      sequence: (previousRequest?.sequence ?? 0) + 1,
      viewerPanel,
    }));
  }

  useEffect(() => {
    if (!navigationRequest) {
      return;
    }

    let scrollFrame = 0;
    const expansionFrame = window.requestAnimationFrame(() => {
      scrollFrame = window.requestAnimationFrame(() => {
        document.getElementById(navigationRequest.targetID)?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });
    });

    return () => {
      window.cancelAnimationFrame(expansionFrame);
      window.cancelAnimationFrame(scrollFrame);
    };
  }, [navigationRequest]);

  /**
   * Renders the React component.
   *
   * @return {JSX|void} - React markup for the component
   */
  if (!state.isLoaded) {
    return (
      <button className='btn-info has-spinner'>
        {t('Loading...', {ns: 'loris'})}
        <span
          className='glyphicon glyphicon-refresh glyphicon-refresh-animate'
        />
      </button>
    );
  }

  return (
    <>
      {createPortal(
        <Sidebar
          navigation={navigation}
          onNavigate={navigateTo}
          recordings={state.recordings}
          t={t}
        />,
        sidebarContainer
      )}
      <main className='ephys-session-main'>
        <div id='session-summary'>
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
                state.patient.info.pscid,
                state.patient.info.dccid,
                state.patient.info.visit_label,
                state.patient.info.site,
                state.patient.info.dob,
                state.patient.info.sex,
                state.patient.info.output_type,
                state.patient.info.cohort,
              ],
            ]}
            freezeColumn={t('PSCID', {ns: 'loris'})}
            Hide={{
              rowsPerPage: true,
              downloadCSV: true,
              defaultColumn: true,
            }}
          />
        </div>
        {state.recordings.map((recording, index) => (
          <RecordingSection
            key={recording.file.id}
            recording={recording}
            fileIndex={index}
            getSplitData={getSplitData}
            navigationRequest={navigationRequest}
            patient={state.patient.info}
            t={t}
          />
        ))}
      </main>
    </>
  );
}

/**
 * Electrophysiology session page.
 *
 * Renders the session view and places the session navigation sidebar in its
 * DOM container.
 *
 * @param {object} props - React Component properties
 * @return {React.ReactNode} React markup for the component
 */
function ElectrophysiologySessionPage(
  props: SessionPageProps
): ReactElement {
  const {sessionid, sidebarContainer, t} = props;
  const [navigation, setNavigation] = useState<Navigation>({
    next: undefined,
    previous: undefined,
  });

  return (
    <ElectrophysiologySessionView
      navigation={navigation}
      onSessionNavigationChange={setNavigation}
      sidebarContainer={sidebarContainer}
      sessionid={sessionid}
      t={t}
    />
  );
}

/**
 * Render EEGSession on page load.
 */
window.addEventListener('load', () => {
  i18n.addResourceBundle('ja', 'electrophysiology_browser', jaStrings);
  i18n.addResourceBundle('fr', 'electrophysiology_browser', frStrings);
  i18n.addResourceBundle('zh', 'electrophysiology_browser', zhStrings);
  const i18nNamespaces = ['electrophysiology_browser', 'loris'];

  const page = document.getElementById('page');
  if (!page) {
    throw Error('Could not find the page element.');
  }
  page.classList.add('eegBrowser');

  const sidebarContainer = document.createElement('div');
  sidebarContainer.id = 'ephys-sidebar-container';
  page.insertBefore(sidebarContainer, page.firstChild);

  const pathParts = window.location.pathname.split('/');
  const TranslatedSessionPage =
    withTranslation(i18nNamespaces)(ElectrophysiologySessionPage);

  // Create a wrapper div in which react component will be loaded.
  const sessionViewContainer = document.createElement('div');
  sessionViewContainer.id = 'eegSessionView';

  // Append wrapper div to page content.
  const workspace = document.getElementById('lorisworkspace');
  if (!workspace) {
    throw Error('Could not find the session page container.');
  }
  workspace.appendChild(sessionViewContainer);

  // Render the React Components.
  createRoot(sessionViewContainer).render(
    <TranslatedSessionPage
      sidebarContainer={sidebarContainer}
      sessionid={pathParts[pathParts.length - 1]}
    />
  );
});
