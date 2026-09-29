import React from 'react';
import {Group} from '@visx/group';
import {scaleLinear, ScaleLinear} from 'd3-scale';
import {
  DEFAULT_TIME_WINDOW,
  MAX_RENDERED_EVENTS,
  MIN_EVENT_WIDTH,
} from '../../shared/constants';
import {
  Channel,
  ChannelMetadata,
  EventFilter,
  RecordingEvent,
} from '../../domain/types';
import {getEventsInRange} from '../../events/eventLogic';
import Axis from './Axis';
import EventHighlight from '../../events/components/EventHighlight';

type TimeRange = [number, number];
type Scales = [
  ScaleLinear<number, number, never>,
  ScaleLinear<number, number, never>,
];

type ViewerDimensions = {
  viewerWidth: number,
  viewerHeight: number,
};


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
