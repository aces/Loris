import {MutableRefObject} from 'react';

export type Chunk = {
  index: number,
  originalValues: number[],
  values: number[],
  filters: string[],
  downsampling: number,
  interval: [number, number],
  cutoff: number
};

export type Trace = {
  chunks: Chunk[],
  type: 'line'
};

export type ChannelMetadata = {
  name: string,
  seriesRange: [number, number]
};

export type Channel = {
  index: number,
  traces: Trace[]
};

export type Epoch = {
  onset: number,
  duration: number,
  type: 'Event',
  label: string,
  value: string,
  trialType: string,
  properties?: any[],
  hed?: HEDTag[],
  channels: number[] | 'all',
  physiologicalTaskEventID?: number,
};

export type EpochFilter = {
  plotVisibility: number[],
  columnVisibility: number[],
}

export type EventMetadata = {
  instances: any[],
  extraColumns: any[],
  hedTags: any[],
}

export type RightPanel =
  'annotationForm'
  | 'eventList'
  | null;


export type CoordinateSystem = {
  name: string | 'Other',
  units: string | 'm',
  description: string | 'n/a'
};

export type Electrode = {
  name: string,
  channelIndex?: number,
  position: [number, number, number],
};

export type Cursor = {
  cursorPosition: [number, number] | null,
  viewerRef: MutableRefObject<any> | null,
};

export type HEDSchemaElement = {
  id: number,
  parentID: number,
  schemaID: number,
  name: string,
  longName: string,
  description: string,
  schemaName: string,
}

// Currently uppercase. DB columns unprocessed
export type HEDTag = {
  schemaElement: HEDSchemaElement | null,
  HEDTagID: number | null, // redundant (id above)
  ID: any,
  PropertyName: string | null,
  PropertyValue: string | null,
  TagValue: string | null,
  Description: string, // Level Description
  HasPairing: string,
  PairRelID: any,
  AdditionalMembers: number,
};
