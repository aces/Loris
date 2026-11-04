import React, {MutableRefObject, useContext} from 'react';
import {bisector} from 'd3-array';
import {useTranslation} from 'react-i18next';
import {colorOrder} from '../../ui/colors';
import {MAX_RENDERED_EVENTS} from '../../shared/constants';
import {normalizeUnit, normalizeValueUnit} from '../../shared/utils';
import {HoveredChannelsContext}
  from '../../recording/RecordingDataProvider';
import {Channel, ChannelMetadata, Chunk, RecordingEvent} from '../../domain/types';
import {getChannelUnit, useChannelInfo} from '../../channels/channelLogic';
import {getEventsInRange} from '../../events/eventLogic';

export type CursorContentProps = {
  time: number,
  channel: Channel,
  contentIndex: number,
  showEvents: boolean,
  channelMetadata: ChannelMetadata[],
};

const indicesByValues = new WeakMap<object, number[]>();

/** Create indices. */
function createIndices(values: Float32Array): number[] {
  let indices = indicesByValues.get(values);
  if (!indices) {
    indices = Array.from(values, (_, index) => index);
    indicesByValues.set(values, indices);
  }
  return indices;
}

/** Compute value. */
function computeValue(chunk: Chunk, time: number): number {
  /** Index to time. */
  const indexToTime = (index: number) => chunk.interval[0]
    + index / chunk.values.length * (chunk.interval[1] - chunk.interval[0]);
  const index = bisector(indexToTime).left(createIndices(chunk.values), time);
  return chunk.values[Math.max(0, index - 1)];
}

/** Cursor line component. */
export function CursorLine({
  cursorRef,
  left,
}: {
  cursorRef: MutableRefObject<any>,
  left: string | number,
}) {
  return <div ref={cursorRef} style={{
    position: 'absolute',
    left,
    top: 0,
    backgroundColor: '#000',
    width: '1px',
    height: '100%',
  }}/>;
}

/** Cursor value tags component. */
export function CursorValueTags({
  left,
  time,
  channels,
  CursorContent,
  showEvents,
  channelMetadata,
}: {
  left: string | number,
  time: number,
  channels: Channel[],
  CursorContent: (_: CursorContentProps) => JSX.Element,
  showEvents: boolean,
  channelMetadata: ChannelMetadata[],
}) {
  return (
    <div style={{
      left,
      top: 0,
      height: '100%',
      position: 'absolute',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      {channels.map((channel, index) => (
        <div
          key={`${channel.index}-${channels.length}`}
          style={{margin: 'auto'}}
        >
          <CursorContent
            time={time}
            channel={channel}
            contentIndex={index}
            showEvents={showEvents}
            channelMetadata={channelMetadata}
          />
        </div>
      ))}
    </div>
  );
}

/** Hovered channel value component. */
function HoveredChannelValue({
  channel,
  time,
  channelName,
}: {
  channel: Channel,
  time: number,
  channelName: string,
}) {
  const chunk = channel.traces[0].chunks.find(
    (candidate) => candidate.interval[0] <= time
      && candidate.interval[1] >= time
  );
  const unit = normalizeUnit(getChannelUnit(useChannelInfo(channel)));
  if (!chunk) return null;
  const value = normalizeValueUnit(computeValue(chunk, time), unit);
  return (
    <div style={{color: colorOrder(channel.index.toString()).toString()}}>
      {channelName}: {value} {unit}
    </div>
  );
}

/** Cursor event marker component. */
function CursorEventMarker({
  time,
  timeWindow,
  events,
  visibleEventIndices,
  hoveredChannels,
  channelMetadata,
}: {
  time: number,
  timeWindow: [number, number],
  events: RecordingEvent[],
  visibleEventIndices: number[],
  hoveredChannels: number[],
  channelMetadata: ChannelMetadata[],
}) {
  const eventsInRange = getEventsInRange(events, timeWindow);
  if (eventsInRange.filter(
    (index) => visibleEventIndices.includes(index)
  ).length > MAX_RENDERED_EVENTS) {
    return null;
  }
  const hoveredChannelNames = hoveredChannels.map(
    (channelIndex) => channelMetadata[channelIndex].name
  );
  const indices = eventsInRange.filter((index) =>
    visibleEventIndices.includes(index)
    && events[index].onset <= time
    && events[index].onset + Math.max(events[index].duration, 1) >= time
  );
  if (indices.length === 0) return null;

  return (
    <div>
      {indices.map((index, position) => (
        <span key={`hovered-channel-${index}-${position}`} style={{
          fontWeight: events[index].channels.length === 0
            || hoveredChannelNames.some((channelName) =>
              events[index].channels.includes(channelName)
            )
            ? 'bold'
            : 'normal',
        }}>
          {position > 0 && ', '}
          {events[index].label}
        </span>
      ))}
    </div>
  );
}

/** Cursor time marker component. */
export function CursorTimeMarker({
  left,
  time,
  timeWindow,
  channels,
  events,
  visibleEventIndices,
  showEvents,
  channelMetadata,
}: {
  left: string | number,
  time: number,
  timeWindow: [number, number],
  channels: Channel[],
  events: RecordingEvent[],
  visibleEventIndices: number[],
  showEvents: boolean,
  channelMetadata: ChannelMetadata[],
}) {
  const {t} = useTranslation();
  const {hoveredChannels} = useContext(HoveredChannelsContext);
  return (
    <div style={{
      left,
      top: '100%',
      position: 'absolute',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#fff',
      color: '#064785',
      padding: '2px',
      borderRadius: '3px',
    }}>
      {t('{{seconds}} s', {
        ns: 'electrophysiology_browser',
        seconds: Math.round(time * 1000) / 1000,
      })}
      <div style={{display: 'flex', flexDirection: 'column'}}>
        {hoveredChannels.map((channelIndex) => {
          const channel = channels.find(
            (candidate) => candidate.index === channelIndex
          );
          return channel && (
            <HoveredChannelValue
              key={channelIndex}
              channel={channel}
              time={time}
              channelName={channelMetadata[channelIndex].name}
            />
          );
        })}
      </div>
      {showEvents && (
        <CursorEventMarker
          time={time}
          timeWindow={timeWindow}
          events={events}
          visibleEventIndices={visibleEventIndices}
          hoveredChannels={hoveredChannels}
          channelMetadata={channelMetadata}
        />
      )}
    </div>
  );
}

/** Default cursor content component. */
export function DefaultCursorContent({
  time,
  channel,
  channelMetadata,
}: CursorContentProps) {
  const {hoveredChannels} = useContext(HoveredChannelsContext);
  const unit = normalizeUnit(getChannelUnit(useChannelInfo(channel)));
  return (
    <div style={{margin: '0 5px', width: '120px'}}>
      {channel.traces.map((trace, index) => {
        const chunk = trace.chunks.find(
          (candidate) => candidate.interval[0] <= time
            && candidate.interval[1] >= time
        );
        return (
          <div key={`${index}-${channel.traces.length}`} style={{
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: 'rgba(238, 238, 238, 0.65)',
            padding: '2px',
            borderRadius: '3px',
            color: hoveredChannels.includes(channel.index)
              ? colorOrder(channel.index.toString()).toString()
              : '#333',
          }}>
            {channelMetadata[channel.index].name}:&nbsp;
            {chunk && normalizeValueUnit(computeValue(chunk, time), unit)} {unit}
          </div>
        );
      })}
    </div>
  );
}
