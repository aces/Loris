import React, {MutableRefObject, useRef} from 'react';
import {Group} from '@visx/group';
import {scaleLinear, ScaleLinear} from 'd3-scale';
import {vec2} from 'gl-matrix';
import {
  DEFAULT_TIME_WINDOW,
  MAX_RENDERED_EVENTS,
  MIN_EVENT_WIDTH,
} from '../../shared/constants';
import {computePercentileRange} from '../../shared/utils';
import MutableKeyDepCache from '../../shared/MutableKeyDepCache';
import {
  Channel,
  ChannelInfo,
  ChannelMetadata,
  EventFilter,
  RecordingEvent,
  Trace,
} from '../../domain/types';
import {findBidsChannel} from '../../channels/channelLogic';
import {getEventsInRange} from '../../events/eventLogic';
import Axis from './Axis';
import EventHighlight from '../../events/components/EventHighlight';
import SignalTraceChunk from './SignalTraceChunk';

type TimeRange = [number, number];
type Scales = [
  ScaleLinear<number, number, never>,
  ScaleLinear<number, number, never>,
];

type ViewerDimensions = {
  viewerWidth: number,
  viewerHeight: number,
};

type ChannelRangeCacheDependencies = {
  timeWindow: TimeRange,
  chunkIds: number[],
  values: Float32Array[],
};

/** Channel range dependencies equal. */
function channelRangeDependenciesEqual(
  first: ChannelRangeCacheDependencies,
  second: ChannelRangeCacheDependencies
): boolean {
  return first.timeWindow[0] === second.timeWindow[0]
    && first.timeWindow[1] === second.timeWindow[1]
    && first.chunkIds.length === second.chunkIds.length
    && first.chunkIds.every((chunkId, index) =>
      chunkId === second.chunkIds[index]
    )
    && first.values.length === second.values.length
    && first.values.every((values, index) =>
      values === second.values[index]
    );
}

/** Get trace visible values. */
function getTraceVisibleValues(
  trace: Trace,
  [windowStart, windowEnd]: TimeRange
): Float32Array {
  const ranges = trace.chunks.flatMap((chunk) => {
    const [chunkStart, chunkEnd] = chunk.interval;
    if (chunkEnd <= windowStart || chunkStart >= windowEnd) return [];
    const duration = chunkEnd - chunkStart;
    const start = Math.max(windowStart, chunkStart);
    const end = Math.min(windowEnd, chunkEnd);
    return [{
      chunk,
      startIndex: Math.max(0, Math.floor(
        (start - chunkStart) / duration * chunk.values.length
      )),
      endIndex: Math.min(chunk.values.length, Math.ceil(
        (end - chunkStart) / duration * chunk.values.length
      )),
    }];
  });
  const values = new Float32Array(
    ranges.reduce((length, range) =>
      length + range.endIndex - range.startIndex, 0
    )
  );
  let writeIndex = 0;
  ranges.forEach(({chunk, startIndex, endIndex}) => {
    values.set(chunk.values.subarray(startIndex, endIndex), writeIndex);
    writeIndex += endIndex - startIndex;
  });
  return values;
}

/** Get channel visible range. */
function getChannelVisibleRange(
  channel: Channel,
  timeWindow: TimeRange
): TimeRange {
  let minimum = Infinity;
  let maximum = -Infinity;
  channel.traces.forEach((trace) => {
    const values = getTraceVisibleValues(trace, timeWindow);
    if (values.length === 0) return;
    const [traceMinimum, traceMaximum] = computePercentileRange(values);
    minimum = Math.min(minimum, traceMinimum);
    maximum = Math.max(maximum, traceMaximum);
  });
  return [minimum, maximum];
}

/** Get scaled mean. */
function getScaledMean(
  values: Float32Array,
  scale: ScaleLinear<number, number>
): number {
  let valueCount = values.length;
  const total = values.reduce((sum, value) => {
    if (isNaN(value)) {
      valueCount--;
      return sum;
    }
    return sum + scale(value);
  }, 0);
  return total / valueCount;
}

/** X axis layer component. */
export function XAxisLayer({
  viewerWidth,
  viewerHeight,
  timeWindow,
}: ViewerDimensions & {timeWindow: TimeRange}) {
  return (
    <>
      <Group top={-viewerHeight / 2} left={-viewerWidth / 2}>
        <Axis
          top={0.5}
          domain={timeWindow}
          range={[0, viewerWidth]}
          orientation='bottom'
          hideLine={true}
        />
      </Group>
      <Group top={viewerHeight / 2} left={-viewerWidth / 2}>
        <Axis
          top={-0.5}
          domain={timeWindow}
          range={[0, viewerWidth]}
          orientation='top'
        />
      </Group>
    </>
  );
}

type EventsLayerProps = ViewerDimensions & {
  events: RecordingEvent[],
  eventFilter: EventFilter,
  timeWindow: TimeRange,
  displayedChannels: Channel[],
  visible: boolean,
  timeSelection: TimeRange | null,
  activeEvent: number | null,
  eventChannels: string[],
};

/** Events layer component. */
export function EventsLayer({
  viewerWidth,
  viewerHeight,
  events,
  eventFilter,
  timeWindow,
  displayedChannels,
  visible,
  timeSelection,
  activeEvent,
  eventChannels,
}: EventsLayerProps) {
  const scales: Scales = [
    scaleLinear().domain(timeWindow)
      .range([-viewerWidth / 2, viewerWidth / 2]),
    scaleLinear().domain([-viewerHeight / 2, viewerHeight / 2])
      .range([viewerHeight / 2, -viewerHeight / 2]),
  ];
  const visibleEvents = visible ? getEventsInRange(events, timeWindow) : [];
  const minimumWidth = (timeWindow[1] - timeWindow[0])
    * MIN_EVENT_WIDTH / DEFAULT_TIME_WINDOW[1];

  return (
    <Group>
      {visibleEvents.length < MAX_RENDERED_EVENTS
        && visibleEvents.sort((first) =>
          events[first]?.channels.length === 0 ? -1 : 1
        ).map((index) =>
          eventFilter.plotVisibility.includes(index)
          && eventFilter.searchVisibility.includes(index)
          && (
            <EventHighlight
              key={`event-${index}`}
              {...events[index]}
              displayedChannels={displayedChannels}
              parentHeight={viewerHeight}
              color={events[index]?.channels?.length > 0
                ? '#7ef1de'
                : '#a6d5f2'}
              scales={scales}
              opacity={0.7}
              minWidth={minimumWidth}
              eventChannels={events[index]?.channels}
            />
          )
        )}
      {timeSelection && activeEvent === null && (
        <EventHighlight
          displayedChannels={displayedChannels}
          onset={Math.min(timeSelection[0], timeSelection[1])}
          duration={Math.abs(timeSelection[1] - timeSelection[0])}
          color='#ff9585'
          parentHeight={viewerHeight}
          scales={scales}
          opacity={0.7}
          eventChannels={eventChannels}
        />
      )}
      {activeEvent !== null && (
        <EventHighlight
          {...events[activeEvent]}
          displayedChannels={displayedChannels}
          parentHeight={viewerHeight}
          scales={scales}
          color='#fff9d6'
          minWidth={minimumWidth}
          eventChannels={eventChannels}
        />
      )}
    </Group>
  );
}

type ChannelAxesLayerProps = ViewerDimensions & {
  channels: Channel[],
  channelMetadata: ChannelMetadata[],
  channelCount: number,
  visible: boolean,
};

/** Channel axes layer component. */
export function ChannelAxesLayer({
  viewerWidth,
  viewerHeight,
  channels,
  channelMetadata,
  channelCount,
  visible,
}: ChannelAxesLayerProps) {
  const axisHeight = viewerHeight / channelCount;
  return (
    <Group top={-viewerHeight / 2} left={-viewerWidth / 2}>
      <line y1='0' y2={viewerHeight} stroke='black'/>
      {channels.map((channel, index) => {
        const signalRange = channelMetadata[channel.index]?.signalRange;
        if (!signalRange || !visible) return null;
        return (
          <Axis
            key={channel.index}
            padding={2}
            domain={signalRange}
            range={[index * axisHeight, (index + 1) * axisHeight]}
            format={() => ''}
            orientation='right'
            hideLine={true}
          />
        );
      })}
    </Group>
  );
}

type ChannelsLayerProps = ViewerDimensions & {
  cursorRef: MutableRefObject<HTMLElement | null>,
  stackedView: boolean,
  singleMode: boolean,
  hoveredChannels: number[],
  channels: Channel[],
  channelMetadata: ChannelMetadata[],
  bidsChannels: ChannelInfo[],
  physioFileID: number,
  channelCount: number,
  timeWindow: TimeRange,
  amplitudeScale: number,
  withDCOffset: boolean,
};

/** Channels layer component. */
export function ChannelsLayer({
  viewerWidth,
  viewerHeight,
  cursorRef,
  stackedView,
  singleMode,
  hoveredChannels,
  channels,
  channelMetadata,
  bidsChannels,
  physioFileID,
  channelCount,
  timeWindow,
  amplitudeScale,
  withDCOffset,
}: ChannelsLayerProps) {
  const rangeCache = useRef(new MutableKeyDepCache<
    number,
    ChannelRangeCacheDependencies,
    TimeRange
  >(channelRangeDependenciesEqual));

  const displayedChannels = (
    !cursorRef.current && stackedView && singleMode && hoveredChannels.length > 0
  )
    ? channels.filter((channel) => hoveredChannels.includes(channel.index))
    : channels;
  const topLeft = vec2.fromValues(-viewerWidth / 2, viewerHeight / 2);
  const bottomRight = vec2.fromValues(viewerWidth / 2, -viewerHeight / 2);
  const diagonal = vec2.sub(vec2.create(), bottomRight, topLeft);
  const typeRanges: Record<string, number> = {};

  displayedChannels.forEach((channel) => {
    const type = findBidsChannel(
      channelMetadata[channel.index], bidsChannels
    )?.ChannelType ?? 'Unknown';
    const [minimum, maximum] = rangeCache.current.get(
      channel.index,
      {
        timeWindow,
        chunkIds: channel.traces.flatMap((trace) =>
          trace.chunks.map((chunk) => chunk.index)
        ).sort(),
        values: channel.traces.flatMap((trace) =>
          trace.chunks.map((chunk) => chunk.values)
        ),
      },
      () => getChannelVisibleRange(channel, timeWindow)
    );
    typeRanges[type] = Math.max(typeRanges[type] ?? 0, maximum - minimum);
  });

  return (
    <>
      <clipPath
        id={`lineChunk-${physioFileID}`}
        clipPathUnits='userSpaceOnUse'
      >
        <rect
          x={-viewerWidth / 2}
          y={-viewerHeight / (2 * channelCount)}
          width={viewerWidth}
          height={viewerHeight / channelCount}
        />
      </clipPath>
      {displayedChannels.map((channel, channelPosition) => {
        if (!channelMetadata[channel.index]) return null;
        const subTopLeft = vec2.add(
          vec2.create(),
          topLeft,
          vec2.fromValues(
            0,
            stackedView && !singleMode
              ? (channelCount - 2) * diagonal[1] / (2 * channelCount)
              : channelPosition * diagonal[1] / channelCount
          )
        );
        const subBottomRight = vec2.add(
          vec2.create(),
          topLeft,
          vec2.fromValues(
            diagonal[0],
            stackedView && !singleMode
              ? (channelCount + 2) * diagonal[1] / (2 * channelCount)
              : (channelPosition + 1) * diagonal[1] / channelCount
          )
        );

        return channel.traces.map((trace, traceIndex) => {
          const values = getTraceVisibleValues(trace, timeWindow);
          if (values.length === 0) return null;
          const type = findBidsChannel(
            channelMetadata[channel.index], bidsChannels
          )?.ChannelType ?? 'Unknown';
          const range = typeRanges[type] ?? 0;
          const signalRange: TimeRange = [
            -range / 2,
            range / 2,
          ];
          const scales: Scales = [
            scaleLinear().domain(timeWindow)
              .range([subTopLeft[0], subBottomRight[0]]),
            scaleLinear().domain(signalRange).range(
              stackedView
                ? [
                  -viewerHeight / (2 * channelCount),
                  viewerHeight / (2 * channelCount),
                ]
                : [subTopLeft[1], subBottomRight[1]]
            ),
          ];
          const amplitudeScaleFunction = scaleLinear()
            .domain(signalRange.map((value) => value * amplitudeScale))
            .range([-0.5, 0.5]);
          const dcOffset = withDCOffset
            ? getScaledMean(values, amplitudeScaleFunction)
            : 0;
          const chunkCount = trace.chunks.filter(
            (chunk) => chunk.values.length > 0
          ).length;

          return trace.chunks.map((chunk, chunkIndex, chunks) => (
            <SignalTraceChunk
              channelIndex={channel.index}
              traceIndex={traceIndex}
              chunkIndex={chunkIndex}
              key={`${channel.index}-${chunkIndex}-${trace.chunks.length}`}
              chunk={chunk}
              signalRange={signalRange}
              amplitudeScale={amplitudeScale}
              scales={scales}
              physioFileID={physioFileID}
              isHovered={hoveredChannels.includes(channel.index)}
              isStacked={stackedView}
              withDCOffset={dcOffset}
              numChannels={channelCount}
              numChunks={chunkCount}
              previousPoint={chunkIndex === 0
                ? null
                : chunks[chunkIndex - 1].values.slice(-1)[0]}
            />
          ));
        });
      })}
    </>
  );
}
