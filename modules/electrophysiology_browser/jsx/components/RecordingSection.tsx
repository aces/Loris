/* eslint-disable @typescript-eslint/no-var-requires */
import React, {useState} from 'react';
import type {ReactNode} from 'react';
import type {TFunction} from 'i18next';
import Panel from '../recording-viewer/src/ui/Panel';
import DetailsPanel from './DetailsPanel';
import SummaryPanel from './SummaryPanel';
import DownloadPanel from './DownloadPanel';
import type {DownloadGroup} from './DownloadPanel';
import PanelGrid from './PanelGrid';
import {
  getRecordingChannelsURL,
  hasRecordingHED,
} from '../utils';
import type {
  DatasetTags,
  RecordingEvents,
} from '../utils';

declare const EEG_VIS_ENABLED: boolean;
declare const loris: {
  BaseURL: string;
};

let RecordingDataProvider: React.ComponentType<any> | null = null;
let SignalViewer: React.ComponentType<any> | null = null;
let MontagePanel: React.ComponentType<any> | null = null;
if (EEG_VIS_ENABLED) {
  RecordingDataProvider = require(
    '../recording-viewer/src/recording/RecordingDataProvider'
  ).default;
  SignalViewer = require(
    '../recording-viewer/src/signals/components/SignalViewer'
  ).default;
  MontagePanel = require(
    '../recording-viewer/src/montage/MontagePanel'
  ).default;
}

export const RECORDING_VIEWER_ENABLED = Boolean(
  RecordingDataProvider && SignalViewer && MontagePanel
);

type MetadataRow = {
  name: ReactNode;
  value: ReactNode;
};

type SplitData = {
  splitCount: number;
  splitIndex: number;
};

export type RecordingFile = {
  id: number;
  name: string;
  details: MetadataRow[];
  downloads: DownloadGroup[];
  splitData?: SplitData;
  summary: MetadataRow[];
};

export type RecordingDatabaseEntry = {
  chunksURLs?: string[];
  coordSystemURL?: Array<string | false | undefined>;
  datasetTagEndorsements: unknown;
  datasetTags: DatasetTags;
  eegMontage?: string;
  electrodesURL?: Array<string | false | undefined>;
  eventsURL?: string[];
  events: RecordingEvents;
  file: RecordingFile;
  hedSchema: unknown;
};

export type PatientInfo = {
  dccid: string;
  pscid: string;
  'visit_label': string;
};

type RecordingSectionProps = {
  recording: RecordingDatabaseEntry;
  fileIndex: number;
  getSplitData: (
    physioFileID: number,
    fileIndex: number,
    splitIndex: number
  ) => void;
  patient: PatientInfo;
  navigationRequest?: {
    sequence: number;
    targetID: string;
    viewerPanel?: 'eventList' | 'hedEndorsement';
  };
  t: TFunction;
};

/**
 * Recording Section
 *
 * This component renders all panels for one electrophysiology recording.
 */
function RecordingSection({
  recording,
  fileIndex,
  getSplitData,
  patient,
  navigationRequest,
  t,
}: RecordingSectionProps): React.ReactElement {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const {
    chunksURLs,
    eventsURL,
    events,
    hedSchema,
    datasetTags,
    datasetTagEndorsements,
    electrodesURL,
    coordSystemURL,
    eegMontage,
  } = recording;
  const file = recording.file;
  const splitData = file.splitData;
  const recordingPanelID = 'filename_panel_' + fileIndex;
  const recordingBodyID = recordingPanelID + '_body';

  React.useEffect(() => {
    if (navigationRequest?.targetID.endsWith(`-${fileIndex}`)) {
      setIsCollapsed(false);
    }
  }, [fileIndex, navigationRequest]);
  const channelsURL = getRecordingChannelsURL(
    loris.BaseURL,
    patient,
    file.name
  );
  const currentChunksURL = splitData && chunksURLs
    ? chunksURLs[splitData.splitIndex]
    : chunksURLs;
  const recordingHasHED = hasRecordingHED(events, datasetTags);

  const splitPagination = splitData
    ? [...Array(splitData.splitCount).keys()].map((j) => (
      <a
        key={j}
        className={
          'btn btn-xs btn-primary split-nav'
          + (splitData.splitIndex === j ? ' active' : '')
        }
        onClick={() => getSplitData(file.id, fileIndex, j)}
      >{j + 1}</a>
    ))
    : [];

  return (
    <section id={`recording-${fileIndex}`} style={{marginTop: '24px'}}>
      <div
        style={{
          alignItems: 'center',
          borderBottom: '1px solid #C3D5DB',
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '15px',
          paddingBottom: '8px',
        }}
      >
        <h2
          style={{
            color: '#064785',
            flex: '1 1 auto',
            fontSize: '22px',
            margin: 0,
            overflowWrap: 'anywhere',
          }}
        >
          {file.name}
        </h2>
        <button
          type='button'
          className='btn btn-link btn-xs'
          aria-label={isCollapsed
            ? t('Expand recording', {ns: 'electrophysiology_browser'})
            : t('Collapse recording', {ns: 'electrophysiology_browser'})}
          aria-controls={recordingBodyID}
          aria-expanded={!isCollapsed}
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{flex: '0 0 auto', marginLeft: '12px'}}
        >
          <span
            className={isCollapsed
              ? 'glyphicon glyphicon-chevron-down'
              : 'glyphicon glyphicon-chevron-up'}
          >
          </span>
        </button>
      </div>
      <div
        id={recordingBodyID}
        className={isCollapsed ? 'collapse' : 'collapse in'}
      >
        <div className='recording-layout'>
          {RECORDING_VIEWER_ENABLED &&
          RecordingDataProvider && SignalViewer && MontagePanel &&
          <div className='recording-viewer-scoped'>
            <RecordingDataProvider
              channelsURL={channelsURL}
              chunksURL={currentChunksURL}
              eventsURL={eventsURL}
              events={events}
              electrodesURL={electrodesURL}
              coordSystemURL={coordSystemURL}
              hedSchema={hedSchema}
              datasetTags={datasetTags}
              datasetTagEndorsements={datasetTagEndorsements}
              physioFileID={file.id}
              samplingFrequency={file.summary[0].value}
              eegMontageName={eegMontage}
              recordingHasHED={recordingHasHED}
              t={t}
            >
              <Panel
                collapsing={false}
                id={`signal-viewer-${fileIndex}`}
                title={
                  t('Signal Viewer', {ns: 'electrophysiology_browser'}) + (
                    splitData
                      ? ` [${
                        t('split {{splitNum}}', {
                          ns: 'electrophysiology_browser',
                          splitNum: splitData.splitIndex + 1,
                        })
                      }]`
                      : ''
                  )
                }
              >
                {splitData &&
                  <>
                    <span
                      style={{
                        color: '#064785',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        paddingRight: '15px',
                      }}
                    >
                      {t(
                        'Viewing signal split file:',
                        {ns: 'electrophysiology_browser'}
                      )}
                    </span>
                    <a
                      className={
                        'btn btn-xs btn-default split-nav'
                        + (splitData.splitIndex === 0
                          ? ' disabled'
                          : '')
                      }
                      onClick={() => getSplitData(
                        file.id,
                        fileIndex,
                        splitData.splitIndex - 1
                      )}
                    >
                      {'<'}
                    </a>
                    {splitPagination}
                    <a
                      className={
                        'btn btn-xs btn-default split-nav'
                          + (splitData.splitIndex
                          === (splitData.splitCount - 1)
                            ? ' disabled'
                            : '')
                      }
                      onClick={
                        () => getSplitData(
                          file.id,
                          fileIndex,
                          splitData.splitIndex + 1
                        )
                      }
                    >
                      {'>'}
                    </a>
                  </>
                }
                <SignalViewer
                  navigationRequest={navigationRequest}
                  viewerID={`signal-viewer-${fileIndex}`}
                />
              </Panel>
              <PanelGrid>
                <MontagePanel id={`recording-montage-${fileIndex}`} />
                <SummaryPanel
                  id={`recording-summary-${fileIndex}`}
                  data={file.summary}
                  t={t}
                />
                <DownloadPanel
                  id={`recording-downloads-${fileIndex}`}
                  downloads={file.downloads}
                  dccid={patient.dccid}
                  visit={patient['visit_label']}
                  physioFileID={file.id}
                  physioFileName={file.name}
                  t={t}
                />
              </PanelGrid>
            </RecordingDataProvider>
          </div>}
          <DetailsPanel
            id={`recording-details-${fileIndex}`}
            title={file.name}
            data={file.details}
            t={t}
          />
        </div>
      </div>
    </section>
  );
}

export default RecordingSection;
