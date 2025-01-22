import * as R from 'ramda';
import {bisector} from 'd3-array';
import {colorOrder} from '../../color';
import {Channel, ChannelMetadata, Epoch} from '../store/types';
import {connect} from 'react-redux';
import {MAX_RENDERED_EPOCHS, SIGNAL_SCALE, SIGNAL_UNIT} from '../../vector';
import {MutableRefObject, useEffect} from 'react';
import {RootState} from '../store';
import {getEpochsInRange} from '../store/logic/filterEpochs';

type CursorContentProps = {
  time: number,
  channel: Channel,
  contentIndex: number,
  showEvents: boolean,
  hoveredChannels: number[],
  channelMetadata: ChannelMetadata[],
};

type CProps = {
  cursorRef: MutableRefObject<any>,
  cursorPosition: [number, number],
  channels: Channel[],
  epochs: Epoch[],
  filteredEpochs: number[],
  CursorContent: (_: CursorContentProps) => JSX.Element,
  interval: [number, number],
  showEvents: boolean,
  enabled: boolean,
  hoveredChannels: number[],
  channelMetadata: ChannelMetadata[],
};

/**
 *
 * @param root0
 * @param root0.cursorRef
 * @param root0.cursorPosition
 * @param root0.channels
 * @param root0.epochs
 * @param root0.filteredEpochs
 * @param root0.CursorContent
 * @param root0.interval
 * @param root0.showEvents
 * @param root0.enabled
 * @param root0.hoveredChannels
 * @param root0.channelMetadata
 */
const SeriesCursor = (
  {
    cursorRef,
    cursorPosition,
    channels,
    epochs,
    filteredEpochs,
    CursorContent,
    interval,
    showEvents,
    enabled,
    hoveredChannels,
    channelMetadata,
  }: CProps
) => {
  let reversedEpochs = [...filteredEpochs].reverse();
  useEffect(() => {
    reversedEpochs = [...filteredEpochs].reverse();
  }, [filteredEpochs]);

  if (!cursorPosition) return null;

  const left = Math.min(Math.max(100 * cursorPosition[0], 0), 100) + '%';
  const time = interval[0] + cursorPosition[0] * (interval[1] - interval[0]);

  /**
   *
   */
  const Cursor = () => (
    <div
      ref={cursorRef}
      style={{
        position: 'absolute',
        left,
        top: '0',
        backgroundColor: '#000',
        width: '1px',
        height: '100%',
      }}
    />
  );

  /**
   *
   */
  const ValueTags = () => (
    <div
      style={{
        left,
        top: '0',
        height: '100%',
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {channels.map((channel, i) => (
        <div
          key={`${channel.index}-${channels.length}`}
          style={{margin: 'auto'}}
        >
          <CursorContent
            time={time}
            channel={channel}
            contentIndex={i}
            showEvents={showEvents}
            hoveredChannels={hoveredChannels}
            channelMetadata={channelMetadata}
          />
        </div>
      ))}
    </div>
  );

  /**
   *
   */
  const TimeMarker = () => (
    <div
      style={{
        left,
        top: '100%',
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        color: '#064785',
        padding: '2px 2px',
        borderRadius: '3px',
      }}
    >
      {Math.round(time * 1000) / 1000}s
      <br/>
      {showEvents && <EpochMarker />}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {hoveredChannels.map((channelIndex) => {
          const channelName = channelMetadata[channelIndex].name;
          const hoveredChannel = channels.find(
            (channel) => channel.index === channelIndex
          );
          if (!hoveredChannel) return;
          const hoveredChunk = hoveredChannel.traces[0].chunks.find(
            (chunk) => chunk.interval[0] <= time &&
              chunk.interval[1] >= time
          );
          if (!hoveredChunk) return;
          const chunkValue = computeValue(hoveredChunk, time);
          const channelColor = colorOrder(channelIndex.toString()).toString();
          return (
            <div
              key={channelIndex.toString()}
              style={{
                color: channelColor,
                width: '100px',
              }}
            >
            {channelName}: {Math.round(chunkValue)} {SIGNAL_UNIT}
            </div>
          );
        })}
      </div>
    </div>
  );

  /**
   *
   */
  const EpochMarker = () => {
    const visibleEpochs = getEpochsInRange(epochs, interval);
    if (visibleEpochs
        .filter((index) => {
 filteredEpochs.includes(index);
})
        .length > MAX_RENDERED_EPOCHS
    ) {
      return null;
    }

    const index = visibleEpochs.find((index) =>
      epochs[index].onset < time &&
      (epochs[index].onset + Math.max(epochs[index].duration, 0.05)) > time
    );

    return index !== undefined ? (
      <div>
        {epochs[index].label}
      </div>
    ) : null;
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      <Cursor />
      {enabled ? <ValueTags /> : null}
      <TimeMarker />
    </div>
  );
};

const createIndices = R.memoizeWith(
  (s: string) => s,
  (array) => array.map((_, i) => i)
);

/**
 *
 * @param chunk
 */
const indexToTime = (chunk) => (index) =>
  chunk.interval[0] +
  (index / chunk.values.length) * (chunk.interval[1] - chunk.interval[0]);

/**
 *
 * @param chunk
 * @param time
 */
const computeValue = (chunk, time) => {
  const indices = createIndices(chunk.values);
  const bisectTime = bisector(indexToTime(chunk)).left;
  const idx = bisectTime(indices, time);
  const value = chunk.values[idx-1];

  return value * SIGNAL_SCALE;
};

/**
 *
 * @param root0
 * @param root0.time
 * @param root0.channel
 * @param root0.contentIndex
 * @param root0.showEvents
 * @param root0.hoveredChannels
 * @param root0.channelMetadata
 */
const CursorContent = (
  {
    time,
    channel,
    contentIndex,
    showEvents,
    hoveredChannels,
    channelMetadata,
  }: CursorContentProps
) => {
  return (
    <div style={{margin: '0 5px', width: '120px'}}>
      {channel.traces.map((trace, i) => {
        const chunk = trace.chunks.find(
          (chunk) => chunk.interval[0] <= time && chunk.interval[1] >= time
        );

        return (
          <div
            key={`${i}-${channel.traces.length}`}
            style={{
              display: 'flex',
              flexDirection: 'row',
              backgroundColor: 'rgba(238, 238, 238, 0.65)',
              padding: '2px 2px',
              borderRadius: '3px',
              color: `${hoveredChannels.includes(channel.index)
                ? colorOrder(channel.index.toString())
                : '#333'
              }`,
            }}
          >
            {channelMetadata[channel.index].name}:&nbsp;
            {chunk && Math.round(computeValue(chunk, time))} {SIGNAL_UNIT}
          </div>
        );
      })}
    </div>
  );
};

SeriesCursor.defaultProps = {
  channels: [],
  epochs: [],
  filteredEpochs: [],
  CursorContent,
  showEvents: false,
  enabled: false,
};

export default connect(
  (state: RootState)=> ({
    cursorPosition: state.cursor.cursorPosition,
    epochs: state.dataset.epochs,
    filteredEpochs: state.dataset.filteredEpochs.plotVisibility,
  })
)(SeriesCursor);
