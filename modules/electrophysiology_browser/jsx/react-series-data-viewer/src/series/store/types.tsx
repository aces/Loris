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
  type: "line"
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
  channels: number[] | "all",
};

export type RightPanel = 'annotationForm' | 'epochList' | null;

export type Electrode = {
  name: string,
  channelIndex?: number,
  position: [number, number, number],
};
