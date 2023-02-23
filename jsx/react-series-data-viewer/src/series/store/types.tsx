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
  type: 'Event' | 'Annotation',
  label: string,
  comment?: string,
  hed?: string,
  channels: number[] | 'all',
  annotationInstanceID?: number,
};

export type EventMetadata = {
  instances: any[],
}

export type AnnotationMetadata = {
  instances: any[],
  labels: any[],
  metadata: any[]
}

export type RightPanel =
  'annotationForm'
  | 'eventList'
  | 'annotationList'
  | null;

export type Electrode = {
  name: string,
  channelIndex?: number,
  position: [number, number, number],
};

export type Cursor = {
  cursorPosition: [number, number] | null,
  viewerRef: MutableRefObject<any> | null,
};
