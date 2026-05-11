import React, {useState, useEffect} from 'react';
import {setCurrentAnnotation} from '../store/state/currentAnnotation';
import {MAX_RENDERED_EPOCHS} from '../../vector';
import {
  buildHEDString,
  getEpochsInRange,
  getTagsForEpoch,
  toggleEpoch,
  updateActiveEpoch
} from '../store/logic/filterEpochs';
import {setInterval} from '../store/state/bounds';
import {
  Epoch as EpochType,
  EpochFilter,
  HEDTag,
  HEDSchemaElement,
  RightPanel,
  ChannelMetadata,
  Channel
} from '../store/types';
import {connect} from 'react-redux';
import {setTimeSelection} from '../store/state/timeSelection';
import {setRightPanel} from '../store/state/rightPanel';
import * as R from 'ramda';
import {RootState} from '../store';
import {setFilteredEpochs} from '../store/state/dataset';
import {CheckboxElement} from './Form';
import {useTranslation, Trans} from "react-i18next";

type CProps = {
  timeSelection?: [number, number],
  epochs: EpochType[],
  filteredEpochs: EpochFilter,
  rightPanel: RightPanel,
  setCurrentAnnotation: (_: EpochType) => void,
  setTimeSelection: (_: [number, number]) => void,
  setRightPanel: (_: RightPanel) => void,
  toggleEpoch: (_: number) => void,
  updateActiveEpoch: (_: number) => void,
  setFilteredEpochs: (_: EpochFilter) => void,
  domain: [number, number],
  interval: [number, number],
  setInterval: (_: [number, number]) => void,
  viewerHeight: number,
  hedSchema: HEDSchemaElement[],
  datasetTags: any,
  channelDelimiter: string,
  channels: Channel[],
  channelMetadata: ChannelMetadata[],
  canEdit: boolean,
  tagsHaveChanges: boolean,
};

/**
 *
 * @param root0
 * @param root0.epochs
 * @param root0.filteredEpochs
 * @param root0.rightPanel
 * @param root0.setCurrentAnnotation
 * @param root0.setTimeSelection
 * @param root0.setRightPanel
 * @param root0.toggleEpoch
 * @param root0.updateActiveEpoch
 * @param root0.setFilteredEpochs
 * @param root0.domain
 * @param root0.interval
 * @param root0.setInterval
 * @param root0.viewerHeight
 * @param root0.hedSchema
 * @param root0.channelDelimiter
 * @param root0.channels
 * @param root0.channelMetadata
 * @param root0.datasetTags
 * @param root0.tagsHaveChanges
 */
const EventManager = ({
  epochs,
  filteredEpochs,
  rightPanel,
  setCurrentAnnotation,
  setTimeSelection,
  setRightPanel,
  toggleEpoch,
  updateActiveEpoch,
  setFilteredEpochs,
  domain,
  interval,
  setInterval,
  viewerHeight,
  hedSchema,
  datasetTags,
  channelDelimiter,
  channels,
  channelMetadata,
  canEdit,
  tagsHaveChanges,
}: CProps) => {
  const {t} = useTranslation();
  const [epochsInRange, setEpochsInRange] = useState(getEpochsInRange(epochs, interval));
  const [allEpochsVisible, setAllEpochsVisibility] = useState(() => {
    if (epochsInRange.length < MAX_RENDERED_EPOCHS) {
      return epochsInRange.some((index) => {
        return !filteredEpochs.plotVisibility.includes(index);
      })
    }
    return true;
  });
  const [allCommentsVisible, setAllCommentsVisible] = useState(false);
  const [triggerUpdate, setTriggerUpdate] = useState(0);

  const [activeLabel, setActiveLabel] = useState('trial_type');
  const [searchText, setSearchText] = useState('');

  const getEpochLabels = (label) => {
    const labels = [];
    epochs.forEach((epoch) => {
      switch (label) {
        case 'trial_type':
          labels.push(epoch.trialType ?? 'n/a');
          break;
        case 'HED':
          const hedTags = [
            ...epoch.hed,
            ...getTagsForEpoch(epoch, datasetTags, hedSchema),
          ];
          labels.push(hedTags.length > 0
            ? buildHEDString(hedTags).join(', ')
            : 'n/a');
          break;
        default:
          labels.push(epoch.properties?.find(
            (prop) => prop.PropertyName === activeLabel
          )?.PropertyValue ?? 'n/a');
      }
    });
    return labels;
  }

  const [activeLabels, setActiveLabels] = useState(getEpochLabels('trial_type'));
  const [ignoreNA, setIgnoreNA] = useState(false);
  const [invertSearchResults, setInvertSearchResults] = useState(false);


  const getDatasetColumns = () => {
    const datasetColumns = [...Object.keys(datasetTags), 'HED'];
    return [
      'trial_type',
      ...datasetColumns
        .filter(label => !['trial_type'].includes(label))
        .sort()
    ];
  }
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
    setActiveLabels(getEpochLabels(activeLabel));
  }, [activeLabel]);

   useEffect(() => {
	    if (tagsHaveChanges) {
        setTriggerUpdate(((triggerUpdate + 1) % Number.MAX_SAFE_INTEGER));
      }
   }, [tagsHaveChanges]);

  // Update window visibility state
  useEffect(() => {
    setEpochsInRange(getEpochsInRange(epochs, interval));
  }, [epochs, interval]);

  useEffect(() => {
    if (epochsInRange.length > 0 && epochsInRange.length < MAX_RENDERED_EPOCHS) {
      setAllEpochsVisibility(!epochsInRange.some((index) => {
        return !filteredEpochs.plotVisibility.includes(index);
      }));  // If one or more event isn't visible, set to be able to reveal all
    } else {
      setAllEpochsVisibility(false);
    }

    if (epochsInRange.length > 0) {
      setAllCommentsVisible(!epochsInRange.some((epochIndex) => {
        return (epochs[epochIndex].properties.length > 0 || epochs[epochIndex].hed)
          && !filteredEpochs.columnVisibility.includes(epochIndex);
      }));
    } else {
      setAllCommentsVisible(false);
    }
  }, [epochsInRange, filteredEpochs]);

  useEffect(() => {
    setFilteredEpochs({
      ...filteredEpochs,
      searchVisibility: epochsInRange.filter(
        (epochIndex) =>
          indexVisibleBySearch(epochIndex)
      ),
    });
  }, [epochsInRange, searchText, ignoreNA, invertSearchResults, activeLabels, triggerUpdate]);

  const setCommentsInRangeVisibility = (visible) => {
    let commentIndices = [...filteredEpochs.columnVisibility];
    epochsInRange.forEach((epochIndex) => {
      if (epochs[epochIndex].properties.length > 0 || epochs[epochIndex].hed) {
        if (visible && !filteredEpochs.columnVisibility.includes(epochIndex)) {
          commentIndices.push(epochIndex);
        } else if (!visible && filteredEpochs.columnVisibility.includes(epochIndex)) {
          commentIndices = commentIndices.filter((value) => value !== epochIndex);
        }
      }
    });
    setFilteredEpochs({
      ...filteredEpochs,
      columnVisibility: commentIndices
    });
  }

  /**
   *
   * @param visible
   */
  const setEpochsInViewVisibility = (visible) => {
    if (epochsInRange.length < MAX_RENDERED_EPOCHS) {
      epochsInRange.forEach((epochIndex) => {
        if ((visible && !filteredEpochs.plotVisibility.includes(epochIndex))
          || (!visible && filteredEpochs.plotVisibility.includes(epochIndex))) {
          toggleEpoch(epochIndex);
        }
      });
    }
  }

  const indexVisibleBySearch = (epochIndex) => {
    const lowerCaseLabel = activeLabels[epochIndex]?.toLowerCase();
    const lowerCaseSearchText = searchText.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');   // Escaped backslashes
    if (epochIndex < activeLabels.length) {
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
        !(ignoreNA && activeLabels[epochIndex] === 'n/a');
    }
    return false;
  }

  const handleTextChange = (event) => {
    setSearchText(event.target.value)
  }

  const jumpToEpoch = (epoch: EpochType) => {
    const epochTimeRange = [
      epoch.onset,
      epoch.onset + Math.max(epoch.duration, 0.1)
    ].sort((a, b) => a - b);

    setInterval([
      Math.max(0, epochTimeRange[0] - 0.1),
      Math.min(epochTimeRange[1], domain[1])
    ]);
  };

  return (
    <div className="panel panel-primary event-list" style={{borderTopLeftRadius: 0, borderTopRightRadius: 0,}}>
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
                numShowing: filteredEpochs
                  .searchVisibility
                  .filter((i) => filteredEpochs.plotVisibility.includes(i))
                  .length,
                numTotal: epochsInRange.length,
              }
            )}
          </p>
          <div style={{display: 'flex', flexDirection: 'row'}}>
            <i
              className={
                'glyphicon glyphicon-option-'
                + (allCommentsVisible ? 'show' : 'show')
                + (epochsInRange.length >= MAX_RENDERED_EPOCHS ? ' glyphicon-greyed' : '')}
              style={{cursor: 'pointer', paddingTop: '0.375em', paddingRight: '0.5em',}}
              onClick={() => setCommentsInRangeVisibility(!allCommentsVisible)}
            ></i>
            <i
              className={
                'glyphicon glyphicon-eye-'
                + (allEpochsVisible ? 'open' : 'close')
                + (epochsInRange.length >= MAX_RENDERED_EPOCHS ? ' glyphicon-greyed' : '')
              }
              style={{cursor: 'pointer', padding: '0.5em'}}
              onClick={() => setEpochsInViewVisibility(!allEpochsVisible)}
            ></i>
          </div>
        </div>
        <div>
          <span style={{fontSize: '0.75em',}}>
            {t(
              'Total events in recording {{total}}', {
                ns: 'electrophysiology_browser',
                total: epochs.length
              }
            )}
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems : 'center',
            marginTop: '2px',
            width: '100%',
          }}
        >
          <div style={{ fontSize: '12px', minWidth: 'fit-content', }}>
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
            <ul className='dropdown-menu pull-left'
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
                  </li>
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
          {epochsInRange.length >= MAX_RENDERED_EPOCHS &&
            <div className='event-panel-message'>
              {t(
                'Too many events to plot for this timeline range', {
                  ns: 'electrophysiology_browser',
                }
              )}
            </div>
          }
          {epochsInRange.length === 0 &&
            <div className='event-panel-message'>
              {t('No events in timeline range.', {
                  ns: 'electrophysiology_browser'
                }
              )}
              <br/>
              {t('Try selecting a different time range.', {
                  ns: 'electrophysiology_browser'
                }
              )}
            </div>
          }
          {
            // epochsInRange.length < MAX_RENDERED_EPOCHS &&
            epochsInRange.map((epochIndex) => {
              const epoch = epochs[epochIndex];
              const epochVisible = filteredEpochs.plotVisibility.includes(epochIndex);
              const hedVisible = filteredEpochs.columnVisibility.includes(epochIndex);

              /**
               *
               */
              const handleCommentVisibilityChange = () => {
                if (!hedVisible) {
                  setFilteredEpochs({
                    ...filteredEpochs,
                    columnVisibility: [
                      ...filteredEpochs.columnVisibility,
                      epochIndex,
                    ]
                  });
                } else {
                  setFilteredEpochs({
                    ...filteredEpochs,
                    columnVisibility: filteredEpochs.columnVisibility.filter(
                      (value) => value !== epochIndex
                    )
                  });
                }
              };

              /**
               *
               */
              const handleEditClick = () => {
                setCurrentAnnotation(epoch);
                setRightPanel('annotationForm');
                const startTime = epoch.onset;
                const endTime = epoch.duration + startTime;
                setTimeSelection([startTime, endTime]);
              };
              const channelNamesInView = channelMetadata.filter((_, index) => {
                return channels.map((channel) => channel.index).includes(index)
              }).map(metadata => metadata.name);

              return filteredEpochs.searchVisibility.includes(epochIndex) && (
                <div
                  key={epochIndex}
                  className={
                    'list-group-item list-group-item-action container-fluid panel-event'
                    + (
                      epoch.channels && epoch.channels.length > 0
                        ? '-channel-based'
                        : ''
                    )
                  }
                  style={{
                    position: 'relative',
                  }}
                  onMouseEnter={() => updateActiveEpoch(epochIndex)}
                  onMouseLeave={() => updateActiveEpoch(null)}
                >
                  <div
                    className="row epoch-details"
                  >
                    <div className="epoch-label">
                      {
                        activeLabel === 'trial_type'
                          ? epoch.trialType ?? 'n/a'
                          : activeLabel === 'HED'
                            ? [
                                ...epoch.hed,
                                ...getTagsForEpoch(epoch, datasetTags, hedSchema),
                              ].length > 0
                                ? buildHEDString([
                                    ...epoch.hed,
                                    ...getTagsForEpoch(epoch, datasetTags, hedSchema),
                                  ]).join(', ')
                                : 'n/a'
                            : epoch.properties.find((prop) => prop.PropertyName === activeLabel)
                              ?.PropertyValue ?? 'n/a'
                      }
                      <br/>
                      {Math.round(epoch.onset * 1000) / 1000}
                      {epoch.duration > 0
                        && ' - '
                        + (Math.round((epoch.onset + epoch.duration) * 1000) / 1000)
                      }
                      <br/>
                      {
                        (epoch.channels.length === 0)
                          ? ''  // 'All channels'
                          : epoch.channels
                            .sort((channelA, channelB) => {
                              return channelMetadata.findIndex(channel => channel.name === channelA)
                                - channelMetadata.findIndex(channel => channel.name === channelB);
                            })
                            .map((channel, i) => {
                            return <span
                              key={`span-${channel}-${i}`}
                              style={{
                              fontWeight: channelNamesInView.includes(channel)
                                ? 'normal' : 'lighter'
                            }}>
                              {i > 0 && <>{channelDelimiter}&nbsp;</>}
                              {channel}
                            </span>
                          })
                      }
                    </div>
                    <div
                      className="epoch-action"
                    >
                      <button
                        type="button"
                        className={(epochVisible ? '' : 'active ')
                          + 'btn btn-xs btn-primary'}
                        onClick={() => toggleEpoch(epochIndex)}
                      >
                        <i className={
                          'glyphicon glyphicon-eye-'
                          + (epochVisible ? 'open' : 'close')
                        }></i>
                      </button>
                      <button
                        type="button"
                        className={'btn btn-xs btn-primary'}
                        onClick={() => {
                          // setActiveItemIndex(i);
                          jumpToEpoch(epoch);
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
                          {epoch.properties.length > 0 ||
                          epoch.hed.length > 0 ||
                          getTagsForEpoch(epoch, datasetTags, hedSchema).length > 0 ||
                          epoch.channels.length > 0
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
                        epoch.type === 'Event' &&
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
                  {(hedVisible /*&& (
                      epoch.properties.length > 0 ||
                      epoch.hed ||
                      epoch.channels.length > 0
                    )*/
                  ) &&
                    <div className="epoch-tag">
                      {/*{epoch.channels.length > 0 &&*/}
                      {/*  <div><strong>Channel(s) </strong>*/}
                      {/*    {epoch.channels.join(channelDelimiter)}*/}
                      {/*  </div>*/}
                      {/*}*/}
                      <div>
                        <code className='event-label'>
                          trial_type
                        </code>
                        &nbsp;
                        <span>
                          {epoch.trialType}
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
                            epoch.channels.length > 0
                              ? epoch.channels.map((channel, i) => {
                                return <React.Fragment key={`epoch-channel-${channel}-${i}`}>
                                  {i > 0 && <>{channelDelimiter}&nbsp;</>}
                                  {channel}
                                </React.Fragment>;
                              })
                              : 'n/a'
                          }
                        </span>
                      </div>
                      {epoch.properties.length > 0 &&
                        <div><strong>Additional Columns </strong>
                          {
                            epoch.properties.map((property) => {
                              return <div>
                                <code className='event-label'>
                                  {property.PropertyName}
                                </code>
                                &nbsp;
                                <span>
                                  {property.PropertyValue}
                                </span>
                              </div>
                            })
                          }
                        </div>
                      }
                      {
                        <div><strong>HED </strong>
                          {
                            [
                              ...epoch.hed,
                              ...getTagsForEpoch(epoch, datasetTags, hedSchema)
                            ].length > 0
                              ? (
                                buildHEDString([
                                  ...epoch.hed,
                                  ...getTagsForEpoch(epoch, datasetTags, hedSchema),
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
};

EventManager.defaultProps = {};

export default connect(
  (state: RootState)=> ({
    timeSelection: state.timeSelection,
    epochs: state.dataset.epochs,
    filteredEpochs: state.dataset.filteredEpochs,
    rightPanel: state.rightPanel,
    domain: state.bounds.domain,
    interval: state.bounds.interval,
    viewerHeight: state.bounds.viewerHeight,
    hedSchema: state.dataset.hedSchema,
    datasetTags: state.dataset.datasetTags,
    channelDelimiter: state.dataset.channelDelimiter,
    channels: state.channels, // TODO: merge with below and pass?
    channelMetadata: state.dataset.channelMetadata,
    tagsHaveChanges: state.dataset.tagsHaveChanges,
  }),
  (dispatch: (_: any) => void) => ({
    setCurrentAnnotation: R.compose(
      dispatch,
      setCurrentAnnotation
    ),
    setTimeSelection: R.compose(
      dispatch,
      setTimeSelection
    ),
    setRightPanel: R.compose(
      dispatch,
      setRightPanel
    ),
    toggleEpoch: R.compose(
      dispatch,
      toggleEpoch
    ),
    updateActiveEpoch: R.compose(
      dispatch,
      updateActiveEpoch
    ),
    setFilteredEpochs: R.compose(
      dispatch,
      setFilteredEpochs
    ),
    setInterval: R.compose(
      dispatch,
      setInterval
    ),
  })
)(EventManager);
