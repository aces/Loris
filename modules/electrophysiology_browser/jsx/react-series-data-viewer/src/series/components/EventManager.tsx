import React, {useState, useEffect} from 'react';
import {setCurrentAnnotation} from '../store/state/currentAnnotation';
import {MAX_RENDERED_EPOCHS} from '../../vector';
import {
  buildHEDString,
  getEpochsInRange,
  getTagsForEpoch,
  toggleEpoch,
  updateActiveEpoch,
} from '../store/logic/filterEpochs';
import {Epoch as EpochType, EpochFilter, HEDTag, HEDSchemaElement, RightPanel} from '../store/types';
import {connect} from 'react-redux';
import {setTimeSelection} from '../store/state/timeSelection';
import {setRightPanel} from '../store/state/rightPanel';
import * as R from 'ramda';
import {RootState} from '../store';
import {setFilteredEpochs} from '../store/state/dataset';

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
  interval: [number, number],
  viewerHeight: number,
  hedSchema: HEDSchemaElement[],
  datasetTags: any,
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
 * @param root0.interval
 * @param root0.viewerHeight
 * @param root0.hedSchema
 * @param root0.datasetTags
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
  interval,
  viewerHeight,
  hedSchema,
  datasetTags,
}: CProps) => {
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

  // Update window visibility state
  useEffect(() => {
    const updatedEpochs = getEpochsInRange(epochs, interval);

    if (updatedEpochs.length > 0 && updatedEpochs.length < MAX_RENDERED_EPOCHS) {
      setAllEpochsVisibility(!updatedEpochs.some((index) => {
        return !filteredEpochs.plotVisibility.includes(index);
      }));  // If one or more event isn't visible, set to be able to reveal all
    } else {
      setAllEpochsVisibility(false);
    }

    if (updatedEpochs.length > 0) {
      setAllCommentsVisible(!updatedEpochs.some((epochIndex) => {
        return (epochs[epochIndex].properties.length > 0 || epochs[epochIndex].hed)
          && !filteredEpochs.columnVisibility.includes(epochIndex);
      }));
    } else {
      setAllCommentsVisible(false);
    }

    setEpochsInRange(updatedEpochs);
  }, [filteredEpochs, interval]);


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
      plotVisibility: filteredEpochs.plotVisibility,
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

  const visibleEpochsInRange = epochsInRange.filter(
    (epochIndex) => filteredEpochs.plotVisibility.includes(epochIndex)
  );

  return (
    <div className="panel panel-primary event-list">
      <div
        className="panel-heading"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <p style={{margin: '0px'}}>
          <strong>
            {`Events (${visibleEpochsInRange.length}/${epochsInRange.length})`}
          </strong>
          <span style={{fontSize: '0.75em'}}>
            <br />in timeline view [Total: {epochs.length}]
          </span>
        </p>
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <i
            className={
              'glyphicon glyphicon-tag'
              + (allCommentsVisible ? 's' : '')}
            style={{padding: '0.5em'}}
            onClick={() => setCommentsInRangeVisibility(!allCommentsVisible)}
          ></i>
          <i
            className={
              'glyphicon glyphicon-eye-'
              + (allEpochsVisible ? 'open' : 'close')
            }
            style={{padding: '0.5em'}}
            onClick={() => setEpochsInViewVisibility(!allEpochsVisible)}
          ></i>
          <i
            className='glyphicon glyphicon-remove'
            style={{cursor: 'pointer', padding: '0.5em'}}
            onClick={() => {
              setRightPanel(null);
            }}
          ></i>
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
            marginBottom: 0,
          }}
        >
          {epochsInRange.length >= MAX_RENDERED_EPOCHS &&
            <div
              style={{
                padding: '5px',
                background: 'rgba(238, 238, 238, 0.8)',
                textAlign: 'center',
                position: 'sticky',
                top: 0,
                zIndex: 1,
              }}
            >
              Too many events to display for the timeline range.
            </div>
          }
          {epochsInRange.map((epochIndex) => {
            const epoch = epochs[epochIndex];
            const epochVisible = filteredEpochs.plotVisibility.includes(epochIndex);
            const hedVisible = filteredEpochs.columnVisibility.includes(epochIndex);

            /**
             *
             */
            const handleCommentVisibilityChange = () => {
              if (!hedVisible) {
                setFilteredEpochs({
                  plotVisibility: filteredEpochs.plotVisibility,
                  columnVisibility: [
                    ...filteredEpochs.columnVisibility,
                    epochIndex,
                  ]
                });
              } else {
                setFilteredEpochs({
                  plotVisibility: filteredEpochs.plotVisibility,
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

            return (
              <div
                key={epochIndex}
                className={
                  'annotation list-group-item list-group-item-action container-fluid'
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
                  <div className="epoch-label col-xs-8">
                    {epoch.label}
                    <br/>
                    {Math.round(epoch.onset * 1000) / 1000}
                    {epoch.duration > 0
                      && ' - '
                      + (Math.round((epoch.onset + epoch.duration) * 1000) / 1000)
                    }
                  </div>
                  <div
                    className="epoch-action col-xs-4"
                  >
                    {(epoch.properties.length > 0 || epoch.hed) &&
                      <button
                        type="button"
                        className={(hedVisible ? '' : 'active ')
                          + 'btn btn-xs btn-primary'}
                        onClick={() => handleCommentVisibilityChange()}
                      >
                        <i className={
                          'glyphicon glyphicon-tag'
                          + (hedVisible ? 's' : '')
                        }></i>
                      </button>
                    }
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
                    {epoch.type === 'Event' &&
                      <button
                        type="button"
                        className={'btn btn-xs btn-primary'}
                        onClick={() => handleEditClick()}
                      >
                        <i className={
                          'glyphicon glyphicon-edit'
                        }></i>
                      </button>
                    }
                  </div>
                </div>
                {(hedVisible && (epoch.properties.length > 0 || epoch.hed)) &&
                  <div className="epoch-tag">
                    {epoch.properties.length > 0 &&
                      <div><strong>Additional Columns: </strong>
                        {
                          epoch.properties.map((property) =>
                            `${property.PropertyName}: ${property.PropertyValue}`
                          ).join(', ')
                        }
                      </div>
                    }
                    {epoch.hed &&
                      <div><strong>HED: </strong>
                        {buildHEDString([
                          ...epoch.hed,
                          ...getTagsForEpoch(epoch, datasetTags, hedSchema),
                        ]).join(', ')}
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

EventManager.defaultProps = {
  timeSelection: null,
  epochs: [],
  filteredEpochs: {
    plotVisibility: [],
    columnVisibility: [],
  },
};

export default connect(
  (state: RootState)=> ({
    timeSelection: state.timeSelection,
    epochs: state.dataset.epochs,
    filteredEpochs: state.dataset.filteredEpochs,
    rightPanel: state.rightPanel,
    interval: state.bounds.interval,
    viewerHeight: state.bounds.viewerHeight,
    hedSchema: state.dataset.hedSchema,
    datasetTags: state.dataset.datasetTags,
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
  })
)(EventManager);
