/**
 * This file contains React component for Electrophysiology module.
 */
import React from 'react';
import type {TFunction} from 'i18next';
import Panel from 'jsx/Panel';

declare const loris: {
  BaseURL: string;
};

type DownloadLink = {
  file: string;
  label: string;
};

export type DownloadGroup = {
  groupName: string;
  links: Record<string, DownloadLink>;
};

type DownloadPanelProps = {
  downloads?: DownloadGroup[];
  dccid: string;
  visit: string;
  physioFileID: number;
  physioFileName: string;
  id: string;
  t: TFunction;
};

const ns = {ns: 'electrophysiology_browser'};

/**
 * EEG Download Panel
 *
 * Display EEG files to download.
 */
export default function DownloadPanel({
  downloads = [],
  dccid,
  visit,
  physioFileID,
  physioFileName,
  id,
  t,
}: DownloadPanelProps): React.ReactElement {
  const annotationsAction = loris.BaseURL
    + '/electrophysiology_browser/events';

  return (
    <Panel
      id={id}
      title={t('File Download', ns)}
    >
      <div
        style={{minHeight: '300px'}}
        id={id + '-group'}
      >
        {downloads.map((panel, i) => {
          const panelName = panel.groupName;
          const links = (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                maxWidth: '250px',
                margin: '0 auto',
              }}
            >
              {Object.entries(panel.links).map(([type, download], j) => {
                const disabled = download.file === '';
                const recordingFileUrl = getRecordingFileURL(
                  type,
                  dccid,
                  visit,
                  physioFileName
                );

                // Ignore physiological_coord_system_file
                return type !== 'physiological_coord_system_file'
                  ? (
                    <div
                      key={j}
                      className={'form-group'}
                    >
                      <div
                        className='col-xs-6'
                        style={{
                          color: '#074785',
                          fontWeight: 'bold',
                          lineHeight: '30px',
                          verticalAlign: 'middle',
                          paddingLeft: 0,
                        }}
                      >{download.label}</div>
                      {disabled
                        ? <a
                          className='btn disabled col-xs-6'
                          style={{
                            color: '#b3b3b3',
                            cursor: 'not-allowed',
                            border: '1px solid #b3b3b3',
                            margin: 0,
                          }}
                        >
                          {t('Not Available', ns)}
                        </a>
                        : <a
                          className='btn btn-primary download col-xs-6'
                          href={
                            type === 'physiological_event_files'
                              ? (
                                annotationsAction
                                + '?physioFileID=' + physioFileID
                                + '&filePath=' + download.file
                              )
                              : recordingFileUrl
                          }
                          target='_blank'
                          style={{
                            margin: 0,
                          }}
                        >
                          {t('Download', ns)}
                        </a>
                      }
                    </div>
                  )
                  : null;
              })}
            </div>
          );

          if (downloads.length > 1) {
            return (
              <Panel
                id={id + '-' + i}
                title={panelName}
                initCollapsed={i !== 0}
                key={i}
                parentId={id + '-group'}
              >
                {links}
              </Panel>
            );
          } else {
            return links;
          }
        })}
      </div>
    </Panel>
  );
}

/**
 * Build the recording file download endpoint for one download link type.
 */
function getRecordingFileURL(
  type: string,
  dccid: string,
  visit: string,
  physioFileName: string
): string {
  let recordingFileUrl = `/api/v0.0.3/candidates/${dccid}/`
    + `${visit}/recordings/${physioFileName}`;

  switch (type) {
  case 'physiological_event_files':
    recordingFileUrl += '/bidsfiles/events';
    break;
  case 'all_files':
    recordingFileUrl += '/bidsfiles/archive';
    break;
  case 'physiological_channel_file':
    recordingFileUrl += '/bidsfiles/channels';
    break;
  case 'physiological_electrode_file':
    recordingFileUrl += '/bidsfiles/electrodes';
    break;
  }

  return recordingFileUrl;
}
