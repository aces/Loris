import {Channel, ChannelInfo, ChannelMetadata, Chunk} from '../../domain/types';
import {findBidsChannel} from '../../channels/channelLogic';

/* eslint-disable jsdoc/require-jsdoc */

export type SignalDraw = {
  channelIndex: number,
  firstVertex: number,
  vertexCount: number,
};

type HitTrace = {
  chunks: Chunk[],
  dcOffset: number,
};

type HitChannel = {
  channelIndex: number,
  centerY: number,
  range: number,
  traces: HitTrace[],
};

export type SignalRenderModel = {
  vertices: Float32Array,
  draws: SignalDraw[],
  hitChannels: HitChannel[],
};

export type SignalRenderModelOptions = {
  channels: Channel[],
  channelMetadata: ChannelMetadata[],
  bidsChannels: ChannelInfo[],
  channelCount: number,
  timeWindow: [number, number],
  amplitudeScale: number,
  withDCOffset: boolean,
  stackedView: boolean,
  viewportWidth: number,
};

const RANGE_SAMPLE_LIMIT = 8192;

/** Iterate only values that overlap the current time window. */
function forEachVisibleValue(
  chunks: Chunk[],
  timeWindow: [number, number],
  visit: (value: number) => void
) {
  chunks.forEach((chunk) => {
    const [start, end] = chunk.interval;
    if (end <= timeWindow[0] || start >= timeWindow[1] || end <= start) return;
    const first = Math.max(0, Math.floor(
      (Math.max(start, timeWindow[0]) - start) / (end - start)
        * chunk.values.length
    ));
    const last = Math.min(chunk.values.length, Math.ceil(
      (Math.min(end, timeWindow[1]) - start) / (end - start)
        * chunk.values.length
    ));
    for (let index = first; index < last; index += 1) {
      const value = chunk.values[index];
      if (Number.isFinite(value)) visit(value);
    }
  });
}

/** Compute a bounded-memory approximation of the visible 5th/95th percentiles. */
function getVisibleRange(
  channel: Channel,
  timeWindow: [number, number]
): [number, number] {
  let count = 0;
  channel.traces.forEach((trace) => forEachVisibleValue(
    trace.chunks, timeWindow, () => {
      count += 1;
    }
  ));
  if (count === 0) return [0, 0];

  const stride = Math.max(1, Math.ceil(count / RANGE_SAMPLE_LIMIT));
  const sample = new Float32Array(Math.ceil(count / stride));
  let seen = 0;
  let written = 0;
  channel.traces.forEach((trace) => forEachVisibleValue(
    trace.chunks,
    timeWindow,
    (value) => {
      if (seen % stride === 0) sample[written++] = value;
      seen += 1;
    }
  ));
  const sorted = sample.subarray(0, written).sort();
  return [
    sorted[Math.floor((sorted.length - 1) * 0.05)],
    sorted[Math.floor((sorted.length - 1) * 0.95)],
  ];
}

function getVisibleMean(
  chunks: Chunk[],
  timeWindow: [number, number]
): number {
  let count = 0;
  let mean = 0;
  forEachVisibleValue(chunks, timeWindow, (value) => {
    count += 1;
    mean += (value - mean) / count;
  });
  return count === 0 ? 0 : mean;
}

type PreparedTrace = HitTrace & {
  channelIndex: number,
  centerY: number,
  range: number,
};

/**
 * Visit one viewport-aligned min/max envelope across all source chunks.
 *
 * Server chunks are storage details: using independent bins for each chunk
 * changes vertex density at partial chunk boundaries. Global time buckets keep
 * the rendered sampling rate uniform across the complete trace.
 */
function forEachRenderedValue(
  chunks: Chunk[],
  timeWindow: [number, number],
  viewportWidth: number,
  visit: (value: number, time: number) => void
) {
  const duration = timeWindow[1] - timeWindow[0];
  if (duration <= 0) return;
  const pixelColumns = Math.max(1, Math.ceil(viewportWidth));
  let activeColumn = -1;
  let minimum = Infinity;
  let maximum = -Infinity;
  let minimumTime = 0;
  let maximumTime = 0;

  const flush = () => {
    if (minimum === Infinity) return;
    if (minimumTime <= maximumTime) {
      visit(minimum, minimumTime);
      if (maximumTime !== minimumTime) visit(maximum, maximumTime);
    } else {
      visit(maximum, maximumTime);
      visit(minimum, minimumTime);
    }
    minimum = Infinity;
    maximum = -Infinity;
  };

  chunks.forEach((chunk) => {
    const chunkDuration = chunk.interval[1] - chunk.interval[0];
    if (chunkDuration <= 0 || chunk.values.length === 0) return;
    const first = Math.max(0, Math.floor(
      (Math.max(timeWindow[0], chunk.interval[0]) - chunk.interval[0])
        / chunkDuration * chunk.values.length
    ));
    const last = Math.min(chunk.values.length, Math.ceil(
      (Math.min(timeWindow[1], chunk.interval[1]) - chunk.interval[0])
        / chunkDuration * chunk.values.length
    ));
    for (let index = first; index < last; index += 1) {
      const value = chunk.values[index];
      const time = chunk.interval[0]
        + index / chunk.values.length * chunkDuration;
      if (!Number.isFinite(value)) {
        flush();
        activeColumn = -1;
        visit(Number.NaN, time);
        continue;
      }
      const column = Math.min(pixelColumns - 1, Math.max(0, Math.floor(
        (time - timeWindow[0]) / duration * pixelColumns
      )));
      if (column !== activeColumn) {
        flush();
        activeColumn = column;
      }
      if (value < minimum) {
        minimum = value;
        minimumTime = time;
      }
      if (value > maximum) {
        maximum = value;
        maximumTime = time;
      }
    }
  });
  flush();
}

/** Build compact clip-space vertices without allocating an object per sample. */
export function createSignalRenderModel({
  channels,
  channelMetadata,
  bidsChannels,
  channelCount,
  timeWindow,
  amplitudeScale,
  withDCOffset,
  stackedView,
  viewportWidth,
}: SignalRenderModelOptions): SignalRenderModel {
  const safeChannelCount = Math.max(1, channelCount);
  const duration = timeWindow[1] - timeWindow[0];
  if (duration <= 0) return {vertices: new Float32Array(), draws: [], hitChannels: []};

  const typeRanges: Record<string, number> = {};
  channels.forEach((channel) => {
    const metadata = channelMetadata[channel.index];
    if (!metadata) return;
    const type = findBidsChannel(metadata, bidsChannels)?.ChannelType ?? 'Unknown';
    const [minimum, maximum] = getVisibleRange(channel, timeWindow);
    typeRanges[type] = Math.max(typeRanges[type] ?? 0, maximum - minimum);
  });

  const prepared: PreparedTrace[] = [];
  const hitChannels: HitChannel[] = [];
  channels.forEach((channel, channelPosition) => {
    const metadata = channelMetadata[channel.index];
    if (!metadata) return;
    const type = findBidsChannel(metadata, bidsChannels)?.ChannelType ?? 'Unknown';
    const range = (typeRanges[type] ?? 0) * Math.max(amplitudeScale, 0);
    const centerY = stackedView
      ? 0
      : 1 - 2 * (channelPosition + 0.5) / safeChannelCount;
    const traces = channel.traces.map((trace) => ({
      chunks: trace.chunks,
      dcOffset: withDCOffset ? getVisibleMean(trace.chunks, timeWindow) : 0,
    }));
    hitChannels.push({channelIndex: channel.index, centerY, range, traces});
    traces.forEach((trace) => prepared.push({
      ...trace,
      channelIndex: channel.index,
      centerY,
      range,
    }));
  });

  let finiteValueCount = 0;
  prepared.forEach((trace) => {
    forEachRenderedValue(trace.chunks, timeWindow, viewportWidth, (value) => {
      if (Number.isFinite(value)) {
        finiteValueCount += 1;
      }
    });
  });
  const vertices = new Float32Array(finiteValueCount * 2);
  const draws: SignalDraw[] = [];
  let vertexOffset = 0;

  prepared.forEach((trace) => {
    let runStart = vertexOffset;
    forEachRenderedValue(trace.chunks, timeWindow, viewportWidth, (value, time) => {
      if (!Number.isFinite(value)) {
        if (vertexOffset - runStart > 1) {
          draws.push({
            channelIndex: trace.channelIndex,
            firstVertex: runStart,
            vertexCount: vertexOffset - runStart,
          });
        }
        runStart = vertexOffset;
        return;
      }
      vertices[vertexOffset * 2] = -1
        + 2 * (time - timeWindow[0]) / duration;
      vertices[vertexOffset * 2 + 1] = trace.range <= Number.EPSILON
        ? trace.centerY
        : trace.centerY
          + 2 * (value - trace.dcOffset) / (trace.range * safeChannelCount);
      vertexOffset += 1;
    });
    if (vertexOffset - runStart > 1) {
      draws.push({
        channelIndex: trace.channelIndex,
        firstVertex: runStart,
        vertexCount: vertexOffset - runStart,
      });
    }
  });

  return {vertices: vertices.subarray(0, vertexOffset * 2), draws, hitChannels};
}

function valueAtTime(chunks: Chunk[], time: number): number | null {
  for (const chunk of chunks) {
    if (time < chunk.interval[0] || time > chunk.interval[1]
      || chunk.values.length === 0) continue;
    const position = (time - chunk.interval[0])
      / Math.max(Number.EPSILON, chunk.interval[1] - chunk.interval[0])
      * chunk.values.length;
    const first = Math.min(chunk.values.length - 1, Math.max(0, Math.floor(position)));
    const second = Math.min(chunk.values.length - 1, first + 1);
    const fraction = position - first;
    const a = chunk.values[first];
    const b = chunk.values[second];
    if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
    return a + (b - a) * fraction;
  }
  return null;
}

/** Find the nearest rendered channel using the source samples, not DOM paths. */
export function hitTestSignalModel(
  model: SignalRenderModel,
  position: [number, number],
  timeWindow: [number, number],
  channelCount: number
): number[] {
  const time = timeWindow[0] + position[0] * (timeWindow[1] - timeWindow[0]);
  const cursorY = 1 - 2 * position[1];
  let closest: number | null = null;
  let closestDistance = Infinity;
  model.hitChannels.forEach((channel) => channel.traces.forEach((trace) => {
    const value = valueAtTime(trace.chunks, time);
    if (value === null) return;
    const y = channel.range <= Number.EPSILON
      ? channel.centerY
      : channel.centerY + 2 * (value - trace.dcOffset)
        / (channel.range * Math.max(1, channelCount));
    const distance = Math.abs(y - cursorY);
    if (distance < closestDistance) {
      closest = channel.channelIndex;
      closestDistance = distance;
    }
  }));
  return closest === null ? [] : [closest];
}
