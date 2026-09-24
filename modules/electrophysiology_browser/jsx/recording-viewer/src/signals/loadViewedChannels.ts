import {fetchChunk} from './loadChunk';
import {MAX_VIEWED_CHUNKS} from '../shared/constants';
import {Channel, Chunk} from '../domain/types';
import {SignalFilter} from './filters/highLowPass';
import {TimeRange} from '../timeline/types';

type RawChunk = Omit<Chunk, 'interval' | 'filters'>;

type ChunkRequest = {
  channelIndex: number,
  traceIndex: number,
  chunkIndex: number,
  downsampling: number,
  interval: TimeRange,
};

type LoadViewedChannelsOptions = {
  chunksURL: string,
  channelIndexes: number[],
  shapes: number[][],
  validSamples: number[],
  recordingTimeRange: TimeRange,
  timeWindow: TimeRange,
  filters: Record<string, SignalFilter>,
  onChannelLoaded?: () => void,
};

type ChunkPlanOptions = Pick<
  LoadViewedChannelsOptions,
  'shapes' | 'validSamples' | 'recordingTimeRange' | 'timeWindow'
> & {
  channelIndex: number,
  traceIndex: number,
};

const MAX_CACHED_CHUNKS = 512;
const chunkCache = new Map<string, Promise<RawChunk>>();

/** Fetch a raw chunk while retaining only a bounded number of cached entries. */
function fetchRawChunk(url: string): Promise<RawChunk> {
  const cached = chunkCache.get(url);
  if (cached !== undefined) {
    chunkCache.delete(url);
    chunkCache.set(url, cached);
    return cached;
  }

  const request = fetchChunk(url) as unknown as Promise<RawChunk>;
  chunkCache.set(url, request);

  if (chunkCache.size > MAX_CACHED_CHUNKS) {
    const oldestKey = chunkCache.keys().next().value;
    if (oldestKey !== undefined) {
      chunkCache.delete(oldestKey);
    }
  }

  request.catch(() => {
    if (chunkCache.get(url) === request) {
      chunkCache.delete(url);
    }
  });

  return request;
}

/** Select the finest downsampling level that stays within the chunk limit. */
function createChunkRequests({
  channelIndex,
  traceIndex,
  shapes,
  validSamples,
  recordingTimeRange,
  timeWindow,
}: ChunkPlanOptions): ChunkRequest[] {
  const recordingDuration = recordingTimeRange[1] - recordingTimeRange[0];
  if (recordingDuration <= 0) {
    return [];
  }

  const levels = shapes.map((shape, downsampling) => {
    const numChunks = shape[shape.length - 2];
    const valuesPerChunk = shape[shape.length - 1];
    const filledChunks = (numChunks - 1)
      + validSamples[downsampling] / valuesPerChunk;
    const start = Math.max(0, Math.floor(
      filledChunks * Math.floor(timeWindow[0] - recordingTimeRange[0])
      / recordingDuration
    ));
    const end = Math.min(numChunks, Math.ceil(
      filledChunks * Math.ceil(timeWindow[1] - recordingTimeRange[0])
      / recordingDuration
    ));

    return {downsampling, end, filledChunks, numChunks, start};
  }).filter(({end, start}) => end - start < MAX_VIEWED_CHUNKS);

  if (levels.length === 0) {
    return [];
  }

  // Higher indexes contain finer data. Prefer them when levels need the same
  // number of chunks, which is common for short time windows.
  const level = levels.reduce((finest, candidate) =>
    candidate.end - candidate.start >= finest.end - finest.start
      ? candidate
      : finest
  );

  const requests: ChunkRequest[] = [];
  for (let chunkIndex = level.start; chunkIndex < level.end; chunkIndex++) {
    const interval: TimeRange = [
      recordingTimeRange[0]
        + chunkIndex / level.filledChunks * recordingDuration,
      recordingTimeRange[0]
        + (chunkIndex + 1) / level.filledChunks * recordingDuration,
    ];
    if (interval[0] <= timeWindow[1]) {
      requests.push({
        channelIndex,
        traceIndex,
        chunkIndex,
        downsampling: level.downsampling,
        interval,
      });
    }
  }

  return requests;
}

/** Apply filters across a complete trace, then split it back into chunks. */
function filterChunks(
  chunks: Array<RawChunk & {interval: TimeRange}>,
  filters: Record<string, SignalFilter>
): Chunk[] {
  const filterList = Object.values(filters);
  if (filterList.length === 0) {
    return chunks.map((chunk) => ({
      ...chunk,
      filters: [],
      values: chunk.originalValues,
    }));
  }

  const totalLength = chunks.reduce(
    (length, chunk) => length + chunk.originalValues.length,
    0
  );
  const originalValues = new Float32Array(totalLength);
  const offsets: number[] = [];
  let offset = 0;

  chunks.forEach((chunk) => {
    offsets.push(offset);
    originalValues.set(chunk.originalValues, offset);
    offset += chunk.originalValues.length;
  });

  const filteredValues = filterList.reduce(
    (values, filter) => filter.fn(values),
    originalValues
  );
  const filterNames = filterList.map((filter) => filter.name);

  return chunks.map((chunk, index) => ({
    ...chunk,
    filters: filterNames,
    values: filteredValues.slice(
      offsets[index],
      offsets[index] + chunk.originalValues.length
    ),
  }));
}

/** Load and filter the chunks required by the current viewer window. */
export async function loadViewedChannels({
  chunksURL,
  channelIndexes,
  shapes,
  validSamples,
  recordingTimeRange,
  timeWindow,
  filters,
  onChannelLoaded,
}: LoadViewedChannelsOptions): Promise<Channel[]> {
  return Promise.all(channelIndexes.map(async (channelIndex) => {
    const traceIndex = 0;
    const requests = createChunkRequests({
      channelIndex,
      traceIndex,
      shapes,
      validSamples,
      recordingTimeRange,
      timeWindow,
    });
    const rawChunks = await Promise.all(requests.map(async (request) => ({
      ...await fetchRawChunk(
        `${chunksURL}/raw/${request.downsampling}/${channelIndex}/`
        + `${traceIndex}/${request.chunkIndex}.buf`
      ),
      interval: request.interval,
    })));

    onChannelLoaded?.();
    return {
      index: channelIndex,
      traces: [{
        chunks: filterChunks(rawChunks, filters),
        type: 'line' as const,
      }],
    };
  }));
}
