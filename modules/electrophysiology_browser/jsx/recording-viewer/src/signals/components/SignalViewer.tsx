import React, {
  useEffect,
  useRef,
  useContext,
} from 'react';
import {colorOrder} from '../../ui/colors';
import {
  DEFAULT_SIGNAL_UNIT,
  DEFAULT_TIME_WINDOW,
} from '../../shared/constants';
import {ParentSize} from '@visx/responsive';
import {
  ChannelAxesLayer,
  ChannelsLayer,
  EventsLayer,
  XAxisLayer,
} from './SignalLayers';
import SignalCursor from './SignalCursor';
import LoadingBar from '../../ui/LoadingBar';
import TimeWindowControls from '../../timeline/components/TimeWindowControls';
import EventManager from '../../events/components/EventManager';
import AnnotationForm from '../../annotations/components/AnnotationForm';

import {
  HighPassFilterSelect,
  LowPassFilterSelect,
} from './PassFilterSelect';
import HEDEndorsement from '../../hed/components/HEDEndorsement';
import {useTranslation} from 'react-i18next';
import ChannelTypesSelector from '../../channels/components/ChannelTypesSelector';
import Pagination from '../../channels/components/Pagination';
import {HoveredChannelsContext} from '../../recording/RecordingDataProvider';
import {useTimeWindow} from '../../timeline/TimeWindowContext';
import {useTimeSelection} from '../../timeline/TimeSelectionContext';
import {useAmplitude} from '../state/AmplitudeContext';
import {usePassFilters} from '../state/PassFilterContext';
import {useRightPanel} from '../../viewer/RightPanelContext';
import {useCurrentAnnotation} from '../../annotations/state/CurrentAnnotationContext';
import {useEvents} from '../../events/state/EventContext';
import {useRecording} from '../../recording/RecordingContext';
import {useChannelView} from '../../channels/useChannelView';
import {useViewerDisplay} from '../../viewer/useViewerDisplay';
import {useAnnotationPanel} from '../../annotations/useAnnotationPanel';
import {useSignalPointerInteractions}
  from '../useSignalPointerInteractions';
import {useLoadingProgress} from '../useLoadingProgress';
import {useViewerKeyboardShortcuts}
  from '../../viewer/useViewerKeyboardShortcuts';

type SignalViewerProps = {
  navigationRequest?: {
    sequence: number;
    targetID: string;
    viewerPanel?: 'eventList' | 'hedEndorsement';
  };
  viewerID: string;
};

/** Signal viewer component. */
function SignalViewer({navigationRequest, viewerID}: SignalViewerProps) {
  const {chunksURL, physioFileID} = useRecording();
  const {setCurrentAnnotation} = useCurrentAnnotation();
  const {
    events,
    activeEvent,
    eventFilter,
  } = useEvents();
  const {rightPanel, setRightPanel} = useRightPanel();
  const {
    recordingTimeRange,
    timeWindow: interval,
    zoomIn,
    zoomOut,
    resetZoom,
    moveByWindow,
  } = useTimeWindow();
  const {
    amplitudeScale,
    scaleAmplitude,
    resetAmplitude,
  } = useAmplitude();
  const {highPass, lowPass, setHighPass, setLowPass} =
      usePassFilters();
  const {
    timeSelection,
    setTimeSelection,
    selectionCanBeZoomedTo,
    zoomToSelection,
  } = useTimeSelection();
  const {t} = useTranslation();

  const cursorRef = useRef(null);
  const {
    bidsChannels, channelMetadata, channelTypes, setChannelTypes,
    selectedChannels, channels, loadedChannels, channelsToLoad, limit,
    offsetIndex, updateOffsetIndex, displayedChannelsLimit,
    changeDisplayedChannelsLimit, viewerHeight,
  } = useChannelView();
  const {
    cursorEnabled, toggleCursor, withDCOffset, toggleDCOffset,
    stackedView, toggleStackedView, singleMode, toggleSingleMode,
    showOverflow, toggleShowOverflow,
  } = useViewerDisplay();
  const {
    panelIsDirty, setPanelIsDirty, eventChannels, setEventChannels,
    confirmPanelClose,
  } = useAnnotationPanel();

  useEffect(() => {
    if (!navigationRequest?.viewerPanel
      || navigationRequest.targetID !== viewerID) {
      return;
    }

    void confirmPanelClose(() => {
      if (navigationRequest.viewerPanel === 'hedEndorsement') {
        setTimeSelection(null);
      }
      setRightPanel(navigationRequest.viewerPanel ?? null);
    });
  }, [navigationRequest]);
  const {
    viewerRef, handlePointerMove, handlePointerDown, handlePointerUp,
    handlePointerCancel, handlePointerLeave,
  } = useSignalPointerInteractions();
  const loadingProgress = useLoadingProgress(loadedChannels, channelsToLoad);
  const pressedKey = useViewerKeyboardShortcuts({
    cursorRef,
    limit,
    offsetIndex,
    updateOffsetIndex,
    moveByWindow,
    toggleCursor,
    toggleStackedView,
    stackedView,
    toggleSingleMode,
    zoomToSelection,
    resetZoom,
    zoomOut,
    zoomIn,
    scaleAmplitude,
  });

  const prevHoveredChannels = useRef<number[]>([]);
  const defaultLineColor = '#999';

  /** Set line color. */
  const setLineColor = (channelIndex: number, colored: boolean) => {
    const classString = `.visx-linepath.channel-${channelIndex}`;
    viewerRef.current?.querySelectorAll(classString).forEach((line) => {
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

  const {hoveredChannels, setHoveredChannels} = useContext(HoveredChannelsContext);

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

  const showAxisScaleLines = false;

  /** On channel click. */
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
          channelName,
        ]);
      }
    }
  };

  /** On channel hover. */
  const onChannelHover = (channelIndex : number) => {
    setHoveredChannels(channelIndex === -1 ? [] : [channelIndex]);
  };

  const MenuOption = {
    'MANAGE_EVENTS': 'Events',
    'HED_ENDORSEMENT': 'HED Endorsements',
  };

  // TODO: gate event editing on a permission rather than a dataset name.
  const canEditEvents = chunksURL.includes('Face13');

  return (
    <div className='signal-viewer-layout'>
      <div className='signal-viewer-main'>
        <div className='recording-viewer-toolbar'>
          <div className='recording-viewer-toolbar-actions'>
            <div id='right-panel-controls'>
              <ChannelTypesSelector
                channelTypes={channelTypes}
                setChannelTypes={setChannelTypes}
              />
              <button
                className={'btn btn-primary'}
                disabled={!chunksURL || !canEditEvents || rightPanel === 'annotationForm'}
                onClick={() => {
                  confirmPanelClose(() => {
                    setRightPanel('annotationForm');
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
                      });
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
          <TimeWindowControls
            zoomControls={
              <div className='btn-group'>
                <button
                  type='button'
                  className='btn btn-primary btn-xs'
                  onClick={zoomOut}
                  disabled={interval[0] === recordingTimeRange[0] &&
                        interval[1] === recordingTimeRange[1]}
                  aria-label={t('Zoom Out', {ns: 'electrophysiology_browser'})}
                >−</button>
                <button
                  type='button'
                  className='btn btn-primary btn-xs'
                  onClick={resetZoom}
                  disabled={(interval[1] - interval[0]) ===
                        (DEFAULT_TIME_WINDOW[1] - DEFAULT_TIME_WINDOW[0])}
                >{t('Reset Zoom', {ns: 'electrophysiology_browser'})}</button>
                <button
                  type='button'
                  className='btn btn-primary btn-xs'
                  onClick={zoomIn}
                  disabled={(interval[1] - interval[0]) <= 0.1}
                  aria-label={t('Zoom In', {ns: 'electrophysiology_browser'})}
                >+</button>
              </div>
            }
            fitToSelectionControl={
              <button
                type='button'
                className='btn btn-primary btn-xs'
                onClick={() => {
                  zoomToSelection();
                  setTimeSelection(null);
                }}
                disabled={!selectionCanBeZoomedTo}
              >{t('Fit Range to Selection', {ns: 'electrophysiology_browser'})}</button>
            }
          />
          <div className='recording-viewer-toolbar-settings'>
            <div className='recording-viewer-toolbar-groups'>
              <div className='recording-viewer-control-group'>
                <span className='recording-viewer-control-label'>
                  {t('Amplitude', {ns: 'electrophysiology_browser'})}
                </span>
                <div className='btn-group'>
                  <button type='button' className='btn btn-primary btn-xs'
                    onClick={() => scaleAmplitude(1.1)}
                    aria-label={t('Decrease Amplitude', {ns: 'electrophysiology_browser'})}
                  >−</button>
                  <button type='button' className='btn btn-primary btn-xs'
                    onClick={resetAmplitude}
                  >{t('Reset', {ns: 'loris'})}</button>
                  <button type='button' className='btn btn-primary btn-xs'
                    onClick={() => scaleAmplitude(0.9)}
                    aria-label={t('Increase Amplitude', {ns: 'electrophysiology_browser'})}
                  >+</button>
                </div>
              </div>
              <div className='recording-viewer-control-group'>
                <span className='recording-viewer-control-label'>
                  {t('Filters', {ns: 'electrophysiology_browser'})}
                </span>
                <HighPassFilterSelect
                  value={highPass}
                  onChange={setHighPass}
                />

                <LowPassFilterSelect
                  value={lowPass}
                  onChange={setLowPass}
                />
              </div>
              <div className='recording-viewer-control-group'>
                <span className='recording-viewer-control-label'>
                  {t('Display', {ns: 'electrophysiology_browser'})}
                </span>
                <div className='recording-viewer-button-row'>
                  <button type='button'
                    className={'btn btn-primary btn-xs' +
                          (withDCOffset ? ' active' : '')}
                    aria-pressed={withDCOffset}
                    onClick={toggleDCOffset}
                  >{t('DC Offset', {ns: 'electrophysiology_browser'})}</button>
                  <button type='button'
                    className={'btn btn-primary btn-xs' +
                          (stackedView ? ' active' : '')}
                    aria-pressed={stackedView}
                    onClick={toggleStackedView}
                  >{t('Stack', {ns: 'electrophysiology_browser'})}</button>
                  <button type='button'
                    className={'btn btn-primary btn-xs' +
                          (singleMode ? ' active' : '')}
                    aria-pressed={singleMode}
                    disabled={!stackedView}
                    onClick={toggleSingleMode}
                  >{t('Isolate', {ns: 'electrophysiology_browser'})}</button>
                  <button type='button'
                    className={'btn btn-primary btn-xs' +
                          (showOverflow ? ' active' : '')}
                    aria-pressed={showOverflow}
                    onClick={toggleShowOverflow}
                  >{t('Overflow', {ns: 'electrophysiology_browser'})}</button>
                </div>
              </div>
            </div>
            <Pagination
              limit={limit}
              selectedChannelsCount={selectedChannels.length}
              offsetIndex={offsetIndex}
              updateOffsetIndex={updateOffsetIndex}
              displayedChannelsLimit={displayedChannelsLimit}
              setDisplayedChannelsLimit={changeDisplayedChannelsLimit}
            />
          </div>
        </div>
        <div className='signal-plot-layout'>
          <div
            className='signal-loading-progress'
            style={{
              visibility: loadingProgress.visible ? 'visible' : 'hidden',
            }}
          >
            <LoadingBar progress={loadingProgress.progress} t={t} />
          </div>
        </div>
        <div className='signal-plot-layout'>
          <div
            className='signal-channel-labels'
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: viewerHeight,
              paddingRight: '0px',
              userSelect: 'none',
            }}
          >{/* Below slice changes labels to be subset of channel choice */}
            {channels
              .slice(0, displayedChannelsLimit)
              .map((channel) => (
                <div
                  key={channel.index}
                  style={{
                    display: 'flex',
                    height: 1 / displayedChannelsLimit * 100 + '%',
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
                          ? (activeEvent === null && rightPanel === 'annotationForm')
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
            className='signal-plot'
            style={{
              paddingLeft: '5px',
            }}
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
                      ({DEFAULT_SIGNAL_UNIT})
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
              <SignalCursor
                cursorRef={cursorRef}
                channels={channels}
                timeWindow={interval}
                enabled={cursorEnabled}
                channelMetadata={channelMetadata}
                showEvents={rightPanel === 'eventList'}
              />
              <div style={{height: viewerHeight}}>
                <ParentSize>
                  {({width, height}) => (
                    <svg
                      ref={viewerRef}
                      viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
                      style={{
                        overflowY: showOverflow ? 'visible' : 'hidden',
                        touchAction: 'none',
                      }}
                      width={width}
                      height={height}
                      onPointerMove={handlePointerMove}
                      onPointerDown={handlePointerDown}
                      onPointerUp={handlePointerUp}
                      onPointerCancel={handlePointerCancel}
                      onPointerLeave={handlePointerLeave}
                    >
                      <EventsLayer
                        viewerWidth={width}
                        viewerHeight={height}
                        events={events}
                        eventFilter={eventFilter}
                        timeWindow={interval}
                        displayedChannels={channels}
                        visible={Boolean(rightPanel)}
                        timeSelection={timeSelection}
                        activeEvent={activeEvent}
                        eventChannels={eventChannels}
                      />
                      <ChannelsLayer
                        viewerWidth={width}
                        viewerHeight={height}
                        cursorRef={cursorRef}
                        stackedView={stackedView}
                        singleMode={singleMode}
                        hoveredChannels={hoveredChannels}
                        channels={channels}
                        channelMetadata={channelMetadata}
                        bidsChannels={bidsChannels}
                        physioFileID={physioFileID}
                        channelCount={displayedChannelsLimit}
                        timeWindow={interval}
                        amplitudeScale={amplitudeScale}
                        withDCOffset={withDCOffset}
                      />
                      <XAxisLayer
                        viewerWidth={width}
                        viewerHeight={height}
                        timeWindow={interval}
                      />
                      <ChannelAxesLayer
                        viewerWidth={width}
                        viewerHeight={height}
                        channels={channels}
                        channelMetadata={channelMetadata}
                        channelCount={displayedChannelsLimit}
                        visible={showAxisScaleLines}
                      />
                    </svg>
                  )}
                </ParentSize>
              </div>
            </div>
          </div>
        </div>
      </div>
      {rightPanel &&
            <aside
              className='signal-viewer-side-panel'
              style={{color: '#064785', borderColor: '#C3D5DB'}}
            >
              <nav
                aria-label={t('Navigation', {
                  ns: 'electrophysiology_browser',
                })}
                style={{
                  display: 'flex',
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
                    Object.entries(MenuOption).map(([menuOption, label], i) => {
                      const isActiveMenuOption =
                        (
                          ['eventList', 'annotationForm'].includes(rightPanel)
                          && menuOption == 'MANAGE_EVENTS'
                        ) ||
                        (rightPanel === 'hedEndorsement' && menuOption == 'HED_ENDORSEMENT');
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
                              borderBottomColor: isActiveMenuOption
                                ? 'rgb(228, 235, 242)'
                                : '#C3D5DB',
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
                            {t(label, {
                              ns: 'electrophysiology_browser',
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
              </nav>
              {
                rightPanel === 'annotationForm' &&
                canEditEvents &&
                <AnnotationForm
                  panelIsDirty={panelIsDirty}
                  setPanelIsDirty={setPanelIsDirty}
                  eventChannels={eventChannels}
                  setEventChannels={setEventChannels}
                />
              }
              {
                rightPanel === 'eventList' &&
                <EventManager
                  canEdit={canEditEvents}
                  channels={channels}
                  viewerHeight={viewerHeight}
                />
              }
              {
                rightPanel === 'hedEndorsement' &&
                <HEDEndorsement
                  canEndorse={canEditEvents}
                  pressedKey={pressedKey}
                  viewerHeight={viewerHeight}
                />
              }
            </aside>
      }
    </div>
  );
}

export default SignalViewer;
