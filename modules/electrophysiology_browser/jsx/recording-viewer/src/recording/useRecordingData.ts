import {useEffect, useState} from 'react';
import type {TFunction} from 'i18next';
import {fetchJSON, fetchText} from '../data/http';
import {DEFAULT_CHANNEL_DELIMITER} from '../shared/constants';
import type {RecordingMetadata} from './RecordingContext';
import type {HEDState} from '../hed/state/HEDContext';
import {
  ChannelInfo,
  ChannelInfos,
  ChannelMetadata,
  CoordinateSystem,
  EventMetadata,
  HEDSchemaElement,
  HEDTag,
  HEDEndorsement,
  Sensor,
  RecordingEvent,
} from '../domain/types';
import {
  parseElectrodes,
  parseHeadShapePoints,
  parseMegSensors,
} from '../montage/parseMontage';

type RecordingInputs = Pick<
  RecordingMetadata,
  | 'samplingFrequency'
  | 'eegMontageName'
  | 'physioFileID'
  | 'recordingHasHED'
>;

type ChunkIndexChannelMetadata = Omit<ChannelMetadata, 'signalRange'> & {
  seriesRange: [number, number],
};

type ChunkIndex = Pick<
  RecordingMetadata,
  'shapes' | 'validSamples' | 'timeInterval'
> & {
  seriesRange: [number, number],
  channelMetadata: ChunkIndexChannelMetadata[],
};

type DatasetTagEndorsement = Record<string, any>;

/** Normalize endorsement. */
function normalizeEndorsement(
  endorsement: DatasetTagEndorsement
): HEDEndorsement {
  return {
    EndorsedBy:
      `${endorsement.FirstName.substring(0, 1)}.${endorsement.LastName}`,
    EndorsedByID: endorsement.EndorsedByID,
    EndorsementComment: endorsement.EndorsementComment,
    EndorsementStatus: endorsement.EndorsementStatus,
    EndorsementTime: endorsement.LastUpdate,
  };
}

/** Normalize dataset tags. */
export function normalizeDatasetTags(
  datasetTags: Record<string, Record<string, HEDTag[]>>,
  endorsements: DatasetTagEndorsement[],
  t: TFunction
): Record<string, Record<string, HEDTag[]>> {
  return Object.fromEntries(
    Object.entries(datasetTags).map(([column, tagsByValue]) => [
      column,
      Object.fromEntries(
        Object.entries(tagsByValue).map(([value, tags]) => [
          value,
          tags.map((tag) => ({
            ...tag,
            AdditionalMembers: parseInt(String(tag.AdditionalMembers)),
            TaggerName: tag.TaggerName === 'Origin'
              ? t('Data Authors', {ns: 'electrophysiology_browser'})
              : tag.TaggerName,
            Endorsements: endorsements
              .filter((endorsement) => endorsement.HEDRelID === tag.ID)
              .map(normalizeEndorsement),
          })),
        ])
      ),
    ])
  );
}

/** Normalize events. */
export function normalizeEvents(
  eventMetadata: EventMetadata,
  hedSchema: HEDSchemaElement[],
  t: TFunction
): RecordingEvent[] {
  const channelDelimiter = eventMetadata.channel_delimiter.length > 0
    ? eventMetadata.channel_delimiter
    : DEFAULT_CHANNEL_DELIMITER;
  const parsedEvents = eventMetadata.instances.map(
    (instance): RecordingEvent => {
      const eventExtraColumns = eventMetadata.extra_columns.filter((column) =>
        column.PhysiologicalTaskEventID === instance.PhysiologicalTaskEventID
      );
      const hed = eventMetadata.hed_tags
        .filter((tag) =>
          tag.PhysiologicalTaskEventID === instance.PhysiologicalTaskEventID
        )
        .map((tag): HEDTag => {
          const schemaElement = hedSchema.find(
            (element) => element.id === tag.HEDTagID
          ) ?? null;
          const additionalMembers = parseInt(tag.AdditionalMembers as string);

          return {
            schemaElement,
            HEDTagID: schemaElement?.id ?? null,
            ID: tag.ID,
            PropertyName: tag.PropertyName,
            PropertyValue: tag.PropertyValue,
            TagValue: tag.TagValue,
            Description: tag.Description,
            HasPairing: tag.HasPairing,
            PairRelID: tag.PairRelID,
            AdditionalMembers: isNaN(additionalMembers) ? 0 : additionalMembers,
            TaggerName: tag.TaggerName === 'Origin'
              ? t('Data Authors', {ns: 'electrophysiology_browser'})
              : tag.TaggerName,
            TaggedBy: tag.TaggedBy,
            Endorsements: eventMetadata.hed_endorsements
              .filter((endorsement) => endorsement.HEDRelID === tag.ID)
              .map(normalizeEndorsement),
          };
        });
      const eventLabel = [null, 'n/a'].includes(instance.TrialType)
        ? null
        : instance.TrialType;

      return {
        onset: parseFloat(instance.Onset),
        duration: parseFloat(instance.Duration),
        type: 'Event',
        label: eventLabel ?? instance.EventValue,
        value: instance.EventValue,
        trialType: instance.TrialType,
        properties: eventExtraColumns,
        hed,
        channels: ['n/a', null].includes(instance.Channel)
          ? []
          : channelDelimiter.length > 0
            ? instance.Channel.split(channelDelimiter)
            : [instance.Channel],
        physiologicalTaskEventID: instance.PhysiologicalTaskEventID,
      };
    }
  );

  const seenEventIDs = new Set<RecordingEvent['physiologicalTaskEventID']>();
  return parsedEvents
    .filter((event) => {
      if (seenEventIDs.has(event.physiologicalTaskEventID)) {
        console.error('ERROR: EVENT EXISTS');
        return false;
      }
      seenEventIDs.add(event.physiologicalTaskEventID);
      return true;
    })
    .sort((first, second) => first.onset - second.onset);
}

/** Use parsed events. */
export function useParsedEvents(
  eventMetadata: EventMetadata,
  hedSchema: HEDSchemaElement[],
  t: TFunction,
  enabled: boolean
): RecordingEvent[] {
  const [events, setEvents] = useState<RecordingEvent[]>([]);

  useEffect(() => {
    if (enabled) setEvents(normalizeEvents(eventMetadata, hedSchema, t));
  }, [enabled, eventMetadata, hedSchema, t]);

  return events;
}

/** Use channel infos. */
export function useChannelInfos(channelsURL: string): ChannelInfo[] {
  const [channelInfos, setChannelInfos] = useState<ChannelInfo[]>([]);

  useEffect(() => {
    let active = true;
    fetchJSON(channelsURL)
      .then((response: ChannelInfos) => {
        if (active) setChannelInfos(response.Channels);
      })
      .catch((error) => console.error(error));
    return () => {
      active = false;
    };
  }, [channelsURL]);

  return channelInfos;
}

/** Use coordinate system. */
export function useCoordinateSystem(
  coordSystemURL: string
): CoordinateSystem | null {
  const [coordinateSystem, setCoordinateSystem] =
    useState<CoordinateSystem | null>(null);

  useEffect(() => {
    let active = true;
    setCoordinateSystem(null);
    fetchJSON(coordSystemURL)
      .then(({json}) => {
        if (!active || !json) return;
        setCoordinateSystem({
          name: json.EEGCoordinateSystem ?? 'Other',
          units: json.EEGCoordinateUnits ?? 'm',
          description: json.EEGCoordinateSystemDescription ?? 'n/a',
        });
      })
      .catch((error) => console.error(error));
    return () => {
      active = false;
    };
  }, [coordSystemURL]);

  return coordinateSystem;
}

/** Use sensors. */
export function useSensors({
  electrodesURL,
  megSensorsURL,
  megHeadShapeURL,
}: {
  electrodesURL: string,
  megSensorsURL?: string,
  megHeadShapeURL?: string,
}): Sensor[] {
  const [sensors, setSensors] = useState<Sensor[]>([]);

  useEffect(() => {
    let active = true;
    setSensors([]);
    /** Append loaded sensors while this request is active. */
    const appendSensors = (nextSensors: Sensor[]) => {
      if (active) setSensors((current) => [...current, ...nextSensors]);
    };

    fetchText(electrodesURL)
      .then((text) => appendSensors(parseElectrodes(text)))
      .catch((error) => console.error(error));
    if (megSensorsURL) {
      fetchJSON(megSensorsURL)
        .then((json) => {
          if (json) appendSensors(parseMegSensors(json));
        })
        .catch((error) => console.error(error));
    }
    if (megHeadShapeURL) {
      fetchJSON(megHeadShapeURL)
        .then((json) => {
          if (json !== null) appendSensors(parseHeadShapePoints(json));
        })
        .catch((error) => console.error(error));
    }

    return () => {
      active = false;
    };
  }, [electrodesURL, megSensorsURL, megHeadShapeURL]);

  return sensors;
}

/** Use recording data. */
export function useRecordingData(
  chunksURL: string | string[],
  eventMetadata: EventMetadata,
  hedSchema: HEDSchemaElement[],
  t: TFunction,
  inputs: RecordingInputs
): {
  channelMetadata: ChannelMetadata[],
  recordingMetadata: RecordingMetadata,
  events: RecordingEvent[],
} {
  const chunksBaseURL = Array.isArray(chunksURL) ? chunksURL[0] : chunksURL;
  const channelDelimiter = eventMetadata.channel_delimiter.length > 0
    ? eventMetadata.channel_delimiter
    : DEFAULT_CHANNEL_DELIMITER;
  const [channelMetadata, setChannelMetadata] = useState<ChannelMetadata[]>([]);
  const [recordingLoaded, setRecordingLoaded] = useState(false);
  const [recordingMetadata, setRecordingMetadata] =
    useState<RecordingMetadata>({
      ...inputs,
      chunksURL: '',
      channelDelimiter,
      shapes: [],
      validSamples: [],
      timeInterval: [0, 1],
      signalRange: [-1, 2],
    });

  useEffect(() => {
    let active = true;
    setRecordingLoaded(false);
    if (!chunksBaseURL) {
      return () => {
        active = false;
      };
    }
    fetchJSON(`${chunksBaseURL}/index.json`)
      .then((index: ChunkIndex) => {
        if (!active) return;
        setChannelMetadata(index.channelMetadata.map((channel) => ({
          index: channel.index,
          name: channel.name,
          signalRange: channel.seriesRange,
        })));
        setRecordingMetadata({
          ...inputs,
          chunksURL: chunksBaseURL,
          channelDelimiter,
          shapes: index.shapes,
          validSamples: index.validSamples,
          timeInterval: index.timeInterval,
          signalRange: index.seriesRange,
        });
        setRecordingLoaded(true);
      })
      .catch((error) => console.error(error));
    return () => {
      active = false;
    };
  }, [
    chunksBaseURL,
    channelDelimiter,
    inputs.samplingFrequency,
    inputs.eegMontageName,
    inputs.physioFileID,
    inputs.recordingHasHED,
  ]);

  const events = useParsedEvents(
    eventMetadata,
    hedSchema,
    t,
    recordingLoaded
  );

  return {channelMetadata, recordingMetadata, events};
}

/** Use initial HED state. */
export function useInitialHEDState(
  hedSchema: HEDSchemaElement[],
  datasetTags: Record<string, Record<string, HEDTag[]>>,
  datasetTagEndorsements: DatasetTagEndorsement[],
  t: TFunction
): HEDState {
  const [initialState] = useState<HEDState>(() => ({
    hedSchema,
    datasetTags: normalizeDatasetTags(datasetTags, datasetTagEndorsements, t),
    relOverrides: [],
    addedTags: [],
    deletedTags: [],
    tagsHaveChanges: false,
  }));
  return initialState;
}
