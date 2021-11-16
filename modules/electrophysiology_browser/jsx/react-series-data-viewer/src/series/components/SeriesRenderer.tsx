import React, {useCallback, useEffect, useState, FunctionComponent} from 'react';
import * as R from 'ramda';
import {vec2} from 'gl-matrix';
import {Group} from '@visx/group';
import {connect} from 'react-redux';
import {scaleLinear, ScaleLinear} from 'd3-scale';
import {MAX_RENDERED_EPOCHS, MAX_CHANNELS, SIGNAL_UNIT, Vector2} from '../../vector';
import ResponsiveViewer from './ResponsiveViewer';
import Axis from './Axis';
import LineChunk from './LineChunk';
import Epoch from './Epoch';
import SeriesCursor from './SeriesCursor';
import {setCursor} from '../store/state/cursor';
import {setRightPanel} from '../store/state/rightPanel';
import {setFilteredEpochs} from '../store/state/dataset';
import {setOffsetIndex} from '../store/logic/pagination';
import IntervalSelect from './IntervalSelect';
import EventManager from './EventManager';
import AnnotationForm from './AnnotationForm';
import {RootState} from '../store';

import {
  setAmplitudesScale,
  resetAmplitudesScale,
} from '../store/logic/scaleAmplitudes';
import {
  LOW_PASS_FILTERS,
  setLowPassFilter,
  HIGH_PASS_FILTERS,
  setHighPassFilter,
} from '../store/logic/highLowPass';
import {
  setViewerWidth,
  setViewerHeight,
} from '../store/state/bounds';
import {
  continueDragSelection,
  endDragSelection,
  startDragSelection,
} from '../store/logic/timeSelection';

import {
  ChannelMetadata,
  Channel,
  Epoch as EpochType,
  RightPanel,
} from '../store/types';

type CProps = {
  viewerWidth: number,
  viewerHeight: number,
  interval: [number, number],
  amplitudeScale: number,
  rightPanel: RightPanel,
  cursor?: number,
  timeSelection?: [number, number],
  setCursor: (number) => void,
  setRightPanel: (_: RightPanel) => void,
  channels: Channel[],
  channelMetadata: ChannelMetadata[],
  hidden: number[],
  epochs: EpochType[],
  filteredEpochs: number[],
  activeEpoch: number,
  offsetIndex: number,
  setOffsetIndex: (_: number) => void,
  setAmplitudesScale: (_: number) => void,
  resetAmplitudesScale: (_: void) => void,
  setLowPassFilter: (_: string) => void,
  setHighPassFilter: (_: string) => void,
  setViewerWidth: (_: number) => void,
  setViewerHeight: (_: number) => void,
  setFilteredEpochs: (_: number[]) => void,
  dragStart: (_: number) => void,
  dragContinue: (_: number) => void,
  dragEnd: (_: number) => void,
  limit: number,
};

const SeriesRenderer: FunctionComponent<CProps> = ({
  viewerHeight,
  viewerWidth,
  interval,
  amplitudeScale,
  cursor,
  rightPanel,
  timeSelection,
  setCursor,
  setRightPanel,
  channels,
  channelMetadata,
  hidden,
  epochs,
  filteredEpochs,
  activeEpoch,
  offsetIndex,
  setOffsetIndex,
  setAmplitudesScale,
  resetAmplitudesScale,
  setLowPassFilter,
  setHighPassFilter,
  setViewerWidth,
  setViewerHeight,
  setFilteredEpochs,
  dragStart,
  dragContinue,
  dragEnd,
  limit,
}) => {
  if (channels.length === 0) return null;

  useEffect(() => {
    setViewerHeight(viewerHeight);
  }, [viewerHeight]);

  useEffect(() => {
    if (refNode) {
      setBounds(refNode.getBoundingClientRect());
    }
  }, [viewerWidth]);

  const [highPass, setHighPass] = useState('none');
  const [lowPass, setLowPass] = useState('none');
  const [refNode, setRefNode] = useState<HTMLDivElement>(null);
  const [bounds, setBounds] = useState<ClientRect>(null);
  const getBounds = useCallback((domNode) => {
    if (domNode) {
      setRefNode(domNode);
    }
  }, []);

  const topLeft = vec2.fromValues(
    -viewerWidth/2,
    viewerHeight/2
  );

  const bottomRight = vec2.fromValues(
    viewerWidth/2,
    -viewerHeight/2
  );

  const diagonal = vec2.create();
  vec2.sub(diagonal, bottomRight, topLeft);

  const center = vec2.create();
  vec2.add(center, topLeft, bottomRight);
  vec2.scale(center, center, 1 / 2);

  const scales: [ScaleLinear<number, number, never>, ScaleLinear<number, number, never>] = [
    scaleLinear()
      .domain(interval)
      .range([topLeft[0], bottomRight[0]]),
    scaleLinear()
      .domain([-viewerHeight/2, viewerHeight/2])
      .range([topLeft[1], bottomRight[1]]),
  ];

  const filteredChannels = channels.filter((_, i) => !hidden.includes(i));

  const XAxisLayer = ({viewerWidth, viewerHeight, interval}) => {
    return (
      <>
        <Group top={-viewerHeight/2} left={-viewerWidth/2}>
          <Axis
            domain={interval}
            range={[0, viewerWidth]}
            orientation='bottom'
          />
        </Group>
        <Group top={viewerHeight/2} left={-viewerWidth/2}>
          <Axis domain={interval} range={[0, viewerWidth]} orientation='top' />
        </Group>
      </>
    );
  };

  const EpochsLayer = () => {
    const fEpochs = [...Array(epochs.length).keys()].filter((i) =>
      epochs[i].onset + epochs[i].duration > interval[0]
      && epochs[i].onset < interval[1]
    );

    return (
      <Group>
        {fEpochs.length < MAX_RENDERED_EPOCHS &&
          fEpochs.map((index) => {
            return (
              <Epoch
                {...epochs[index]}
                parentHeight={viewerHeight}
                key={`${index}`}
                scales={scales}
                opacity={0.7}
              />
            );
          })
        }
        {timeSelection &&
          <Epoch
            onset={timeSelection[0]}
            duration={timeSelection[1] - timeSelection[0]}
            color={'#ffcccc'}
            parentHeight={viewerHeight}
            scales={scales}
            opacity={0.5}
          />
        }
        {activeEpoch !== null &&
          <Epoch
            {...epochs[activeEpoch]}
            parentHeight={viewerHeight}
            scales={scales}
            color={'#ffb2b2'}
          />
        }
      </Group>
    );
  };

  const ChannelAxesLayer = ({viewerWidth, viewerHeight}) => {
    const axisHeight = viewerHeight / MAX_CHANNELS;
    return (
      <Group top={-viewerHeight/2} left={-viewerWidth/2}>
        <line y1="0" y2={viewerHeight} stroke="black" />
        {filteredChannels.map((channel, i) => {
          const seriesRange = channelMetadata[channel.index]?.seriesRange;
          if (!seriesRange) return null;
          return (
            <Axis
              key={`${channel.index}`}
              padding={2}
              domain={seriesRange}
              range={[i * axisHeight, (i + 1) * axisHeight]}
              format={() => ''}
              orientation='right'
              hideLine={true}
            />
          );
        })}
      </Group>
    );
  };

  const ChannelsLayer = ({viewerWidth}) => {
    useEffect(() => {
      setViewerWidth(viewerWidth);
    }, [viewerWidth]);

    return (
      <>
        <clipPath id='lineChunk' clipPathUnits='userSpaceOnUse'>
          <rect
            x={-viewerWidth / 2}
            y={-viewerHeight / (2 * MAX_CHANNELS)}
            width={viewerWidth}
            height={viewerHeight / MAX_CHANNELS}
          />
        </clipPath>

        {filteredChannels.map((channel, i) => {
          if (!channelMetadata[channel.index]) {
            return null;
          }
          const subTopLeft = vec2.create();
          vec2.add(
            subTopLeft,
            topLeft,
            vec2.fromValues(0, (i * diagonal[1]) / MAX_CHANNELS)
          );

          const subBottomRight = vec2.create();
          vec2.add(
            subBottomRight,
            topLeft,
            vec2.fromValues(
              diagonal[0],
              ((i + 1) * diagonal[1]) / MAX_CHANNELS
            )
          );

          const subDiagonal = vec2.create();
          vec2.sub(subDiagonal, subBottomRight, subTopLeft);

          const axisEnd = vec2.create();
          vec2.add(axisEnd, subTopLeft, vec2.fromValues(0.1, subDiagonal[1]));

          const seriesRange = channelMetadata[channel.index].seriesRange;
          const scales: [ScaleLinear<number, number, never>, ScaleLinear<number, number, never>] = [
            scaleLinear()
              .domain(interval)
              .range([subTopLeft[0], subBottomRight[0]]),
            scaleLinear()
              .domain(seriesRange)
              .range([subTopLeft[1], subBottomRight[1]]),
          ];

          return (
            channel.traces.map((trace, j) => (
              trace.chunks.map((chunk, k) => (
                <LineChunk
                  channelIndex={channel.index}
                  traceIndex={j}
                  chunkIndex={k}
                  key={`${k}-${trace.chunks.length}`}
                  chunk={chunk}
                  seriesRange={seriesRange}
                  amplitudeScale={amplitudeScale}
                  scales={scales}
                />
              ))
            ))
          );
        })}
      </>
    );
  };

  const hardLimit = Math.min(offsetIndex + limit - 1, channelMetadata.length);

  const onMouseMove = (v : MouseEvent) => {
    if (bounds === null || bounds === undefined) return;
    const x = Math.min(1, Math.max(0, (v.pageX - bounds.left)/bounds.width));
    return (dragContinue)(x);
  };

  const onMouseUp = (v : MouseEvent) => {
    if (bounds === null || bounds === undefined) return;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    const x = Math.min(100, Math.max(0, (v.pageX - bounds.left)/bounds.width));
    return (dragEnd)(x);
  };

  return (
    <>
      {channels.length > 0 ? (
        <div className='row'>
          <div className={rightPanel ? 'col-md-9' : 'col-xs-12'}>
            <IntervalSelect />
            <div className='row'>
              <div className='col-xs-offset-1 col-xs-11'>
                <div
                  className='row'
                  style={{paddingTop: '15px', paddingBottom: '10px'}}
                >
                  <div
                    className={rightPanel ? 'col-lg-12' : 'col-lg-7'}
                    style={{
                      paddingTop: '5px',
                      paddingBottom: '5px',
                    }}
                  >
                    <div className='btn-group'>
                      <input
                        type='button'
                        style={{width: '25px'}}
                        className='btn btn-primary btn-xs'
                        onClick={() => setAmplitudesScale(1.1)}
                        value='-'
                      />
                      <input
                        type='button'
                        className='btn btn-primary btn-xs'
                        onClick={() => resetAmplitudesScale()}
                        value='Reset Amplitude'
                      />
                      <input
                        type='button'
                        style={{width: '25px'}}
                        className='btn btn-primary btn-xs'
                        onClick={() => setAmplitudesScale(0.9)}
                        value='+'
                      />
                    </div>
                    <div
                      className='btn-group'
                      style={{position: 'relative'}}
                    >
                      <button
                        type="button"
                        className="btn btn-xs btn-primary dropdown-toggle"
                        data-toggle='dropdown'
                      >
                        {HIGH_PASS_FILTERS[highPass].label}
                        <div
                          style={{paddingLeft: '5px'}}
                          className="pull-right"
                        >
                          <span
                            className="glyphicon glyphicon-menu-down"
                          ></span>
                        </div>
                      </button>
                      <ul className="dropdown-menu">
                        {Object.keys(HIGH_PASS_FILTERS).map((key) =>
                          <li
                            key={key}
                            onClick={(e) => {
                              setHighPassFilter(key);
                              setHighPass(key);
                            }}
                          >{HIGH_PASS_FILTERS[key].label}</li>
                        )}
                      </ul>
                    </div>

                    <div
                      className='btn-group'
                      style={{position: 'relative'}}
                    >
                      <button
                        type="button"
                        className="btn btn-xs btn-primary dropdown-toggle"
                        data-toggle='dropdown'
                      >
                        {LOW_PASS_FILTERS[lowPass].label}
                        <div
                          style={{paddingLeft: '5px'}}
                          className="pull-right"
                        >
                          <span
                            className="glyphicon glyphicon-menu-down"
                          ></span>
                        </div>
                      </button>
                      <ul className="dropdown-menu">
                        {Object.keys(LOW_PASS_FILTERS).map((key) =>
                          <li
                            key={key}
                            onClick={(e) => {
                              setLowPassFilter(key);
                              setLowPass(key);
                            }}
                          >{LOW_PASS_FILTERS[key].label}</li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div
                    className={
                      (rightPanel ? '' : 'pull-right-lg ')
                      + 'pagination-nav'
                    }
                    style={{
                      padding: '5px 15px',
                    }}
                  >
                    <small style={{marginRight: '10px'}}>
                      Showing channels{' '}
                      <input
                        type='number'
                        style={{width: '55px'}}
                        value={offsetIndex}
                        onChange={(e) => {
                          let value = parseInt(e.target.value);
                          !isNaN(value) && setOffsetIndex(value);
                        }}
                      />
                      {' '}
                      to {hardLimit} of {channelMetadata.length}
                    </small>
                    <div
                      className='btn-group'
                      style={{marginRight: 0}}
                    >
                      <input
                        type='button'
                        className='btn btn-primary btn-xs'
                        onClick={() => setOffsetIndex(offsetIndex - limit)}
                        value='<<'
                      />
                      <input
                        type='button'
                        className='btn btn-primary btn-xs'
                        onClick={() => setOffsetIndex(offsetIndex - 1)}
                        value='<'
                      />
                      <input
                        type='button'
                        className='btn btn-primary btn-xs'
                        onClick={() => setOffsetIndex(offsetIndex + 1)}
                        value='>'
                      />
                      <input
                        type='button'
                        className='btn btn-primary btn-xs'
                        onClick={() => setOffsetIndex(offsetIndex + limit)}
                        value='>>'
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='row'>
              <div
                className='col-xs-1'
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: viewerHeight,
                }}
              >
                {filteredChannels.map((channel) => (
                  <div
                    key={channel.index}
                    style={{
                      display: 'flex',
                      height: 1 / MAX_CHANNELS * 100 + '%',
                      alignItems: 'center',
                    }}
                  >
                    {channelMetadata[channel.index] &&
                    channelMetadata[channel.index].name}
                  </div>
                ))}
              </div>
              <div
                className='col-xs-11'
                onMouseLeave={() => setCursor(null)}
              >
                <div style={{position: 'relative'}}>
                  <div
                    style={{
                      fontSize: 10,
                      left: '-25px',
                      position: 'absolute',
                    }}
                  >
                    ({SIGNAL_UNIT})
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      bottom: '-20px',
                      right: 0,
                      position: 'absolute',
                    }}
                  >
                    Time (s)
                  </div>
                  <SeriesCursor
                    cursor={cursor}
                    channels={channels}
                    interval={interval}
                  />
                  <div style={{height: viewerHeight}} ref={getBounds}>
                    <ResponsiveViewer
                      // @ts-ignore
                      mouseMove={R.compose(setCursor, R.nth(0))}
                      mouseDown={(v: Vector2) => {
                        document.addEventListener('mousemove', onMouseMove);
                        document.addEventListener('mouseup', onMouseUp);
                        R.compose(dragStart, R.nth(0))(v);
                      }}
                    >
                      <EpochsLayer/>
                      <ChannelsLayer
                        viewerWidth={0}
                      />
                      <XAxisLayer
                        viewerWidth={0}
                        viewerHeight={0}
                        interval={interval}
                      />
                      <ChannelAxesLayer
                        viewerWidth={0}
                        viewerHeight={0}
                      />
                    </ResponsiveViewer>
                  </div>
                </div>
              </div>
            </div>
            <div
              className='row'
              style={{
                marginTop: '25px',
                marginBottom: '15px',
              }}
            >
              <div className='col-xs-offset-1 col-xs-11'>
                {epochs.length > 0 &&
                  <button
                    className={
                      'btn btn-primary'
                      + (rightPanel === 'epochList' ? ' active' : '')
                    }
                    onClick={() => {
                      rightPanel === 'epochList'
                        ? setRightPanel(null)
                        : setRightPanel('epochList');
                    }}
                  >
                    {rightPanel === 'epochList'
                      ? 'Hide Event Panel'
                      : 'Show Event Panel'
                    }
                  </button>
                }

                <div
                  className='pull-right col-xs-7'
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    paddingRight: 0,
                  }}
                >
                  {[...Array(epochs.length).keys()].filter((i) =>
                      epochs[i].onset + epochs[i].duration > interval[0]
                      && epochs[i].onset < interval[1]
                    ).length >= MAX_RENDERED_EPOCHS &&
                    <div
                      style={{
                        padding: '5px',
                        background: '#eee',
                        alignSelf: 'flex-end',
                      }}
                    >
                      Too many events to display for the timeline range.
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
          {rightPanel &&
            <div className='col-md-3'>
              {rightPanel === 'annotationForm' && <AnnotationForm />}
              {rightPanel === 'epochList' && <EventManager />}
            </div>
          }
        </div>
      ) : (
        <div style={{width: '100%', height: '100%'}}>
          <h4>Loading...</h4>
        </div>
      )}
    </>
  );
};

SeriesRenderer.defaultProps = {
  interval: [0.25, 0.75],
  amplitudeScale: 1,
  viewerHeight: 400,
  channels: [],
  epochs: [],
  hidden: [],
  channelMetadata: [],
  offsetIndex: 1,
  limit: MAX_CHANNELS,
};

export default connect(
  (state: RootState)=> ({
    viewerWidth: state.bounds.viewerWidth,
    viewerHeight: state.bounds.viewerHeight,
    interval: state.bounds.interval,
    amplitudeScale: state.bounds.amplitudeScale,
    cursor: state.cursor,
    rightPanel: state.rightPanel,
    timeSelection: state.timeSelection,
    channels: state.dataset.channels,
    epochs: state.dataset.epochs,
    filteredEpochs: state.dataset.filteredEpochs,
    activeEpoch: state.dataset.activeEpoch,
    hidden: state.montage.hidden,
    channelMetadata: state.dataset.channelMetadata,
    offsetIndex: state.dataset.offsetIndex,
  }),
  (dispatch: (_: any) => void) => ({
    setOffsetIndex: R.compose(
      dispatch,
      setOffsetIndex
    ),
    setCursor: R.compose(
      dispatch,
      setCursor
    ),
    setRightPanel: R.compose(
      dispatch,
      setRightPanel
    ),
    setAmplitudesScale: R.compose(
      dispatch,
      setAmplitudesScale
    ),
    resetAmplitudesScale: R.compose(
      dispatch,
      resetAmplitudesScale
    ),
    setLowPassFilter: R.compose(
      dispatch,
      setLowPassFilter
    ),
    setHighPassFilter: R.compose(
      dispatch,
      setHighPassFilter
    ),
    setViewerWidth: R.compose(
      dispatch,
      setViewerWidth
    ),
    setViewerHeight: R.compose(
      dispatch,
      setViewerHeight
    ),
    setFilteredEpochs: R.compose(
      dispatch,
      setFilteredEpochs
    ),
    dragStart: R.compose(
      dispatch,
      startDragSelection
    ),
    dragContinue: R.compose(
      dispatch,
      continueDragSelection
    ),
    dragEnd: R.compose(
      dispatch,
      endDragSelection
    ),
  })
)(SeriesRenderer);
