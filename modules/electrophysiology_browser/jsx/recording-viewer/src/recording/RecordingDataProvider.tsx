import React, {createContext, useRef, useState} from 'react';
import type {TFunction} from 'i18next';
import TriggerableModal from 'jsx/TriggerableModal';
import {DEFAULT_MAX_CHANNELS} from '../shared/constants';
import type {
  ChannelInfo,
  ChannelMetadata,
  CoordinateSystem,
  EventMetadata,
  HEDSchemaElement,
  HEDTag,
  Sensor,
} from '../domain/types';
import DatasetTagger from '../hed/components/DatasetTagger';
import {InfoIcon} from '../ui/InfoIcon';
import {ViewerStateProviders} from '../viewer/ViewerStateProviders';
import {
  useChannelInfos,
  useCoordinateSystem,
  useInitialHEDState,
  useRecordingData,
  useSensors,
} from './useRecordingData';

type RecordingDataProviderProps = {
  channelsURL: string,
  chunksURL: string | string[],
  eventsURL: string,
  electrodesURL: string,
  coordSystemURL: string,
  megSensorsURL?: string,
  megHeadShapeURL?: string,
  hedSchema: HEDSchemaElement[],
  datasetTags: Record<string, Record<string, HEDTag[]>>,
  datasetTagEndorsements: Array<Record<string, any>>,
  events: EventMetadata,
  physioFileID: number,
  limit: number,
  samplingFrequency: string,
  eegMontageName: string,
  recordingHasHED: boolean,
  children: React.ReactNode,
  t: TFunction,
};

const MenuOption: Record<string, string> = {
  TAG_MODE: 'View/Edit Tags',
  ENDORSEMENT_MODE: 'Endorse Tags',
  JSON_MODE: 'View JSON',
};

/** BIDS information about the channels present in the acquisition. */
export const ChannelInfosContext = createContext<ChannelInfo[]>([]);

/** Metadata about the channels present in the acquisition. */
export const ChannelMetadataContext = createContext<ChannelMetadata[]>([]);

/** EEG and MEG sensors present in the acquisition. */
export const SensorsContext = createContext<Sensor[]>([]);

/** Coordinate system of the electrodes, if available. */
export const CoordinateSystemContext =
  createContext<CoordinateSystem | null>(null);

export type HoveredChannelsType = {
  hoveredChannels: number[],
  setHoveredChannels: React.Dispatch<React.SetStateAction<number[]>>,
}

/** Report use of the hovered-channel context without its provider. */
function ignoreSetHoveredChannels(): void {
  console.error('HoveredChannelsContext not initialized');
}

/** IDs of the channels currently hovered in the signal visualizer. */
export const HoveredChannelsContext = createContext<HoveredChannelsType>({
  hoveredChannels: [],
  setHoveredChannels: ignoreSetHoveredChannels,
});

/** Provides all data and viewer contexts for an electrophysiology recording. */
function RecordingDataProvider(props: RecordingDataProviderProps) {
  const channelInfos = useChannelInfos(props.channelsURL);
  const sensors = useSensors(props);
  const coordinateSystem = useCoordinateSystem(props.coordSystemURL);
  const [hoveredChannels, setHoveredChannels] = useState<number[]>([]);

  return (
    <ChannelInfosContext.Provider value={channelInfos}>
      <SensorsContext.Provider value={sensors}>
        <CoordinateSystemContext.Provider value={coordinateSystem}>
          <HoveredChannelsContext.Provider value={{
            hoveredChannels,
            setHoveredChannels,
          }}>
            <RecordingDataProviderContent {...props}/>
          </HoveredChannelsContext.Provider>
        </CoordinateSystemContext.Provider>
      </SensorsContext.Provider>
    </ChannelInfosContext.Provider>
  );
}

/** Provides recording data and dataset-tagging controls. */
function RecordingDataProviderContent(props: RecordingDataProviderProps) {
  const [activeMenuOption, setActiveMenuOption] = useState('TAG_MODE');
  const datasetTaggerTabsRef = useRef<HTMLDivElement>(null);
  const initialHEDState = useInitialHEDState(
    props.hedSchema,
    props.datasetTags,
    props.datasetTagEndorsements,
    props.t
  );
  const {channelMetadata, recordingMetadata, events} = useRecordingData(
    props.chunksURL,
    props.events,
    props.hedSchema,
    props.t,
    {
      samplingFrequency: props.samplingFrequency,
      eegMontageName: props.eegMontageName,
      physioFileID: props.physioFileID,
      recordingHasHED: props.recordingHasHED,
    }
  );
  const [signalViewer, ...additionalChildren] = React.Children.toArray(
    props.children
  );
  const chunksBaseURL = Array.isArray(props.chunksURL)
    ? props.chunksURL[0]
    : props.chunksURL;
  const filenamePrefix = chunksBaseURL
    .split('/').slice(-1)[0]
    .split('_').slice(0, -1)
    .join('_');

  return (
    <ChannelMetadataContext.Provider value={channelMetadata}>
      <ViewerStateProviders
        events={events}
        recordingMetadata={recordingMetadata}
        initialLimit={props.limit}
        initialHEDState={initialHEDState}
        unsavedChangesMessage={props.t(
          'Are you sure you want to leave unsaved changes behind?',
          {ns: 'electrophysiology_browser'}
        )}
      >
        <div id='tag-modal-container'>
          <TriggerableModal
            title={
              <>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '440px',
                }}>
                  <div id='dtm-title'>
                    <a href='https://www.hedtags.org' target='_blank'>
                      <img
                        src='https://images.loris.ca/HED_logo.png'
                        style={{height: '46px'}}
                      />
                    </a>
                    <span style={{marginLeft: '15px'}}>
                      {props.t('Dataset Tag Manager', {
                        ns: 'electrophysiology_browser',
                      })}
                    </span>
                  </div>
                  <div style={{fontSize: '12px'}}>
                    {props.t('More about HED', {
                      ns: 'electrophysiology_browser',
                    })}
                    <InfoIcon
                      title={props.t('Click to view the HED schema', {
                        ns: 'electrophysiology_browser',
                      })}
                      url='https://www.hedtags.org/display_hed.html'
                    />
                  </div>
                </div>
                <div ref={datasetTaggerTabsRef} style={{
                  fontSize: '18px',
                  marginBottom: '-30px',
                  marginLeft: 'auto',
                }}>
                  <ul className='nav nav-tabs' role='tablist'>
                    {Object.entries(MenuOption).map(([option, label]) => (
                      <li
                        key={option}
                        role='presentation'
                        className={activeMenuOption === option ? 'active' : ''}
                        onClick={() => setActiveMenuOption(option)}
                      >
                        <a
                          href='#'
                          role='tab'
                          data-toggle='tab'
                          onClick={(event) => event.preventDefault()}
                        >
                          {props.t(label, {ns: 'electrophysiology_browser'})}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            }
            label={props.t('Open Dataset Tag Manager', {
              ns: 'electrophysiology_browser',
            })}
          >
            <DatasetTagger
              tabsRef={datasetTaggerTabsRef}
              activeMenuTab={activeMenuOption}
              setActiveMenuTab={setActiveMenuOption}
              filenamePrefix={filenamePrefix}
            />
          </TriggerableModal>
        </div>
        {signalViewer}
        {additionalChildren}
      </ViewerStateProviders>
    </ChannelMetadataContext.Provider>
  );
}

RecordingDataProvider.defaultProps = {limit: DEFAULT_MAX_CHANNELS};

export default RecordingDataProvider;
