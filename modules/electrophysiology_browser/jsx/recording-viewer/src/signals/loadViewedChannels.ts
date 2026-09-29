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
  viewportWidth: number,
  filters: Record<string, SignalFilter>,
  onChannelLoaded?: () => void,
};

type ChunkPlanOptions = Pick<
  LoadViewedChannelsOptions,
  'shapes' | 'validSamples' | 'recordingTimeRange' | 'timeWindow'
> & {
  channelIndex: number,
  traceIndex: number,
  viewportWidth: number,
};

const MAX_CACHED_CHUNKS = 512;
const MAX_CACHED_CHUNK_BYTES = 128 * 1024 * 1024;
const TARGET_SAMPLES_PER_PIXEL = 4;
type CacheEntry = {promise: Promise<RawChunk>, bytes: number};
const chunkCache = new Map<string, CacheEntry>();
let cachedChunkBytes = 0;

/** Evict least-recently-used chunks until both cache bounds are satisfied. */
function pruneChunkCache() {
  while (
    chunkCache.size > MAX_CACHED_CHUNKS
    || cachedChunkBytes > MAX_CACHED_CHUNK_BYTES
  ) {
    const oldestKey = chunkCache.keys().next().value;
    if (oldestKey === undefined) return;
    const oldest = chunkCache.get(oldestKey);
    chunkCache.delete(oldestKey);
    cachedChunkBytes -= oldest?.bytes ?? 0;
  }
}

/** Fetch a raw chunk while retaining only a bounded number of cached entries. */
function fetchRawChunk(url: string): Promise<RawChunk> {
  const cached = chunkCache.get(url);
  if (cached !== undefined) {
    chunkCache.delete(url);
    chunkCache.set(url, cached);
    return cached.promise;
  }

  const request = fetchChunk(url) as unknown as Promise<RawChunk>;
  const entry: CacheEntry = {promise: request, bytes: 0};
  chunkCache.set(url, entry);
  pruneChunkCache();

  request.then((chunk) => {
    if (chunkCache.get(url) === entry) {
      entry.bytes = chunk.originalValues.byteLength;
      cachedChunkBytes += entry.bytes;
      pruneChunkCache();
    }
  }).catch(() => undefined);

  request.catch(() => {
    if (chunkCache.get(url) === entry) {
      chunkCache.delete(url);
      cachedChunkBytes -= entry.bytes;
    }
  });

  return request;
}

/** Select the coarsest downsampling level that preserves viewport detail. */
function createChunkRequests({
  channelIndex,
  traceIndex,
  shapes,
  validSamples,
  recordingTimeRange,
  timeWindow,
  viewportWidth,
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

    return {
      downsampling,
      end,
      filledChunks,
      numChunks,
      start,
      visibleSamples: Math.ceil(
        Math.max(0, Math.min(timeWindow[1], recordingTimeRange[1])
          - Math.max(timeWindow[0], recordingTimeRange[0]))
        / recordingDuration * filledChunks * valuesPerChunk
      ),
    };
  });

  if (levels.length === 0) {
    return [];
  }

  // Fetch the coarsest level that can still supply a faithful pixel envelope.
  // CSS pixels are intentional: device pixel ratio improves rasterization but
  // should not multiply network and retained-memory cost.
  const targetSamples = Math.max(
    1,
    Math.ceil(viewportWidth * TARGET_SAMPLES_PER_PIXEL)
  );
  const requestBoundLevels = levels.filter(
    (level) => level.end - level.start <= MAX_VIEWED_CHUNKS
  );
  const candidates = requestBoundLevels.length > 0 ? requestBoundLevels : levels;
  const level = candidates.find(
    (candidate) => candidate.visibleSamples >= targetSamples
  ) ?? candidates.reduce((finest, candidate) =>
    candidate.visibleSamples > finest.visibleSamples ? candidate : finest
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
    values: filteredValues.subarray(
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
  viewportWidth,
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
      viewportWidth,
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
