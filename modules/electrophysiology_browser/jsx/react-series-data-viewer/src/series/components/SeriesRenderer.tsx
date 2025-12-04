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
import swal from 'sweetalert2';
import {Group} from '@visx/group';
import {connect} from 'react-redux';
import {scaleLinear, ScaleLinear} from 'd3-scale';
import {colorOrder} from '../../color';
import {
  MAX_RENDERED_EPOCHS,
  DEFAULT_MAX_CHANNELS,
  CHANNEL_DISPLAY_OPTIONS,
  SIGNAL_UNIT,
  Vector2,
  DEFAULT_TIME_INTERVAL,
  STATIC_SERIES_RANGE,
  DEFAULT_VIEWER_HEIGHT,
  MIN_EPOCH_WIDTH,
} from '../../vector';
import ResponsiveViewer from './ResponsiveViewer';
import Axis from './Axis';
import LineChunk from './LineChunk';
import Epoch from './Epoch';
import SeriesCursor from './SeriesCursor';
import LoadingBar from './LoadingBar';
import {setRightPanel} from '../store/state/rightPanel';
import {setDatasetMetadata} from '../store/state/dataset';
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
  RightPanel, EpochFilter,
} from '../store/types';
import {setCurrentAnnotation} from '../store/state/currentAnnotation';
import {setCursorInteraction} from '../store/logic/cursorInteraction';
import {setHoveredChannels} from '../store/state/cursor';
import {getEpochsInRange, updateActiveEpoch} from '../store/logic/filterEpochs';
import HEDEndorsement from "./HEDEndorsement";
import {setTimeSelection} from "../store/state/timeSelection";
import {useTranslation} from "react-i18next";

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
  setRightPanel: (_: RightPanel | void) => void,
  chunksURL: string,
  channels: Channel[],
  channelMetadata: ChannelMetadata[],
  hidden: number[],
  epochs: EpochType[],
  filteredEpochs: EpochFilter,
  activeEpoch: number,
  offsetIndex: number,
  setOffsetIndex: (_: number) => void,
  setAmplitudesScale: (_: number) => void,
  resetAmplitudesScale: (_: void) => void,
  setLowPassFilter: (_: string) => void,
  setHighPassFilter: (_: string) => void,
  setViewerWidth: (_: number) => void,
  setViewerHeight: (_: number) => void,
  setDatasetMetadata: (_: { limit: number }) => void,
  dragStart: (_: number) => void,
  dragContinue: (_: number) => void,
  dragEnd: (_: number) => void,
  limit: number,
  loadedChannels: number,
  setInterval: (_: [number, number]) => void,
  setCurrentAnnotation: (_: EpochType) => void,
  physioFileID: number,
  hoveredChannels: number[],
  setHoveredChannels:  (_: number[]) => void,
  updateActiveEpoch: (_: number) => void,
  setTimeSelection: (_: [number, number]) => void,
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
 * @param root0.chunksURL
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
 * @param root0.setDatasetMetadata
 * @param root0.dragStart
 * @param root0.dragContinue
 * @param root0.dragEnd
 * @param root0.limit
 * @param root0.loadedChannels
 * @param root0.setCurrentAnnotation
 * @param root0.physioFileID
 * @param root0.hoveredChannels
 * @param root0.setHoveredChannels
 * @param root0.updateActiveEpoch
 * @param root0.setTimeSelection
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
  chunksURL,
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
  setDatasetMetadata,
  dragStart,
  dragContinue,
  dragEnd,
  limit,
  loadedChannels,
  setCurrentAnnotation,
  physioFileID,
  hoveredChannels,
  setHoveredChannels,
  updateActiveEpoch,
  setTimeSelection,
}) => {
    const [
        numDisplayedChannels,
        setNumDisplayedChannels,
    ] = useState<number>(DEFAULT_MAX_CHANNELS);
    const [cursorEnabled, setCursorEnabled] = useState(false);
    const toggleCursor = () => setCursorEnabled((value) => !value);
    const [DCOffsetView, setDCOffsetView] = useState(true);
    const toggleDCOffsetView = () => setDCOffsetView((value) => !value);
    const [stackedView, setStackedView] = useState(false);
    const toggleStackedView = () => setStackedView((value) => !value);
    const [singleMode, setSingleMode] = useState(false);
    const toggleSingleMode = () => setSingleMode((value) => !value);
    const [showOverflow, setShowOverflow] = useState(false);
    const toggleShowOverflow = () => setShowOverflow((value) => !value);
    const [highPass, setHighPass] = useState('none');
    const [lowPass, setLowPass] = useState('none');
    const [refNode, setRefNode] = useState<HTMLDivElement>(null);
    const [bounds, setBounds] = useState<ClientRect>(null);
    const getBounds = useCallback((domNode) => {
        if (domNode) {
            setRefNode(domNode);
        }
    }, []);
    const [loadingBarVisibility, setLoadingBarVisibility] = useState(false);

    const [panelIsDirty, setPanelIsDirty] = useState(false);
    const [eventChannels, setEventChannels] = useState([]);
    const {t} = useTranslation();

    window.onbeforeunload = function() {
      if (panelIsDirty) {
        return t(
          'Are you sure you want to leave unsaved changes behind?',
          {ns: 'loris'}
        );
      }
    }
    const [pressedKey, setPressedKey] = useState('');

    const intervalChange = Math.pow(
    10,
    Math.max(
      Math.floor(Math.log10(interval[1] - interval[0])) - 1,
      -1
    )
  ); // Scale to interval size

  /**
   *
   */
  const zoomIn = () => {
    const currentInterval = interval[1] - interval[0];
    let zoomInterval = intervalChange;

    if (currentInterval < 2 * intervalChange) {
      zoomInterval = 0;
    } else if (currentInterval === 2 * intervalChange) {
      zoomInterval /= 2;
    }

    setInterval([interval[0] + zoomInterval, interval[1] - zoomInterval]);
  };

  /**
   *
   */
  const zoomOut = () => {
    setInterval([interval[0] - intervalChange, interval[1] + intervalChange]);
  };

  /**
   *
   */
  const zoomReset = () => {
    const defaultInterval = DEFAULT_TIME_INTERVAL[1] - DEFAULT_TIME_INTERVAL[0];
    const currentMidpoint = (interval[0] + interval[1]) / 2;
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
      Math.min(upperBound, domain[1]),
    ]);
  };

  const selectionCanBeZoomedTo = timeSelection &&
    Math.abs(timeSelection[1] - timeSelection[0]) >= 0.1;

  /**
   *
   */
  const zoomToSelection = () => {
    if (selectionCanBeZoomedTo) {
      setInterval([
        Math.min(timeSelection[0], timeSelection[1]),
        Math.max(timeSelection[0], timeSelection[1]),
      ]);
    }
  };

  const confirmPanelClose = (callbackFn) => {
    if (panelIsDirty) {
      return swal.fire({
        title: t('Are you sure?', {ns: 'loris'}),
        text: t(
          'Leaving the form will result in the loss of any information entered.',
          {ns: 'loris'}
        ),
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: t('Proceed', {ns: 'loris'}),
        cancelButtonText: t('Cancel', {ns: 'loris'}),
      }).then((result) => {
        if (result.value) {
          callbackFn();
          setPanelIsDirty(false);
          updateActiveEpoch(null);
          return true;
        } else {
          return false;
        }
      });
    }
    callbackFn();
    updateActiveEpoch(null);
    return true;
  }

  const viewerRef = useRef(null);
  const cursorRef = useRef(null);

  useEffect(() => { // Keypress handler
    /**
     *
     * @param e
     */
    const keydownHandler = (e) => {
      const hedSearchIsFocus = document.activeElement.id === 'hed-search';
      if ([
        'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyI', 'KeyJ', 'KeyK'
      ].indexOf(e.code) > -1) {
        if (!hedSearchIsFocus) {
          if (rightPanel && e.shiftKey) {
            e.preventDefault(); // Make sure arrows don't scroll
            // Interact with RightPanel
            setPressedKey(e.code);
          } else if (cursorRef.current && !e.shiftKey) { // Cursor is on plot / focus
            e.preventDefault(); // Make sure arrows don't scroll
            // Interact with SeriesRenderer
            const intervalSize = interval[1] - interval[0];
            switch (e.code) {
              case 'ArrowUp':
                setOffsetIndex(offsetIndex - limit);
                break;
              case 'ArrowDown':
                setOffsetIndex(offsetIndex + limit);
                break;
              case 'ArrowRight':
                setInterval([
                  Math.min(
                    Math.ceil(domain[1]) - intervalSize,
                    interval[0] + intervalSize
                  ),
                  Math.min(Math.ceil(domain[1]), interval[1] + intervalSize),
                ]);
                break;
              case 'ArrowLeft':
                setInterval([
                  Math.max(Math.floor(domain[0]), interval[0] - intervalSize),
                  Math.max(
                    Math.floor(domain[0]) + intervalSize,
                    interval[1] - intervalSize
                  ),
                ]);
                break;
            }
          }
        }
      }

      if (rightPanel && e.ctrlKey) {
        if ([
          'KeyC', 'KeyE', 'KeyM', 'Enter',
        ].indexOf(e.code) > -1) {
          setPressedKey(e.code);
        }
      }

      if (cursorRef.current && e.shiftKey) {
        switch (e.code) {
          case 'KeyV':
            toggleCursor();
            break;
          case 'KeyB':
            toggleStackedView();
            break;
          case 'KeyS':
            if (stackedView) {
              toggleSingleMode();
            }
            break;
          // case 'KeyC':
          //   confirmPanelClose(() => {
          //     setRightPanel(null);
          //   });
          //   break;
          case 'KeyA':
            setRightPanel('annotationForm');
            break;
          case 'KeyE':
            setRightPanel('eventList');
            break;
          case 'KeyH':
            setRightPanel('hedEndorsement');
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
          case 'KeyN': // Lower amplitude scale
            setAmplitudesScale(1.1);
            break;
          case 'KeyM': // Increase amplitude scale
            setAmplitudesScale(0.9);
            break;
        }
      }
    };

    window.addEventListener('keydown', keydownHandler);
    return function cleanUp() { // Prevent multiple listeners
      window.removeEventListener('keydown', keydownHandler);
    };
  }, [
    offsetIndex, interval, limit, timeSelection, amplitudeScale, stackedView
  ]);

  useEffect(() => { // Keyup handler
    const keyupHandler = (e) => {
      if ([
        'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
      ].indexOf(e.code) > -1) {
        setPressedKey('');
      }
    }
    window.addEventListener('keyup', keyupHandler);
    return function cleanUp() { // Prevent multiple listeners
      window.removeEventListener('keyup', keyupHandler);
    };
  }, []);

  useEffect(() => {
    setEventChannels(
      activeEpoch !== null
        ? epochs[activeEpoch]?.channels ?? []
        : []
    );
  }, [activeEpoch]);

  const firstRender = useRef(true);
  useEffect(() => {
    if (rightPanel !== 'annotationForm') {
      if (!firstRender.current) {
        updateActiveEpoch(null);
      } else {
        firstRender.current = false;
      }
      setEventChannels([]);
      setTimeSelection(null);
    }
  }, [rightPanel]);

  useEffect(() => {
    setViewerHeight(viewerHeight);
  }, [viewerHeight]);

  useEffect(() => {
    if (refNode) {
      setBounds(refNode.getBoundingClientRect());
    }
  }, [viewerWidth]);

  const prevHoveredChannels = useRef([]);
  const defaultLineColor = '#999';

  /**
   *
   * @param channelIndex
   * @param colored
   */
  const setLineColor = (channelIndex: number, colored: boolean) => {
    const classString = `.visx-linepath.channel-${channelIndex}`;
    document.querySelectorAll(classString).forEach((line) => {
      line.setAttribute(
        'stroke',
        colored || stackedView
          ? colorOrder(channelIndex.toString()).toString()
          : defaultLineColor
      );

      line.setAttribute(
        'stroke-width',
        colored && (!singleMode || cursorRef.current)
          ? '2'
          : '1'
      );
    });
  };

  useEffect(() => {
    hoveredChannels.forEach((channelIndex) => {
      if (prevHoveredChannels.current.includes(channelIndex)) {
        return;
      }
      setLineColor(channelIndex, true);
    });

    prevHoveredChannels.current.forEach((prevChannelIndex) => {
      if (!hoveredChannels.includes(prevChannelIndex)) {
        setLineColor(prevChannelIndex, false);
      }
    });

    prevHoveredChannels.current = hoveredChannels;
  }, [hoveredChannels]);

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
  const showAxisScaleLines = false; // Visibility state of y-axis scale lines

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
            top={0.5}
            domain={interval}
            range={[0, viewerWidth]}
            orientation='bottom'
            hideLine={true}
          />
        </Group>
        <Group top={viewerHeight/2} left={-viewerWidth/2}>
          <Axis
            top={-0.5}
            domain={interval}
            range={[0, viewerWidth]}
            orientation='top'
          />
        </Group>
      </>
    );
  };

  const EpochsLayer = () => {
    const visibleEpochs = rightPanel ? getEpochsInRange(epochs, interval) : [];
    const minEpochWidth = (interval[1] - interval[0]) * MIN_EPOCH_WIDTH / DEFAULT_TIME_INTERVAL[1];

    return (
      <Group>
        {
         visibleEpochs.length < MAX_RENDERED_EPOCHS &&
          visibleEpochs.sort((a, b) => {
              return epochs[a]?.channels.length === 0
                ? -1
                : 1;
            }).map((index) => {
            return filteredEpochs.plotVisibility.includes(index) &&
              filteredEpochs.searchVisibility.includes(index) &&  (
              <Epoch
                key={`epoch-${index}`}
                {...epochs[index]}
                parentHeight={viewerHeight}
                color={
                  epochs[index]?.channels &&
                  epochs[index]?.channels.length > 0
                    ? '#7ef1de'
                    : '#a6d5f2'
                }
                scales={scales}
                opacity={0.7}
                minWidth={minEpochWidth}
                epochChannels={epochs[index]?.channels}
              />
            );
          })
        }
        {timeSelection && activeEpoch === null &&
          <Epoch
            key={`epoch-${activeEpoch}`}
            onset={Math.min(timeSelection[0], timeSelection[1])}
            duration={Math.abs(timeSelection[1] - timeSelection[0])}
            color={'#ff9585'}
            parentHeight={viewerHeight}
            scales={scales}
            opacity={0.7}
            epochChannels={
              activeEpoch
                ? epochs[activeEpoch]?.channels ?? []
                : eventChannels
            }
          />
        }
        {activeEpoch !== null &&
          <Epoch
            key={`epoch-${activeEpoch}`}
            {...epochs[activeEpoch]}
            parentHeight={viewerHeight}
            scales={scales}
            color={'#fff9d6'}
            minWidth={minEpochWidth}
            epochChannels={eventChannels}
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

    const channelList: Channel[] = (
      !cursorRef.current && stackedView &&
      singleMode && hoveredChannels.length > 0
    )
      ? filteredChannels.filter(
        (channel) => hoveredChannels.includes(channel.index)
      )
      : filteredChannels;

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

        {
          channelList.map((channel, i) => {
          if (!channelMetadata[channel.index]) {
            return null;
          }
          const subTopLeft = vec2.create();
          vec2.add(
            subTopLeft,
            topLeft,
            vec2.fromValues(
              0,
              stackedView && !singleMode
                ? (numDisplayedChannels - 2) *
                  diagonal[1] / (2 * numDisplayedChannels)
                : (i * diagonal[1]) / numDisplayedChannels
            )
          );

          const subBottomRight = vec2.create();
          vec2.add(
            subBottomRight,
            topLeft,
            vec2.fromValues(
              diagonal[0],
              stackedView && !singleMode
                ? (numDisplayedChannels + 2) *
                  diagonal[1] / (2 * numDisplayedChannels)
                : ((i + 1) * diagonal[1]) / numDisplayedChannels
            )
          );

          const subDiagonal = vec2.create();
          vec2.sub(subDiagonal, subBottomRight, subTopLeft);

          const axisEnd = vec2.create();
          vec2.add(axisEnd, subTopLeft, vec2.fromValues(0.1, subDiagonal[1]));

          return (
            channel.traces.map((trace, j) => {
              const numChunks = trace.chunks.filter(
                (chunk) => chunk.values.length > 0
              ).length;

              const valuesInView = trace.chunks.map((chunk) => {
                let includedIndices = [0, chunk.values.length];
                if (chunk.interval[0] < interval[0]) {
                  const startIndex = chunk.values.length *
                    (interval[0] - chunk.interval[0]) /
                    (chunk.interval[1] - chunk.interval[0]);
                  includedIndices = [startIndex, includedIndices[1]];
                }
                if (chunk.interval[1] > interval[1]) {
                  const endIndex = chunk.values.length *
                    (interval[1] - chunk.interval[0]) /
                    (chunk.interval[1] - chunk.interval[0]);
                  includedIndices = [includedIndices[0], endIndex];
                }
                return chunk.values.slice(
                  includedIndices[0], includedIndices[1]
                );
              }).flat();

              if (valuesInView.length === 0) {
                return;
              }

              const seriesRange: [number, number] = STATIC_SERIES_RANGE;

              const scales: [
                ScaleLinear<number, number, never>,
                ScaleLinear<number, number, never>
              ] = [
                scaleLinear()
                  .domain(interval)
                  .range([subTopLeft[0], subBottomRight[0]]),
                scaleLinear()
                  .domain(seriesRange)
                  .range(
                    stackedView
                      ? [
                        -viewerHeight / (2 * numDisplayedChannels),
                        viewerHeight / (2 * numDisplayedChannels),
                      ]
                      : [subTopLeft[1], subBottomRight[1]]
                  ),
              ];

              const scaleByAmplitude = scaleLinear()
                .domain(seriesRange.map((x) => x * amplitudeScale))
                .range([-0.5, 0.5]);

              /**
               *
               * @param values
               */
              const getScaledMean = (values) => {
                let numValues = values.length;
                return values.reduce((a, b) => {
                    if (isNaN(b)) {
                      numValues--;
                      return a;
                    }
                  return a + scaleByAmplitude(b);
                }, 0) / numValues;
              };

              const DCOffset = DCOffsetView
                ? getScaledMean(valuesInView)
                : 0;

              return (
                trace.chunks.map((chunk, k, chunks) => (
                    <LineChunk
                      channelIndex={channel.index}
                      traceIndex={j}
                      chunkIndex={k}
                      key={`${channel.index}-${k}-${trace.chunks.length}`}
                      chunk={chunk}
                      seriesRange={seriesRange}
                      amplitudeScale={amplitudeScale}
                      scales={scales}
                      physioFileID={physioFileID}
                      isHovered={hoveredChannels.includes(channel.index)}
                      isStacked={stackedView}
                      withDCOffset={DCOffset}
                      numChannels={numDisplayedChannels}
                      numChunks={numChunks}
                      previousPoint={
                        k === 0
                          ? null
                          : chunks[k - 1].values.slice(-1)[0]
                      }
                    />
                ))
              );
            })
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
    const x = Math.min(
      1,
      Math.max(0, (v.pageX - bounds.left)/bounds.width)
    );
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
    const numChannels = parseInt(e.target.value, 10);
    setNumDisplayedChannels(numChannels); // This one is the frontend controller
    setDatasetMetadata({limit: numChannels}); // Will trigger re-render to the store
    setOffsetIndex(offsetIndex); // Will include new channels on limit increase
    setViewerHeight(
      numChannels > 4
        ? DEFAULT_VIEWER_HEIGHT
        : DEFAULT_VIEWER_HEIGHT * 0.8
    );
  };

  /**
   *
   * @param channelIndex
   */
  const onChannelClick = (channelIndex : number) => {
    if (rightPanel !== 'annotationForm') {
      return;
    }

    if (channelMetadata[channelIndex]) {
      const channelName = channelMetadata[channelIndex].name;
      if (eventChannels.includes(channelName)) {
        setEventChannels(
          eventChannels.filter((channel) => {
            return channel !== channelName;
          })
        );
      } else {
        setEventChannels([
          ...eventChannels,
          channelName
        ]);
      }
    }
  }

  /**
   *
   * @param channelIndex
   */
  const onChannelHover = (channelIndex : number) => {
    setHoveredChannels(channelIndex === -1 ? [] : [channelIndex]);
  };

  const flushWidth = (progressBarRef) => {
    progressBarRef.style.width; // Force flush
    setTimeout(
      () => {
        // Reset to original transition
        progressBarRef.style.transition = 'width 1s linear';
        setLoadingBarVisibility(true);
      }, 50
    );
  }

  const setProgressBarWidth = (width) => {
    setLoadingBarVisibility(false);
    const progressBarRef = document.querySelector<HTMLElement>('#chunk-progress-bar');
    if (!progressBarRef) return;
    progressBarRef.style.transition = '';
    progressBarRef.style.width = width;
    flushWidth(progressBarRef);
  }

  useEffect(() => {
    if (loadedChannels < limit) {
      const progressBarRef = document.querySelector<HTMLElement>('#chunk-progress-bar');
      if (progressBarRef && progressBarRef.style.width === '0%') {
        setProgressBarWidth('0%');
      } else if (!loadingBarVisibility) {
        setProgressBarWidth(`${100 * loadedChannels / limit}%`);
      }
    }
  }, [loadedChannels]);


  useEffect(() => {
    if (loadedChannels < limit) {
      setProgressBarWidth(`${100 * loadedChannels / limit}%`);
    }
  }, [limit]);

  const MenuOption = {
    'MANAGE_EVENTS': 'Events',
    'HED_ENDORSEMENT': 'HED Endorsements',
  }

  return (
    <>
{/*      {channels.length > 0 ? (*/}
        <>
        <div
          className='row'
          style={{
            width: rightPanel ? '72.5%' : '96.5%',
            position: 'absolute',
            zIndex: 3,
          }}
        >
          <div id="right-panel-controls">
            <button
              className={'btn btn-primary'}
              disabled={!chunksURL || !chunksURL[0].includes('Face13') || rightPanel === 'annotationForm'}
              onClick={() => {
                confirmPanelClose(() => {
                  setRightPanel('annotationForm')
                  setCurrentAnnotation(null);
                });
              }}
            >
              {t('Add Event', {ns: 'electrophysiology_browser'})}
            </button>
            {
              rightPanel === null && (
                <button
                  className={
                    'btn btn-primary btn-blue'
                    + (rightPanel ? ' active' : '')
                  }
                  onClick={() => {
                    confirmPanelClose(() => {
                      setRightPanel(
                        rightPanel
                          ? null
                          : 'eventList'
                      );
                    })
                  }}
                >
                  {rightPanel
                    ? t('Close Panel', {ns: 'electrophysiology_browser'})
                    : t('Display Events', {ns: 'electrophysiology_browser'})
                  }
                </button>
              )
            }
          </div>
        </div>
        <div className={'row'}>
          <div className={rightPanel ? 'col-md-9' : 'col-xs-12'}>
            <div
              className='col-xs-1'
              style={{
                textAlign: 'center',
                position: 'absolute',
                marginTop: '20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: rightPanel ? 'unset' : 'center',
                }}
              >
                <h5 className='col-xs-title btn-zoom'>
                  {t('Zoom', {ns: 'electrophysiology_browser'})}
                </h5>
                <div>
                  <input
                    type='button'
                    className='btn btn-primary btn-xs btn-zoom'
                    onClick={zoomReset}
                    disabled={
                      (interval[1] - interval[0]) ===
                      (DEFAULT_TIME_INTERVAL[1] - DEFAULT_TIME_INTERVAL[0])
                    }
                    value={t('Reset', {ns: 'loris'})}
                  />
                  <br/>
                  <input
                    type='button'
                    className='btn btn-primary btn-xs btn-zoom'
                    onClick={zoomIn}
                    disabled={(interval[1] - interval[0]) <= 0.1}
                    value='+'
                  />
                  <br/>
                  <input
                    type='button'
                    className='btn btn-primary btn-xs btn-zoom'
                    onClick={zoomOut}
                    disabled={
                      interval[0] === domain[0] &&
                      interval[1] === domain[1]
                    }
                    value='-'
                  />
                  <br/>
                  <input
                    type='button'
                    className='btn btn-primary btn-xs btn-zoom'
                    onClick={zoomToSelection}
                    disabled={!selectionCanBeZoomedTo}
                    value={t('Fit to Window', {ns: 'electrophysiology_browser'})}
                  />
                </div>
              </div>
            </div>
            <IntervalSelect />
            <div className='row'>
              <div
                className='col-xs-offset-1 col-xs-11'
                style={{zIndex: '1'}}
              >
                <div
                  className='row'
                  style={{
                    paddingTop: '15px',
                  }}
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
                        style={{width: '20px'}}
                        className='btn btn-primary btn-xs'
                        onClick={() => setAmplitudesScale(1.1)}
                        value='-'
                      />
                      <input
                        type='button'
                        className='btn btn-primary btn-xs'
                        onClick={() => resetAmplitudesScale()}
                        value={t('Reset Amplitude', {ns: 'electrophysiology_browser'})}
                      />
                      <input
                        type='button'
                        style={{width: '20px'}}
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
                        {t(
                          HIGH_PASS_FILTERS[highPass].label, {
                            ns: 'electrophysiology_browser',
                            frequency: HIGH_PASS_FILTERS[highPass].frequency,
                          }
                        )}
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
                          >{t(
                            HIGH_PASS_FILTERS[key].label, {
                              ns: 'electrophysiology_browser',
                              frequency: HIGH_PASS_FILTERS[key].frequency,
                            }
                          )}</li>
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
                        {t(
                          LOW_PASS_FILTERS[lowPass].label, {
                            ns: 'electrophysiology_browser',
                            frequency: LOW_PASS_FILTERS[lowPass].frequency,
                          }
                        )}
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
                          >{t(
                            LOW_PASS_FILTERS[key].label, {
                              ns: 'electrophysiology_browser',
                              frequency: LOW_PASS_FILTERS[key].frequency,
                            }
                          )}</li>
                        )}
                      </ul>
                    </div>
                    <input
                      type='button'
                      className='btn btn-primary btn-xs'
                      onClick={toggleShowOverflow}
                      value={t(
                        showOverflow
                          ? 'Hide Overflow'
                          : 'Show Overflow',
                        {ns: 'electrophysiology_browser'}
                      )}
                    />
                  </div>

                  <div
                    className={
                      (rightPanel ? '' : 'pull-right-lg col-lg-5 ')
                      + 'pagination-nav'
                    }
                    style={{
                      padding: '5px 15px',
                    }}
                  >
                    <small style={{marginRight: '3px',}}>
                      {t('Displaying:', {
                        ns: 'electrophysiology_browser',
                      })}&nbsp;
                      <select
                        value={numDisplayedChannels}
                        onChange={handleChannelChange}
                      >
                        {CHANNEL_DISPLAY_OPTIONS.map((numChannels) => {
                          return <option
                            key={`${numChannels}`}
                            value={numChannels}
                          >
                            {t('{{numChannels}} channels', {
                              ns: 'electrophysiology_browser',
                              numChannels: numChannels,
                              count: numChannels,
                            })}
                          </option>;
                        })};
                      </select>
                      &nbsp;
                      {t('Showing:', {ns: 'electrophysiology_browser'})}
                      &nbsp;
                      <input
                        type='number'
                        style={{width: '45px'}}
                        value={offsetIndex}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          !isNaN(value) && setOffsetIndex(value);
                        }}
                      />
                      &nbsp;
                      {t('to {{channelsInView}} of {{totalChannels}}', {
                        ns: 'electrophysiology_browser',
                        channelsInView: hardLimit,
                        totalChannels: channelMetadata.length
                      })}
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
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                visibility: loadingBarVisibility ? 'visible' : 'hidden',
              }}>
                <LoadingBar
                  progress={
                      100 * loadedChannels / Math.min(channels.length, limit)
                  }
                  wrapperStyle={{
                    marginLeft: 'calc(100% / 12 - 10px)',
                    textAlign: 'center',
                    width: 'calc(1100% / 12 - 15px)',
                  }}
                  onTransitionEnd={(e) => {
                    if (e.propertyName === 'width') {
                      setTimeout(() => {
                        setLoadingBarVisibility(false);
                      }, 500);
                    }
                  }}
                />
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
                  userSelect: 'none',
                }}
              >{/* Below slice changes labels to be subset of channel choice */}
                {filteredChannels
                  .slice(0, numDisplayedChannels)
                  .map((channel) => (
                  <div
                    key={channel.index}
                    style={{
                      display: 'flex',
                      height: 1 / numDisplayedChannels * 100 + '%',
                      alignItems: 'center',
                      cursor: 'default',
                      color: `${stackedView ||
                        hoveredChannels.includes(channel.index)
                        ? colorOrder(channel.index.toString())
                        : '#333'}`,
                      fontWeight: `${stackedView &&
                        hoveredChannels.includes(channel.index)
                        ? 'bold'
                        : 'normal'}`,
                      background:
                        (
                          channelMetadata[channel.index] &&
                          eventChannels.includes(channelMetadata[channel.index].name)
                        )
                          ? (activeEpoch === null && rightPanel === 'annotationForm')
                            ? '#ff9585'
                            : '#fff9d6'
                          : 'unset',
                    }}
                    onMouseEnter={() => onChannelHover(channel.index)}
                    onMouseLeave={() => onChannelHover(-1)}
                    onClick={() => onChannelClick(channel.index)}
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
                    {t('Time (s)', {ns: 'electrophysiology_browser'})}
                  </div>
                  <SeriesCursor
                    cursorRef={cursorRef}
                    channels={channels}
                    interval={interval}
                    enabled={cursorEnabled}
                    hoveredChannels={hoveredChannels}
                    channelMetadata={channelMetadata}
                    showEvents={rightPanel === 'eventList'}
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
                      showOverflow={showOverflow}
                      chunksURL={chunksURL}
                      cssClass={''}
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
              <div
                className='col-xs-1'
                style={{
                  textAlign: 'center',
                  position: 'absolute',
                  bottom: '-38px',
                }}
              >
                <input
                  type='button'
                  className='btn btn-primary btn-xs'
                  style={{
                    width: '80px',
                    marginTop: '3px',
                    textOverflow: 'ellipsis',
                  }}
                  onClick={toggleDCOffsetView}
                  value={`${DCOffsetView ? 'No' : 'DC'} Offset`}
                />
                <br/>
                <input
                  type='button'
                  className='btn btn-primary btn-xs'
                  style={{
                    width: '80px',
                    marginTop: '3px',
                    textOverflow: 'ellipsis',
                  }}
                  onClick={toggleStackedView}
                  value={t(
                    stackedView ? 'Spread' : 'Stack',{
                      ns: 'electrophysiology_browser',
                    }
                  )}
                />
                <br/>
                <input
                  type='button'
                  className='btn btn-primary btn-xs'
                  style={{
                    width: '65px',
                    marginTop: '3px',
                    visibility: stackedView ? 'visible' : 'hidden',
                  }}
                  onClick={toggleSingleMode}
                  value={t(
                    singleMode ? 'Standard' : 'Isolate',{
                      ns: 'electrophysiology_browser'
                    }
                  )}
                />
              </div>
            </div>
          </div>
          {rightPanel &&
            <div className='col-md-3'>
              <div
                style={{
                  display: rightPanel ? 'flex' : 'none',
                  color: '#064785',
                  borderColor: '#C3D5DB',
                }}
              >
                <ul
                  className="nav nav-tabs"
                  role="tablist"
                  style={{
                    marginLeft: 0,
                    marginBottom: '-1px',
                    borderBottomColor: '#C3D5DB',
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
                  {
                    Object.keys(MenuOption).map((menuOption, i) => {
                      const isActiveMenuOption =
                        (['eventList', 'annotationForm'].includes(rightPanel) && menuOption == 'MANAGE_EVENTS') ||
                        (rightPanel === 'hedEndorsement' && menuOption == 'HED_ENDORSEMENT')
                      return (
                        <li
                          key={`event-tab-${i}`}
                          role="presentation"
                          className={'event-tab' + (isActiveMenuOption ? ' active' : '')}
                          onClick={async (e) => {
                            if (!(await confirmPanelClose(() => {
                              switch (menuOption) {
                                case 'MANAGE_EVENTS':
                                  setRightPanel('eventList');
                                  break;
                                case 'HED_ENDORSEMENT':
                                  setTimeSelection(null);
                                  setRightPanel('hedEndorsement');
                                  break;
                              }
                            }))) {
                              e.stopPropagation();
                            }
                          }}
                        >
                          <a
                            style={{
                              backgroundColor: 'rgb(228, 235, 242)',
                              border: '1px solid #C3D5DB',
                              borderBottomColor: isActiveMenuOption ? 'rgb(228, 235, 242)' : '#C3D5DB',
                              fontWeight: isActiveMenuOption ? 'bold' : 'normal',
                              padding: '10px 0',
                              textAlign: 'center',
                            }}
                            href={'#'}
                            role="tab"
                            data-toggle="tab"
                            onClick={(event) => {
                              event.preventDefault();
                            }}
                          >
                            {t(MenuOption[menuOption], {
                              ns: 'electrophysiology_browser'
                            })}
                          </a>
                        </li>
                      );
                    })
                  }
                  <li
                    key={'close-tab'}
                    role="presentation"
                    style={{
                      display: 'flex',
                      maxWidth: '42px',
                      flexGrow: 1,
                    }}
                    onClick={async (e) => {
                      if (!(await confirmPanelClose(() => {
                        setRightPanel(null);
                      }))) {
                        e.stopPropagation();
                      }
                    }}
                  >
                    <a
                      className={'close-tab'}
                      href={'#'}
                      onClick={(event) => {
                        event.preventDefault();
                      }}
                      role="tab"
                    >
                      ×
                    </a>
                  </li>
                </ul>
              </div>
              {
                rightPanel === 'annotationForm' &&
                chunksURL[0].includes('Face13') &&
                <AnnotationForm
                  panelIsDirty={panelIsDirty}
                  setPanelIsDirty={setPanelIsDirty}
                  eventChannels={eventChannels}
                  setEventChannels={setEventChannels}
                />
              }
              {
                rightPanel === 'eventList' &&
                <EventManager canEdit={chunksURL[0].includes('Face13')} />
              }
              {
                rightPanel === 'hedEndorsement' &&
                <HEDEndorsement
                  canEndorse={chunksURL[0].includes('Face13')}
                  pressedKey={pressedKey}
                />
              }
            </div>
          }
        </div>
        </>
      { /*) : (
        <div style={{width: '100%', height: '100%'}}>
          <h4>Loading...</h4>
        </div>
      )}*/}
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
  limit: DEFAULT_MAX_CHANNELS,
};

export default connect(
  (state: RootState)=> ({
    viewerWidth: state.bounds.viewerWidth,
    viewerHeight: state.bounds.viewerHeight,
    interval: state.bounds.interval,
    amplitudeScale: state.bounds.amplitudeScale,
    rightPanel: state.rightPanel,
    timexSelection: state.timeSelection,
    chunksURL: state.dataset.chunksURL,
    channels: state.channels,
    epochs: state.dataset.epochs,
    filteredEpochs: state.dataset.filteredEpochs,
    activeEpoch: state.dataset.activeEpoch,
    hidden: state.montage.hidden,
    channelMetadata: state.dataset.channelMetadata,
    offsetIndex: state.dataset.offsetIndex,
    limit: state.dataset.limit,
    loadedChannels: state.dataset.loadedChannels,
    domain: state.bounds.domain,
    physioFileID: state.dataset.physioFileID,
    hoveredChannels: state.cursor.hoveredChannels,
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
    updateActiveEpoch: R.compose(
      dispatch,
      updateActiveEpoch
    ),
    setTimeSelection: R.compose(
      dispatch,
      setTimeSelection
    ),
  })
)(SeriesRenderer);
