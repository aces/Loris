/* global EEG_VIS_ENABLED, loris */

import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Panel from 'jsx/Panel';
import DetailsPanel from './DetailsPanel';
import SummaryPanel from './SummaryPanel';
import {DownloadPanel} from './DownloadPanel';

let EEGLabSeriesProvider;
let SeriesRenderer;
let EEGMontage;
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

/**
 * Recording Panel
 *
 * This component renders all panels for one electrophysiology recording.
 *
 * @param {object} props - React Component properties
 * @return {JSX} - React markup for the component
 */
function RecordingPanel({
  dbEntry,
  fileIndex,
  getSplitData,
  patient,
  t,
}) {
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
  const recordingPanelID = 'filename_panel_' + fileIndex;
  const recordingBodyID = recordingPanelID + '_body';
  const channelsURL = `${loris.BaseURL}/api/v0.0.4-dev/candidates`
    + `/${patient.pscid}/${patient.visit_label}/recordings/${file.name}`
    + `/channels`;
  const recordingHasHED = hasRecordingHED(events, datasetTags);

  const splitPagination = file.splitData
    ? [...Array(file.splitData.splitCount).keys()].map((j) => (
      <a
        key={j}
        className={
          'btn btn-xs btn-primary split-nav'
          + (file.splitData.splitIndex === j ? ' active' : '')
        }
        onClick={() => getSplitData(file.id, fileIndex, j)}
      >{j+1}</a>
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
            {EEG_VIS_ENABLED &&
            <div className='react-series-data-viewer-scoped col-xs-12'>
              <EEGLabSeriesProvider
                channelsURL={channelsURL}
                chunksURL={chunksURLs?.[file.splitData?.splitIndex]
                  || chunksURLs}
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
                      file.splitData
                        ? ` [${
                          t('split {{splitNum}}', {
                            ns: 'electrophysiology_browser',
                            splitNum: file.splitData?.splitIndex + 1,
                          })
                        }]`
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
                      {t(
                        'Viewing signal split file:',
                        {ns: 'electrophysiology_browser'}
                      )}
                    </span>
                    <a
                      className={
                        'btn btn-xs btn-default split-nav'
                        + (file.splitData.splitIndex === 0
                          ? ' disabled'
                          : '')
                      }
                      onClick={() => getSplitData(
                        file.id,
                        fileIndex,
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
                        () => getSplitData(
                          file.id,
                          fileIndex,
                          file.splitData.splitIndex+1
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
                      physioFileID={file.id}
                      outputType={file.output_type}
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

/**
 * Check whether a recording has HED tags.
 *
 * @param {object} events
 * @param {object} datasetTags
 * @return {boolean}
 */
function hasRecordingHED(events, datasetTags) {
  return events.hed_tags.length > 0 ||
    Object.keys(datasetTags).some((column) => {
      return Object.keys(datasetTags[column]).filter((columnValue) => {
        return datasetTags[column][columnValue].length > 0;
      }).some((columnValue) => {
        if (column === 'trial_type') {
          return events.instances.some((event) => {
            return event['TrialType'] === columnValue;
          });
        } else if (column === 'value') {
          return events.instances.some((event) => {
            return event['EventValue'] === columnValue;
          });
        }

        return events.extra_columns.some((prop) => {
          return prop.PropertyName === column &&
            prop.PropertyValue === columnValue;
        });
      });
    });
}

RecordingPanel.propTypes = {
  dbEntry: PropTypes.object.isRequired,
  fileIndex: PropTypes.number.isRequired,
  getSplitData: PropTypes.func.isRequired,
  patient: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default RecordingPanel;
