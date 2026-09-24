import React, {useState, useEffect, useContext} from 'react';
import {MAX_RENDERED_EVENTS} from '../../shared/constants';
import {
  buildHEDString,
  getEventsInRange,
  getTagsForEvent,
} from '../eventLogic';
import {
  RecordingEvent,
  HEDTag,
  HEDSchemaElement,
  Channel,
} from '../../domain/types';
import {CheckboxElement} from '../../ui/Form';
import {useTranslation, Trans} from 'react-i18next';
import {ChannelMetadataContext} from '../../recording/RecordingDataProvider';
import {useTimeWindow} from '../../timeline/TimeWindowContext';
import {useTimeSelection} from '../../timeline/TimeSelectionContext';
import {useRightPanel} from '../../viewer/RightPanelContext';
import {useCurrentAnnotation}
  from '../../annotations/state/CurrentAnnotationContext';
import {useEvents} from '../state/EventContext';
import {useRecording} from '../../recording/RecordingContext';
import {useHED} from '../../hed/state/HEDContext';

type EventManagerProps = {
  viewerHeight: number,
  channels: Channel[],
  canEdit: boolean,
};

/** Event manager component. */
function EventManager({
  viewerHeight,
  channels,
  canEdit,
}: EventManagerProps) {
  const {channelDelimiter} = useRecording();
  const {hedSchema, datasetTags, tagsHaveChanges} = useHED();
  const {setCurrentAnnotation} = useCurrentAnnotation();
  const {
    events,
    eventFilter: filteredEvents,
    setEventFilter: setFilteredEvents,
    setActiveEvent: updateActiveEvent,
    toggleEvent: toggleEvent,
  } = useEvents();
  const {setRightPanel} = useRightPanel();
  const {
    recordingTimeRange,
    timeWindow,
    setTimeWindow,
  } = useTimeWindow();
  const {setTimeSelection} = useTimeSelection();
  const {t} = useTranslation();
  const channelMetadata = useContext(ChannelMetadataContext);
  const [eventsInRange, setEventsInRange] = useState(
    getEventsInRange(events, timeWindow)
  );
  const [allEventsVisible, setAllEventsVisibility] = useState(() => {
    if (eventsInRange.length < MAX_RENDERED_EVENTS) {
      return eventsInRange.some((index) => {
        return !filteredEvents.plotVisibility.includes(index);
      });
    }
    return true;
  });
  const [allCommentsVisible, setAllCommentsVisible] = useState(false);
  const [triggerUpdate, setTriggerUpdate] = useState(0);

  const [activeLabel, setActiveLabel] = useState('trial_type');
  const [searchText, setSearchText] = useState('');

  /** Get event labels. */
  const getEventLabels = (label: string) => {
    const labels: string[] = [];
    events.forEach((event) => {
      switch (label) {
      case 'trial_type':
        labels.push(event.trialType ?? 'n/a');
        break;
      case 'HED':
        const hedTags = [
          ...event.hed,
          ...getTagsForEvent(event, datasetTags, hedSchema),
        ];
        labels.push(hedTags.length > 0
          ? buildHEDString(hedTags).join(', ')
          : 'n/a');
        break;
      default:
        labels.push(event.properties?.find(
          (prop) => prop.PropertyName === activeLabel
        )?.PropertyValue ?? 'n/a');
      }
    });
    return labels;
  };

  const [activeLabels, setActiveLabels] = useState(getEventLabels('trial_type'));
  const [ignoreNA, setIgnoreNA] = useState(false);
  const [invertSearchResults, setInvertSearchResults] = useState(false);


  /** Get dataset columns. */
  const getDatasetColumns = () => {
    const datasetColumns = [...Object.keys(datasetTags), 'HED'];
    return [
      'trial_type',
      ...datasetColumns
        .filter((label) => !['trial_type'].includes(label))
        .sort(),
    ];
  };
  useEffect(() => {
    const datasetColumns = getDatasetColumns();
    if (!datasetColumns.includes(activeLabel)) {
      if (datasetColumns.length > 0) {
        // Fallback -- could be improved
        setActiveLabel(datasetColumns[0]);
      }
    }
  }, []);

  useEffect(() => {
    setActiveLabels(getEventLabels(activeLabel));
  }, [activeLabel]);

  useEffect(() => {
    if (tagsHaveChanges) {
      setTriggerUpdate(((triggerUpdate + 1) % Number.MAX_SAFE_INTEGER));
    }
  }, [tagsHaveChanges]);

  // Update window visibility state
  useEffect(() => {
    setEventsInRange(getEventsInRange(events, timeWindow));
  }, [events, timeWindow]);

  useEffect(() => {
    if (eventsInRange.length > 0 && eventsInRange.length < MAX_RENDERED_EVENTS) {
      setAllEventsVisibility(!eventsInRange.some((index) => {
        return !filteredEvents.plotVisibility.includes(index);
      })); // If one or more event isn't visible, set to be able to reveal all
    } else {
      setAllEventsVisibility(false);
    }

    if (eventsInRange.length > 0) {
      setAllCommentsVisible(!eventsInRange.some((eventIndex) => {
        return (events[eventIndex].properties.length > 0 || events[eventIndex].hed)
          && !filteredEvents.columnVisibility.includes(eventIndex);
      }));
    } else {
      setAllCommentsVisible(false);
    }
  }, [eventsInRange, filteredEvents]);

  useEffect(() => {
    setFilteredEvents((currentFilter) => ({
      ...currentFilter,
      searchVisibility: eventsInRange.filter(
        (eventIndex) =>
          indexVisibleBySearch(eventIndex)
      ),
    }));
  }, [eventsInRange, searchText, ignoreNA, invertSearchResults, activeLabels, triggerUpdate]);

  /** Set comments in range visibility. */
  const setCommentsInRangeVisibility = (visible: boolean) => {
    let commentIndices = [...filteredEvents.columnVisibility];
    eventsInRange.forEach((eventIndex) => {
      if (events[eventIndex].properties.length > 0 || events[eventIndex].hed) {
        if (visible && !filteredEvents.columnVisibility.includes(eventIndex)) {
          commentIndices.push(eventIndex);
        } else if (!visible && filteredEvents.columnVisibility.includes(eventIndex)) {
          commentIndices = commentIndices.filter((value) => value !== eventIndex);
        }
      }
    });
    setFilteredEvents({
      ...filteredEvents,
      columnVisibility: commentIndices,
    });
  };

  /**
   *
   * @param visible - Whether events in view should be visible.
   */
  const setEventsInViewVisibility = (visible: boolean) => {
    if (eventsInRange.length < MAX_RENDERED_EVENTS) {
      eventsInRange.forEach((eventIndex) => {
        if ((visible && !filteredEvents.plotVisibility.includes(eventIndex))
          || (!visible && filteredEvents.plotVisibility.includes(eventIndex))) {
          toggleEvent(eventIndex);
        }
      });
    }
  };

  /** Index visible by search. */
  const indexVisibleBySearch = (eventIndex: number) => {
    const lowerCaseLabel = activeLabels[eventIndex]?.toLowerCase();
    // Escape backslashes and regular-expression metacharacters.
    const lowerCaseSearchText = searchText
      .toLowerCase()
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (eventIndex < activeLabels.length) {
      return (
        searchText.length === 0 ||
        (
          !invertSearchResults &&
          lowerCaseLabel.search(lowerCaseSearchText) > -1
        ) || (
          invertSearchResults &&
          lowerCaseLabel.search(lowerCaseSearchText) === -1
        )
      ) &&
        !(ignoreNA && activeLabels[eventIndex] === 'n/a');
    }
    return false;
  };

  /** Handle text change. */
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  /** Jump to event. */
  const jumpToEvent = (event: RecordingEvent) => {
    const eventTimeRange = [
      event.onset,
      event.onset + Math.max(event.duration, 0.1),
    ].sort((a, b) => a - b);

    setTimeWindow([
      Math.max(0, eventTimeRange[0] - 0.1),
      Math.min(eventTimeRange[1], recordingTimeRange[1]),
    ]);
  };

  return (
    <div
      className="panel panel-primary event-list"
      style={{borderTopLeftRadius: 0, borderTopRightRadius: 0}}
    >
      <div
        className="panel-heading"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          alignItems: 'flex-start',
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <p style={{margin: '0px'}}>
            &nbsp;
            {t(
              'showing {{numShowing}}/{{numTotal}}', {
                ns: 'electrophysiology_browser',
                numShowing: filteredEvents
                  .searchVisibility
                  .filter((i) => filteredEvents.plotVisibility.includes(i))
                  .length,
                numTotal: eventsInRange.length,
              }
            )}
          </p>
          <div style={{display: 'flex', flexDirection: 'row'}}>
            <i
              className={
                'glyphicon glyphicon-option-'
                + (allCommentsVisible ? 'show' : 'show')
                + (eventsInRange.length >= MAX_RENDERED_EVENTS ? ' glyphicon-greyed' : '')}
              style={{cursor: 'pointer', paddingTop: '0.375em', paddingRight: '0.5em'}}
              onClick={() => setCommentsInRangeVisibility(!allCommentsVisible)}
            ></i>
            <i
              className={
                'glyphicon glyphicon-eye-'
                + (allEventsVisible ? 'open' : 'close')
                + (eventsInRange.length >= MAX_RENDERED_EVENTS ? ' glyphicon-greyed' : '')
              }
              style={{cursor: 'pointer', padding: '0.5em'}}
              onClick={() => setEventsInViewVisibility(!allEventsVisible)}
            ></i>
          </div>
        </div>
        <div>
          <span style={{fontSize: '0.75em'}}>
            {t(
              'Total events in recording {{total}}', {
                ns: 'electrophysiology_browser',
                total: events.length,
              }
            )}
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: '2px',
            width: '100%',
          }}
        >
          <div style={{fontSize: '12px', minWidth: 'fit-content'}}>
            {t(
              'Display by:', {
                ns: 'electrophysiology_browser',
              }
            )}
            &nbsp;
          </div>
          <div>
            <button
              type='button'
              className='btn btn-xs btn-default dropdown-toggle'
              data-toggle='dropdown'
              data-bs-display="static"
              style={{
                borderRadius: '3px',
                marginRight: '0',
              }}
            >
              {activeLabel}&nbsp;
              <span className="glyphicon glyphicon-menu-down"></span>
            </button>
            <ul className='dropdown-menu'
              role='menu'
              style={{
                minWidth: 'max-content',
                width: 'fit-content',
                top: '112px',
                left: 'unset',
              }}
            >
              {
                getDatasetColumns().map((column, i) => {
                  return <li key={`column-select-${i}`} onClick={() => {
                    setActiveLabel(column);
                  }}>
                    {column}
                  </li>;
                })
              }
            </ul>
          </div>
          <input
            id='label-search'
            type='search'
            placeholder={t(
              '{{label}} search...', {
                ns: 'electrophysiology_browser',
                label: activeLabel,
              }
            )}
            value={searchText}
            onChange={handleTextChange}
            style={{
              width: '100%',
              height: '24px',
              fontSize: '90%',
              paddingLeft: '5px',
            }}
          />
        </div>
        <div style={{
          display: 'flex',
          width: '100%',
          overflow: 'hidden',
          marginTop: '5px',
        }}>
          <CheckboxElement
            id='toggle-ignore_na'
            name='toggle-ignore_na'
            offset=''
            label={<React.Fragment>{t(
              'Ignore {{bidsNA}}', {
                ns: 'electrophysiology_browser',
                bidsNA: 'n/a',
              }
            )}</React.Fragment>}
            value={ignoreNA}
            onUserInput={() => {
              setIgnoreNA(!ignoreNA);
            }}
            outerStyles={{}}
            innerLabelStyle={{
              display: 'flex',
              whiteSpace: 'nowrap',
            }}
          />
          {
            searchText.length > 0 &&
            <CheckboxElement
              id='toggle-invert-search'
              name='toggle-invert-search'
              offset=''
              label={
                <Trans
                  i18nKey="Exclude <text>{{searchText}}</text>"
                  ns="electrophysiology_browser"
                  values={{searchText: searchText}}
                  components={{text: <span className='label-ellipsis'/>}}
                />
              }
              value={invertSearchResults}
              onUserInput={() => {
                setInvertSearchResults(!invertSearchResults);
              }}
              outerStyles={{}}
              innerLabelStyle={{
                display: 'flex',
                whiteSpace: 'nowrap',
              }}
            />
          }
        </div>
      </div>
      <div
        className="panel-body"
        style={{padding: 0}}
      >
        <div
          className="list-group"
          style={{
            maxHeight: `${viewerHeight + 75}px`,
            overflowY: 'scroll',
            overflowX: 'clip',
            marginBottom: 0,
          }}
        >
          {eventsInRange.length >= MAX_RENDERED_EVENTS &&
            <div className='event-panel-message'>
              {t(
                'Too many events to plot for this timeline range', {
                  ns: 'electrophysiology_browser',
                }
              )}
            </div>
          }
          {eventsInRange.length === 0 &&
            <div className='event-panel-message'>
              {t('No events in timeline range.', {
                ns: 'electrophysiology_browser',
              }
              )}
              <br/>
              {t('Try selecting a different time range.', {
                ns: 'electrophysiology_browser',
              }
              )}
            </div>
          }
          {
            // eventsInRange.length < MAX_RENDERED_EVENTS &&
            eventsInRange.map((eventIndex) => {
              const event = events[eventIndex];
              const eventVisible = filteredEvents.plotVisibility.includes(eventIndex);
              const hedVisible = filteredEvents.columnVisibility.includes(eventIndex);

              /** Handle comment visibility change. */
              const handleCommentVisibilityChange = () => {
                if (!hedVisible) {
                  setFilteredEvents({
                    ...filteredEvents,
                    columnVisibility: [
                      ...filteredEvents.columnVisibility,
                      eventIndex,
                    ],
                  });
                } else {
                  setFilteredEvents({
                    ...filteredEvents,
                    columnVisibility: filteredEvents.columnVisibility.filter(
                      (value) => value !== eventIndex
                    ),
                  });
                }
              };

              /** Handle edit click. */
              const handleEditClick = () => {
                setCurrentAnnotation(event);
                setRightPanel('annotationForm');
                const startTime = event.onset;
                const endTime = event.duration + startTime;
                setTimeSelection([startTime, endTime]);
              };
              const channelNamesInView = channelMetadata.filter((_, index) => {
                return channels.map((channel) => channel.index).includes(index);
              }).map((metadata) => metadata.name);

              return filteredEvents.searchVisibility.includes(eventIndex) && (
                <div
                  key={eventIndex}
                  className={
                    'list-group-item list-group-item-action panel-event'
                    + (
                      event.channels && event.channels.length > 0
                        ? '-channel-based'
                        : ''
                    )
                  }
                  style={{
                    position: 'relative',
                  }}
                  onMouseEnter={() => updateActiveEvent(eventIndex)}
                  onMouseLeave={() => updateActiveEvent(null)}
                >
                  <div
                    className="event-details"
                  >
                    <div className="event-label">
                      {
                        activeLabel === 'trial_type'
                          ? event.trialType ?? 'n/a'
                          : activeLabel === 'HED'
                            ? [
                              ...event.hed,
                              ...getTagsForEvent(event, datasetTags, hedSchema),
                            ].length > 0
                              ? buildHEDString([
                                ...event.hed,
                                ...getTagsForEvent(event, datasetTags, hedSchema),
                              ]).join(', ')
                              : 'n/a'
                            : event.properties.find((prop) => prop.PropertyName === activeLabel)
                              ?.PropertyValue ?? 'n/a'
                      }
                      <br/>
                      {Math.round(event.onset * 1000) / 1000}
                      {event.duration > 0
                        && ' - '
                        + (Math.round((event.onset + event.duration) * 1000) / 1000)
                      }
                      <br/>
                      {
                        (event.channels.length === 0)
                          ? '' // 'All channels'
                          : event.channels
                            .sort((channelA, channelB) => {
                              return channelMetadata.findIndex(
                                (channel) => channel.name === channelA
                              )
                                - channelMetadata.findIndex((channel) => channel.name === channelB);
                            })
                            .map((channel, i) => {
                              return <span
                                key={`span-${channel}-${i}`}
                                style={{
                                  fontWeight: channelNamesInView.includes(channel)
                                    ? 'normal' : 'lighter',
                                }}>
                                {i > 0 && <>{channelDelimiter}&nbsp;</>}
                                {channel}
                              </span>;
                            })
                      }
                    </div>
                    <div
                      className="event-action"
                    >
                      <button
                        type="button"
                        className={(eventVisible ? '' : 'active ')
                          + 'btn btn-xs btn-primary'}
                        onClick={() => toggleEvent(eventIndex)}
                      >
                        <i className={
                          'glyphicon glyphicon-eye-'
                          + (eventVisible ? 'open' : 'close')
                        }></i>
                      </button>
                      <button
                        type="button"
                        className={'btn btn-xs btn-primary'}
                        onClick={() => {
                          // setActiveItemIndex(i);
                          jumpToEvent(event);
                        }}
                        // onMouseEnter={() => setHoveredItem(`jumpToSelected-${i}`)}
                        // onMouseLeave={() => setHoveredItem('')}
                      >
                        <i
                          className='glyphicon glyphicon-map-marker'
                        />
                      </button>
                      {
                        /*
                        (
                          {event.properties.length > 0 ||
                          event.hed.length > 0 ||
                          getTagsForEvent(event, datasetTags, hedSchema).length > 0 ||
                          event.channels.length > 0
                        ) &&
                        */
                        (
                          <button
                            type="button"
                            className={(hedVisible ? '' : 'active ')
                              + 'btn btn-xs btn-primary'}
                            onClick={() => handleCommentVisibilityChange()}
                          >
                            <i className={
                              'glyphicon glyphicon-option-show'
                            }/>
                          </button>
                        )
                      }
                      {
                        event.type === 'Event' &&
                        <button
                          type="button"
                          className={'btn btn-xs btn-primary'}
                          onClick={() => handleEditClick()}
                          disabled={!canEdit}
                        >
                          <i className={
                            'glyphicon glyphicon-edit'
                          }></i>
                        </button>
                      }
                    </div>
                  </div>
                  {(hedVisible /* && (
                      event.properties.length > 0 ||
                      event.hed ||
                      event.channels.length > 0
                    )*/
                  ) &&
                    <div className="event-tag">
                      {/* {event.channels.length > 0 &&*/}
                      {/*  <div><strong>Channel(s) </strong>*/}
                      {/*    {event.channels.join(channelDelimiter)}*/}
                      {/*  </div>*/}
                      {/* }*/}
                      <div>
                        <code className='event-label'>
                          trial_type
                        </code>
                        &nbsp;
                        <span>
                          {event.trialType}
                        </span>
                      </div>
                      <div>
                        <code className='event-label'>
                          {t('Channel'.toString().toLowerCase(), {
                            ns: 'electrophysiology_browser',
                            count: 1,
                          }
                          )}
                        </code>
                        &nbsp;
                        <span>
                          {
                            event.channels.length > 0
                              ? event.channels.map((channel, i) => {
                                return <React.Fragment key={`event-channel-${channel}-${i}`}>
                                  {i > 0 && <>{channelDelimiter}&nbsp;</>}
                                  {channel}
                                </React.Fragment>;
                              })
                              : 'n/a'
                          }
                        </span>
                      </div>
                      {event.properties.length > 0 &&
                        <div><strong>Additional Columns </strong>
                          {
                            event.properties.map((property) => {
                              return <div>
                                <code className='event-label'>
                                  {property.PropertyName}
                                </code>
                                &nbsp;
                                <span>
                                  {property.PropertyValue}
                                </span>
                              </div>;
                            })
                          }
                        </div>
                      }
                      {
                        <div><strong>HED </strong>
                          {
                            [
                              ...event.hed,
                              ...getTagsForEvent(event, datasetTags, hedSchema),
                            ].length > 0
                              ? (
                                buildHEDString([
                                  ...event.hed,
                                  ...getTagsForEvent(event, datasetTags, hedSchema),
                                ]).join(', ')
                              )
                              : 'n/a'
                          }
                        </div>
                      }
                    </div>
                  }
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

EventManager.defaultProps = {};

export default EventManager;
