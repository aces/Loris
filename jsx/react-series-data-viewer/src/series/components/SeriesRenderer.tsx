import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  FunctionComponent,
  MutableRefObject,
} from 'react';
import * as R from 'ramda';
import {vec2} from 'gl-matrix';
import {Group} from '@visx/group';
import {connect} from 'react-redux';
import {scaleLinear, ScaleLinear} from 'd3-scale';
import {colorOrder} from "../../color";
import {
  MAX_RENDERED_EPOCHS,
  MAX_CHANNELS,
  CHANNEL_DISPLAY_OPTIONS,
  SIGNAL_UNIT,
  Vector2,
  DEFAULT_TIME_INTERVAL,
} from '../../vector';
import ResponsiveViewer from './ResponsiveViewer';
import Axis from './Axis';
import LineChunk from './LineChunk';
import Epoch from './Epoch';
import SeriesCursor from './SeriesCursor';
import {setRightPanel} from '../store/state/rightPanel';
import {setFilteredEpochs, setDatasetMetadata} from '../store/state/dataset';
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
  setInterval,
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
  AnnotationMetadata,
} from '../store/types';
import {setCurrentAnnotation} from '../store/state/currentAnnotation';
import {setCursorInteraction} from "../store/logic/cursorInteraction";
import {setHoveredChannels} from "../store/state/cursor";

type CProps = {
  ref: MutableRefObject<any>,
  viewerWidth: number,
  viewerHeight: number,
  interval: [number, number],
  domain: number,
  amplitudeScale: number,
  rightPanel: RightPanel,
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
  setDatasetMetadata: (_: { limit: number }) => void,
  dragStart: (_: number) => void,
  dragContinue: (_: number) => void,
  dragEnd: (_: number) => void,
  limit: number,
  setInterval: (_: [number, number]) => void,
  setCurrentAnnotation: (_: EpochType) => void,
  physioFileID: number,
  annotationMetadata: AnnotationMetadata,
  hoveredChannels: number[],
  setHoveredChannels:  (_: number[]) => void,
};

/**
 *
 * @param root0
 * @param root0.viewerHeight
 * @param root0.viewerWidth
 * @param root0.interval
 * @param root0.setInterval
 * @param root0.domain
 * @param root0.amplitudeScale
 * @param root0.rightPanel
 * @param root0.timeSelection
 * @param root0.setCursor
 * @param root0.setRightPanel
 * @param root0.channels
 * @param root0.channelMetadata
 * @param root0.hidden
 * @param root0.epochs
 * @param root0.filteredEpochs
 * @param root0.activeEpoch
 * @param root0.offsetIndex
 * @param root0.setOffsetIndex
 * @param root0.setAmplitudesScale
 * @param root0.resetAmplitudesScale
 * @param root0.setLowPassFilter
 * @param root0.setHighPassFilter
 * @param root0.setViewerWidth
 * @param root0.setViewerHeight
 * @param root0.setFilteredEpochs
 * @param root0.setDatasetMetadata
 * @param root0.dragStart
 * @param root0.dragContinue
 * @param root0.dragEnd
 * @param root0.limit
 * @param root0.setCurrentAnnotation
 * @param root0.physioFileID
 * @param root0.annotationMetadata
 * @param root0.hoveredChannels
 * @param root0.setHoveredChannels
 */
const SeriesRenderer: FunctionComponent<CProps> = ({
  viewerHeight,
  viewerWidth,
  interval,
  setInterval,
  domain,
  amplitudeScale,
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
  setDatasetMetadata,
  dragStart,
  dragContinue,
  dragEnd,
  limit,
  setCurrentAnnotation,
  physioFileID,
  annotationMetadata,
  hoveredChannels,
  setHoveredChannels
}) => {
  if (channels.length === 0) return null;

  const intervalChange = Math.pow(
    10,
    Math.max(
      Math.floor(Math.log10(interval[1] - interval[0])) - 1,
      -1
    )
  );  // Scale to interval size

  const zoomIn = () => {
    const zoomInterval = (interval[1] - interval[0]) < 0.3
      ? 0
      : intervalChange; // Limit zooming
    setInterval([interval[0] + zoomInterval, interval[1] - zoomInterval]);
  }

  const zoomOut = () => {
    setInterval([interval[0] - intervalChange, interval[1] + intervalChange]);
  }

  const zoomReset = () => {
    const defaultInterval = DEFAULT_TIME_INTERVAL[1] - DEFAULT_TIME_INTERVAL[0];
    const currentMidpoint = (interval[1] + interval[0]) / 2;
    let lowerBound = currentMidpoint - defaultInterval / 2;
    let upperBound = currentMidpoint + defaultInterval / 2;

    if (lowerBound < domain[0]) {
      const difference = domain[0] - lowerBound;
      lowerBound = domain[0];
      upperBound = upperBound + difference;
    } else if (upperBound > domain[1]) {
      const difference = upperBound - domain[1];
      lowerBound = lowerBound - difference;
      upperBound = domain[1];
    }

    setInterval([
      Math.max(lowerBound, domain[0]),
      Math.min(upperBound, domain[1])
    ]);
  }

  const zoomToSelection = () => {
    if (timeSelection && (timeSelection[1] - timeSelection[0]) >= 0.1) {
      setInterval([
        Math.min(timeSelection[0], timeSelection[1]),
        Math.max(timeSelection[0], timeSelection[1])
      ]);
    }
  }

  const viewerRef = useRef(null);
  const cursorRef = useRef(null);

  // Memoized to singal which vars are to be read from
  const memoizedCallback = useCallback(() => {}, [offsetIndex, interval, limit, timeSelection]);
  useEffect(() => { // Keypress handler
    const keybindHandler = (e) => {
      if (cursorRef.current) { // Cursor is on page / focus
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
          e.preventDefault(); // Make sure arrows don't scroll

          const intervalSize = interval[1] - interval[0];
          switch (e.code) {
            case "ArrowUp":
              setOffsetIndex(offsetIndex - limit);
              break;
            case "ArrowDown":
              setOffsetIndex(offsetIndex + limit);
              break;
            case "ArrowRight":
              setInterval([
                Math.min(Math.ceil(domain[1]) - intervalSize, interval[0] + intervalSize),
                Math.min(Math.ceil(domain[1]), interval[1] + intervalSize)
              ]);
              break;
            case "ArrowLeft":
              setInterval([
                Math.max(Math.floor(domain[0]), interval[0] - intervalSize),
                Math.max(Math.floor(domain[0]) + intervalSize, interval[1] - intervalSize)
              ]);
              break;
            default:
              console.log('Keyboard event handler error.');
              break;
          }
        }

        if (e.shiftKey) {
          switch (e.code) {
            case 'KeyV':
              toggleCursor();
              break;
          }
        }
      }

      // Generic keybinds that don't require focus
      if (e.shiftKey) {
        switch (e.code) {
          case 'KeyC':
            setRightPanel(null);
            break;
          case 'KeyA':
            setRightPanel('annotationForm');
            break;
          case 'KeyZ':
            zoomToSelection();
            break;
          case 'KeyX':
            zoomReset();
            break;
          case 'Minus':
            zoomOut();
            break;
          case 'Equal': // This key combination is '+'
            zoomIn();
            break;
        }
      }
    }

    window.addEventListener('keydown', keybindHandler);
    return function cleanUp() { // Prevent multiple listeners
      window.removeEventListener('keydown', keybindHandler);
    }
  }, [memoizedCallback]);

  useEffect(() => {
    setViewerHeight(viewerHeight);
  }, [viewerHeight]);

  useEffect(() => {
    if (refNode) {
      setBounds(refNode.getBoundingClientRect());
    }
  }, [viewerWidth]);

  const [numDisplayedChannels, setNumDisplayedChannels] = useState(MAX_CHANNELS);
  const [cursorEnabled, setCursorEnabled] = useState(false);
  const toggleCursor = () => setCursorEnabled(value => !value);
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

  const scales: [
      ScaleLinear<number, number, never>,
      ScaleLinear<number, number, never>
  ] = [
    scaleLinear()
      .domain(interval)
      .range([topLeft[0], bottomRight[0]]),
    scaleLinear()
      .domain([-viewerHeight/2, viewerHeight/2])
      .range([topLeft[1], bottomRight[1]]),
  ];

  const filteredChannels = channels.filter((_, i) => !hidden.includes(i));
  const showAxisScaleLines = false;   // Visibility state of y-axis scale lines

  /**
   *
   * @param root0
   * @param root0.viewerWidth
   * @param root0.viewerHeight
   * @param root0.interval
   */
  const XAxisLayer = ({viewerWidth, viewerHeight, interval}) => {
    return (
      <>
        <Group top={-viewerHeight/2} left={-viewerWidth/2}>
          <Axis
            domain={interval}
            range={[0, viewerWidth]}
            orientation='top'
          />
        </Group>
        <Group top={viewerHeight/2} left={-viewerWidth/2}>
          <Axis domain={interval} range={[0, viewerWidth]} orientation='bottom' />
        </Group>
      </>
    );
  };

  const EpochsLayer = () => {
    // ##################### EEGNET OVERRIDE START ################## //
    // Override: Delete Enclosed Code
    /*const fEpochs = [...Array(epochs.length).keys()].filter((i) =>
      epochs[i].onset + epochs[i].duration > interval[0]
      && epochs[i].onset < interval[1]
    );*/
    // ##################### EEGNET OVERRIDE END ################## //

    return (
      <Group>
        {// ##################### EEGNET OVERRIDE START ################## //
          filteredEpochs.length < MAX_RENDERED_EPOCHS &&
          filteredEpochs.map((index) => {
            return (
              <Epoch
                {...epochs[index]}
                parentHeight={viewerHeight}
                color={epochs[index]?.type === 'Annotation' ?
                  '#fabb8e' :
                  '#8eecfa'
                }
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
            color={'#d8ffcc'}
          />
        }
      </Group>
    );
  };

  /**
   *
   * @param root0
   * @param root0.viewerWidth
   * @param root0.viewerHeight
   */
  const ChannelAxesLayer = ({viewerWidth, viewerHeight}) => {
    const axisHeight = viewerHeight / numDisplayedChannels;
    return (
      <Group top={-viewerHeight/2} left={-viewerWidth/2}>
        <line y1="0" y2={viewerHeight} stroke="black" />
        {filteredChannels.map((channel, i) => {
          const seriesRange = channelMetadata[channel.index]?.seriesRange;
          if (!seriesRange || !showAxisScaleLines) return null;
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

  /**
   *
   * @param root0
   * @param root0.viewerWidth
   */
  const ChannelsLayer = ({viewerWidth}) => {
    useEffect(() => {
      setViewerWidth(viewerWidth);
    }, [viewerWidth]);

    return (
      <>
        <clipPath
          id={'lineChunk-' + physioFileID}
          clipPathUnits='userSpaceOnUse'
        >
          <rect
            x={-viewerWidth / 2}
            y={-viewerHeight / (2 * numDisplayedChannels)}
            width={viewerWidth}
            height={viewerHeight / numDisplayedChannels}
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
            vec2.fromValues(0, (i * diagonal[1]) / numDisplayedChannels)
          );

          const subBottomRight = vec2.create();
          vec2.add(
            subBottomRight,
            topLeft,
            vec2.fromValues(
              diagonal[0],
              ((i + 1) * diagonal[1]) / numDisplayedChannels
            )
          );

          const subDiagonal = vec2.create();
          vec2.sub(subDiagonal, subBottomRight, subTopLeft);

          const axisEnd = vec2.create();
          vec2.add(axisEnd, subTopLeft, vec2.fromValues(0.1, subDiagonal[1]));

          const seriesRange = channelMetadata[channel.index].seriesRange;
          const scales: [
            ScaleLinear<number, number, never>,
            ScaleLinear<number, number, never>
          ] = [
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
                  physioFileID={physioFileID}
                  isHovered={hoveredChannels.includes(channel.index)}
                />
              ))
            ))
          );
        })}
      </>
    );
  };

  const hardLimit = Math.min(offsetIndex + limit - 1, channelMetadata.length);

  /**
   *
   * @param v
   */
  const onMouseMove = (v : MouseEvent) => {
    if (bounds === null || bounds === undefined) return;
    const x = Math.min(1, Math.max(0, (v.pageX - bounds.left)/bounds.width));
    return (dragContinue)(x);
  };

  /**
   *
   * @param v
   */
  const onMouseUp = (v : MouseEvent) => {
    if (bounds === null || bounds === undefined) return;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    const x = Math.min(100, Math.max(0, (v.pageX - bounds.left)/bounds.width));
    return (dragEnd)(x);
  };

  /**
   *
   * @param e
   */
  const handleChannelChange = (e) => {
    let numChannels = parseInt(e.target.value, 10);
    setNumDisplayedChannels(numChannels);     // This one is the frontend controller
    setDatasetMetadata({limit: numChannels}); // Will trigger re-render to the store
    setOffsetIndex(offsetIndex);  // Will include new channels on limit increase
  };

  /**
   *
   * @param channelIndex
   */
  const onChannelHover = (channelIndex : number) => {
     setHoveredChannels(channelIndex === -1 ? [] : [channelIndex]);
  };


  return (
    <>
      {channels.length > 0 ? (
        <div className='row'>
          <div className={rightPanel ? 'col-md-9' : 'col-xs-12'}>
            <div
              className='col-xs-1'
              style={{
                textAlign: 'center',
                position: 'absolute',
                marginTop: '20px',
              }}
            >
              <h5
                className='col-xs-title'
                style={{
                  marginBottom: '3px',
                }}
              >
                Zoom
              </h5>
              <input
                type='button'
                className='btn btn-primary btn-xs btn-zoom'
                onClick={zoomReset}
                value='Reset'
              />
              <br/>
              <input
                type='button'
                className='btn btn-primary btn-xs btn-zoom'
                onClick={zoomIn}
                value='+'
              />
              <br/>
              <input
                type='button'
                className='btn btn-primary btn-xs btn-zoom'
                onClick={zoomOut}
                value='-'
              />
              <br/>
              <input
                type='button'
                className='btn btn-primary btn-xs btn-zoom'
                onClick={zoomToSelection}
                disabled={!timeSelection}
                value='Region'
              />
            </div>
            <IntervalSelect />
            <div className='row'>
              <div className='col-xs-offset-1 col-xs-11'>
                <div
                  className='row'
                  style={{paddingTop: '15px', paddingBottom: '20px'}}
                >
                  <div
                    className={rightPanel ? 'col-lg-12' : 'col-lg-6'}
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
                            onClick={() => {
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
                            onClick={() => {
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
                      (rightPanel ? '' : 'pull-right-lg col-lg-6')
                      + 'pagination-nav'
                    }
                    style={{
                      padding: '5px 15px',
                    }}
                  >
                    <small style={{marginRight: '10px'}}>
                      Displaying:&nbsp;
                      <select value={numDisplayedChannels} onChange={handleChannelChange}>
                        {CHANNEL_DISPLAY_OPTIONS.map((numChannels) => {
                          return <option value={numChannels}>{numChannels} channels</option>;
                        })};
                      </select>
                      &nbsp;Showing channels&nbsp;
                      <input
                        type='number'
                        style={{width: '55px'}}
                        value={offsetIndex}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          !isNaN(value) && setOffsetIndex(value);
                        }}
                      />
                      &nbsp;
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
                  paddingRight: '0px',
                }}
              >{/* Below slice changes labels to be subset of channel choice */}
                {filteredChannels.slice(0, numDisplayedChannels).map((channel) => (
                  <div
                    key={channel.index}
                    style={{
                      display: 'flex',
                      height: 1 / numDisplayedChannels * 100 + '%',
                      alignItems: 'center',
                      cursor: 'default',
                      color: `${hoveredChannels.includes(channel.index)
                        ? colorOrder(channel.index.toString())
                        : '#333'}`,
                    }}
                    onMouseEnter={() => onChannelHover(channel.index)}
                    onMouseLeave={() => onChannelHover(-1)}
                  >
                    {channelMetadata[channel.index] &&
                    channelMetadata[channel.index].name}
                  </div>
                ))}
              </div>
              <div
                className='col-xs-11'
                style={{
                  paddingLeft: '5px',
                }}
                onMouseLeave={() => setCursor(null)}
              >
                <div style={{position: 'relative'}}>
                  {showAxisScaleLines
                    ? <div
                      style={{
                        fontSize: 10,
                        left: '-25px',
                        position: 'absolute',
                      }}
                    >
                      ({SIGNAL_UNIT})
                    </div>
                    : null
                  }
                  <div
                    style={{
                      fontSize: 10,
                      bottom: '-35px',
                      right: 0,
                      position: 'absolute',
                    }}
                  >
                    Time (s)
                  </div>
                  <SeriesCursor
                    cursorRef={cursorRef}
                    channels={channels}
                    interval={interval}
                    enabled={cursorEnabled}
                    hoveredChannels={hoveredChannels}
                    channelMetadata={channelMetadata}
                  />
                  <div style={{height: viewerHeight}} ref={getBounds}>
                    <ResponsiveViewer
                      ref={viewerRef}
                      // @ts-ignore
                      mouseMove={useCallback((cursor: [number, number]) => {
                        setCursor({
                          cursorPosition: [cursor[0], cursor[1]],
                          viewerRef: viewerRef
                        });
                      }, [])}
                      mouseDown={useCallback((v: Vector2) => {
                        document.addEventListener('mousemove', onMouseMove);
                        document.addEventListener('mouseup', onMouseUp);
                        R.compose(dragStart, R.nth(0))(v);
                      }, [bounds])}
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
                {
                  [...Array(epochs.length).keys()].filter((i) =>
                    epochs[i].type === 'Event'
                  ).length > 0 &&
                  <button
                    className={
                      'btn btn-primary'
                      + (rightPanel === 'eventList' ? ' active' : '')
                    }
                    onClick={() => {
                      rightPanel === 'eventList'
                        ? setRightPanel(null)
                        : setRightPanel('eventList');
                    }}
                  >
                    {rightPanel === 'eventList'
                      ? 'Hide Event Panel'
                      : 'Show Event Panel'
                    }
                  </button>
                }
                {
                  [...Array(epochs.length).keys()].filter((i) =>
                    epochs[i].type === 'Annotation'
                  ).length > 0 &&
                  <button
                    className={
                      'btn btn-primary'
                      + (rightPanel === 'annotationList' ? ' active' : '')
                    }
                    onClick={() => {
                      rightPanel === 'annotationList'
                        ? setRightPanel(null)
                        : setRightPanel('annotationList');
                    }}
                  >
                    {rightPanel === 'annotationList'
                      ? 'Hide Annotation Panel'
                      : 'Show Annotation Panel'
                    }
                  </button>
                }
                {
                  <button
                    className={'btn btn-primary'
                      + (rightPanel === 'annotationForm' ? ' active' : '')
                    }
                    onClick={() => {
                      rightPanel === 'annotationForm'
                        ? setRightPanel(null)
                        : setRightPanel('annotationForm');
                      setCurrentAnnotation(null);
                    }}
                  >
                    {rightPanel === 'annotationForm'
                      ? 'Close Annotation Form'
                      : 'Add Annotation'
                    }
                  </button>
                }

                <div
                  className='pull-right col-xs-4'
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    paddingRight: 0,
                  }}
                >
                  {[...Array(epochs.length).keys()].filter((i) =>
                      epochs[i].onset + epochs[i].duration > interval[0]
                      && epochs[i].onset < interval[1]
                      && (
                        (epochs[i].type === 'Event'
                         && rightPanel === 'eventList')
                        ||
                        (epochs[i].type === 'Annotation'
                         && rightPanel === 'annotationList')
                      )
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
              {rightPanel === 'annotationForm' &&
                <AnnotationForm
                  physioFileID={physioFileID}
                  annotationMetadata={annotationMetadata}
                />
              }
              {rightPanel === 'eventList' && <EventManager />}
              {rightPanel === 'annotationList' && <EventManager />}
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
    rightPanel: state.rightPanel,
    timeSelection: state.timeSelection,
    channels: state.channels,
    epochs: state.dataset.epochs,
    filteredEpochs: state.dataset.filteredEpochs,
    activeEpoch: state.dataset.activeEpoch,
    hidden: state.montage.hidden,
    channelMetadata: state.dataset.channelMetadata,
    offsetIndex: state.dataset.offsetIndex,
    limit: state.dataset.limit,
    domain: state.bounds.domain,
    physioFileID: state.dataset.physioFileID,
    hoveredChannels: state.cursor.hoveredChannels
  }),
  (dispatch: (_: any) => void) => ({
    setOffsetIndex: R.compose(
      dispatch,
      setOffsetIndex
    ),
    setInterval: R.compose(
      dispatch,
      setInterval
    ),
    setCursor: R.compose(
      dispatch,
      setCursorInteraction
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
    setDatasetMetadata: R.compose(
      dispatch,
      setDatasetMetadata
    ),
    setCurrentAnnotation: R.compose(
      dispatch,
      setCurrentAnnotation
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
    setHoveredChannels: R.compose(
      dispatch,
      setHoveredChannels
    ),
  })
)(SeriesRenderer);
