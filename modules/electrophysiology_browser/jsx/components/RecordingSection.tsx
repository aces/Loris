/* eslint-disable @typescript-eslint/no-var-requires */
import React, {useState} from 'react';
import type {ReactNode} from 'react';
import type {TFunction} from 'i18next';
import Panel from 'jsx/Panel';
import DetailsPanel from './DetailsPanel';
import SummaryPanel from './SummaryPanel';
import DownloadPanel from './DownloadPanel';
import type {DownloadGroup} from './DownloadPanel';
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

let EEGLabSeriesProvider: React.ComponentType<any> | null = null;
let SeriesRenderer: React.ComponentType<any> | null = null;
let EEGMontage: React.ComponentType<any> | null = null;
if (EEG_VIS_ENABLED) {
  EEGLabSeriesProvider = require(
    '../react-series-data-viewer/src/eeglab/EEGLabSeriesProvider'
  ).default;
  SeriesRenderer = require(
    '../react-series-data-viewer/src/series/components/SeriesRenderer'
  ).default;
  EEGMontage = require(
    '../react-series-data-viewer/src/series/components/EEGMontage'
  ).default;
}

type MetadataRow = {
  name: ReactNode;
  value: ReactNode;
};

type SplitData = {
  splitCount: number;
  splitIndex: number;
};

type RecordingFile = {
  id: number;
  name: string;
  details: MetadataRow[];
  downloads: DownloadGroup[];
  splitData?: SplitData;
  summary: MetadataRow[];
};

type RecordingDatabaseEntry = {
  chunksURLs?: string[];
  coordSystemURL?: Array<string | false | undefined>;
  datasetTagEndorsements: unknown;
  datasetTags: DatasetTags;
  eegMontage?: string;
  electrodesURL?: Array<string | false | undefined>;
  epochsURL?: string[];
  events: RecordingEvents;
  file: RecordingFile;
  hedSchema: unknown;
};

type PatientInfo = {
  dccid: string;
  pscid: string;
  'visit_label': string;
};

type RecordingSectionProps = {
  dbEntry: RecordingDatabaseEntry;
  fileIndex: number;
  getSplitData: (
    physioFileID: number,
    fileIndex: number,
    splitIndex: number
  ) => void;
  patient: PatientInfo;
  t: TFunction;
};

/**
 * Recording Section
 *
 * This component renders all panels for one electrophysiology recording.
 */
function RecordingSection({
  dbEntry,
  fileIndex,
  getSplitData,
  patient,
  t,
}: RecordingSectionProps): React.ReactElement {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const {
    chunksURLs,
    epochsURL,
    events,
    hedSchema,
    datasetTags,
    datasetTagEndorsements,
    electrodesURL,
    coordSystemURL,
    eegMontage,
  } = dbEntry;
  const file = dbEntry.file;
  const splitData = file.splitData;
  const recordingPanelID = 'filename_panel_' + fileIndex;
  const recordingBodyID = recordingPanelID + '_body';
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
    <div style={{marginTop: '24px'}}>
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
        <div className='container-fluid'>
          <div className='row'>
            {EEGLabSeriesProvider &&
            SeriesRenderer &&
            EEGMontage &&
            <div className='react-series-data-viewer-scoped col-xs-12'>
              <EEGLabSeriesProvider
                channelsURL={channelsURL}
                chunksURL={currentChunksURL}
                epochsURL={epochsURL}
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
                  id='channel-viewer'
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
                  <SeriesRenderer physioFileID={file.id} />
                </Panel>
                <div className='row'>
                  <div className='col-md-6 col-lg-4'>
                    <SummaryPanel
                      id={'filename_summary_' + fileIndex}
                      data={file.summary}
                      t={t}
                    />
                  </div>
                  <EEGMontage />
                  <div className='col-md-6 col-lg-4'>
                    <DownloadPanel
                      id={'file_download_' + fileIndex}
                      downloads={file.downloads}
                      dccid={patient.dccid}
                      visit={patient['visit_label']}
                      physioFileID={file.id}
                      physioFileName={file.name}
                      t={t}
                    />
                  </div>
                </div>
              </EEGLabSeriesProvider>
            </div>}
            <div className='col-xs-12'>
              <DetailsPanel
                id={recordingPanelID + '_details'}
                title={file.name}
                data={file.details}
                t={t}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecordingSection;
