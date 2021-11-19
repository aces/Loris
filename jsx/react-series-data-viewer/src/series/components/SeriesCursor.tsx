import * as R from 'ramda';
import {bisector} from 'd3-array';
import {colorOrder} from '../../color';
import {Channel, Epoch} from '../store/types';
import {connect} from 'react-redux';
import {MAX_RENDERED_EPOCHS, SIGNAL_SCALE, SIGNAL_UNIT} from '../../vector';
import {useEffect} from 'react';
import {RootState} from '../store';

type CursorContentProps = {
  time: number,
  channel: Channel,
  contentIndex: number,
  showMarker: boolean,
};

type CProps = {
  cursor: number,
  channels: Channel[],
  epochs: Epoch[],
  filteredEpochs: number[],
  CursorContent: (_: CursorContentProps) => JSX.Element,
  interval: [number, number],
  showMarker: boolean
};

const SeriesCursor = (
  {
    cursor,
    channels,
    epochs,
    filteredEpochs,
    CursorContent,
    interval,
    showMarker,
  }: CProps
) => {
  if (!cursor) return null;

  let reversedEpochs = [...filteredEpochs].reverse();
  useEffect(() => {
    reversedEpochs = [...filteredEpochs].reverse();
  }, [filteredEpochs]);

  const left = Math.min(Math.max(100 * cursor, 0), 100) + '%';
  const time = interval[0] + cursor * (interval[1] - interval[0]);

  const Cursor = () => (
    <div
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
            showMarker={showMarker}
          />
        </div>
      ))}
    </div>
  );

  const TimeMarker = () => (
    <div
      style={{
        left,
        top: '100%',
        position: 'absolute',
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#fff',
        color: '#064785',
        padding: '2px 2px',
        borderRadius: '3px',
      }}
    >
      {Math.round(time)} s
    </div>
  );

  const EpochMarker = () => {
    if (reversedEpochs.length > MAX_RENDERED_EPOCHS) return null;

    const index = reversedEpochs.find((index) =>
      epochs[index].onset < time
    );

    return index !== undefined ? (
      <div
        style={{
          left,
          top: 'calc(100% + 26px)',
          position: 'absolute',
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: '#E4EBF2',
          padding: '2px 2px',
          borderRadius: '3px',
        }}
      >
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
      <ValueTags />
      <TimeMarker />
      <EpochMarker />
    </div>
  );
};

const createIndices = R.memoizeWith(
  R.identity,
  (array) => array.map((_, i) => i)
);

const indexToTime = (chunk) => (index) =>
  chunk.interval[0] +
  (index / chunk.values.length) * (chunk.interval[1] - chunk.interval[0]);

const CursorContent = ({time, channel, contentIndex, showMarker}) => {
  const Marker = ({color}) => (
    <div
      style={{
        margin: 'auto',
        marginLeft: '5px',
        marginRight: '5px',
        padding: '5px 5px',
        backgroundColor: color,
      }}
    />
  );

  return (
    <div style={{margin: '5px 5px'}}>
      {channel.traces.map((trace, i) => {
        const chunk = trace.chunks.find(
          (chunk) => chunk.interval[0] <= time && chunk.interval[1] >= time
        );
        const computeValue = (chunk) => {
          const indices = createIndices(chunk.values);
          const bisectTime = bisector(indexToTime(chunk)).left;
          const idx = bisectTime(indices, time);
          const value = chunk.values[idx-1];

          return value * SIGNAL_SCALE;
        };

        return (
          <div
            key={`${i}-${channel.traces.length}`}
            style={{
              display: 'flex',
              flexDirection: 'row',
              backgroundColor: 'rgba(238, 238, 238, 0.8)',
              padding: '2px 2px',
              borderRadius: '3px',
            }}
          >
            {showMarker && (<Marker color={colorOrder(contentIndex)} />)}
            {chunk && Math.round(computeValue(chunk))} {SIGNAL_UNIT}
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
  showMarker: false,
};

export default connect(
  (state: RootState)=> ({
    epochs: state.dataset.epochs,
    filteredEpochs: state.dataset.filteredEpochs,
  })
)(SeriesCursor);
