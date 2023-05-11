import React, {useState, useEffect} from 'react';
import {setCurrentAnnotation} from '../store/state/currentAnnotation';
import {MAX_RENDERED_EPOCHS} from '../../vector';
import {
  getEpochsInRange,
  toggleEpoch,
  updateActiveEpoch,
} from '../store/logic/filterEpochs';
import {Epoch as EpochType, RightPanel} from '../store/types';
import {connect} from 'react-redux';
import {setTimeSelection} from '../store/state/timeSelection';
import {setRightPanel} from '../store/state/rightPanel';
import * as R from 'ramda';
import {RootState} from '../store';
import {setFilteredEpochs} from '../store/state/dataset';

type CProps = {
  timeSelection?: [number, number],
  epochs: EpochType[],
  filteredEpochs: number[],
  rightPanel: RightPanel,
  setCurrentAnnotation: (_: EpochType) => void,
  setTimeSelection: (_: [number, number]) => void,
  setRightPanel: (_: RightPanel) => void,
  toggleEpoch: (_: number) => void,
  updateActiveEpoch: (_: number) => void,
  setFilteredEpochs: (_: number[]) => void,
  interval: [number, number],
  viewerHeight: number,
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
}: CProps) => {
  const [epochType, setEpochType] = useState((rightPanel
    && rightPanel !== 'annotationForm'
    && rightPanel === 'eventList') ?
    'Event' : 'Annotation');

  const [activeEpochs, setActiveEpochs] = useState([]);
  const [epochsInRange, setEpochsInRange] = useState(
    getEpochsInRange(epochs, interval, epochType)
  );
  const [allEpochsVisible, setAllEpochsVisibility] = useState(() => {
    if (epochsInRange.length < MAX_RENDERED_EPOCHS) {
      return epochsInRange.some((index) => {
        return !filteredEpochs.includes(index);
      });
    }
    return true;
  });
  const [visibleComments, setVisibleComments] = useState([]);
  const [allCommentsVisible, setAllCommentsVisible] = useState(false);
  const totalEpochs = epochs.filter(
    (epoch) => epoch.type === epochType
  ).length;

  // Update window visibility state
  useEffect(() => {
    setEpochsInRange(getEpochsInRange(epochs, interval, epochType));
    if (epochsInRange.length < MAX_RENDERED_EPOCHS) {
      setAllEpochsVisibility(!epochsInRange.some((index) => {
        return !filteredEpochs.includes(index);
      })); // If one or more event isn't visible, set to be able to reveal all
    } else {
      setAllEpochsVisibility(false);
    }
  }, [filteredEpochs, interval]);

  useEffect(() => {
    // Toggle comment section if in range and has a comment / tag
    if (!allCommentsVisible) {
      setVisibleComments([]);
    } else {

      const commentIndexes = getEpochsInRange(epochs, interval, epochType, true)
        .map((index) => index);
      setVisibleComments([...commentIndexes]);
    }
  }, [allCommentsVisible]);

  useEffect(() => {
    setEpochType((rightPanel
      && rightPanel !== 'annotationForm'
      && rightPanel === 'eventList') ?
      'Event' : 'Annotation');
  }, [rightPanel]);

  /**
   *
   * @param visible
   */
  const setEpochsInViewVisibility = (visible) => {
    if (epochsInRange.length < MAX_RENDERED_EPOCHS) {
      epochsInRange.map((index) => {
        if ((visible && !filteredEpochs.includes(index))
          || (!visible && filteredEpochs.includes(index))) {
          toggleEpoch(index);
        }
      });
    }
  };

  const visibleEpochsInRange = epochsInRange.filter(
    (epochIndex) => filteredEpochs.includes(epochIndex)
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
            {`${epochType}s&nbsp;
            (${visibleEpochsInRange.length}/${epochsInRange.length})`}
          </strong>
          <span style={{fontSize: '0.75em'}}>
            <br />in timeline view [Total: {totalEpochs}]
          </span>
        </p>
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <i
            className={
              'glyphicon glyphicon-eye-'
              + (allEpochsVisible ? 'open' : 'close')
            }
            style={{padding: '0.5em'}}
            onClick={() => setEpochsInViewVisibility(!allEpochsVisible)}

          ></i>
          <i
            className={'glyphicon glyphicon-tags'}
            style={{padding: '0.5em'}}
            onClick={() => setAllCommentsVisible(!allCommentsVisible)}
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
          {epochsInRange.map((index) => {
            const epoch = epochs[index];
            const visible = filteredEpochs.includes(index);

            /**
             *
             */
            const handleCommentVisibilityChange = () => {
              if (!visibleComments.includes(index)) {
                setVisibleComments([
                  ...visibleComments,
                  index,
                ]);
              } else {
                setVisibleComments(visibleComments.filter(
                  (value) => value !== index
                ));
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
                key={index}
                className={
                  (epoch.type == 'Annotation' ? 'annotation ' : '')
                  + 'list-group-item list-group-item-action'
                }
              >
                <div
                  className="epoch-details"
                >
                  {epoch.label} <br/>
                  {Math.round(epoch.onset * 1000) / 1000}
                  {epoch.duration > 0
                    && ' - '
                    + (Math.round((epoch.onset + epoch.duration) * 1000) / 1000)
                  }
                </div>
                <div
                  className="epoch-action"
                >
                  {epoch.type === 'Annotation' &&
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
                  <button
                    type="button"
                    className={(visible ? '' : 'active ')
                      + 'btn btn-xs btn-primary'}
                    onClick={() => toggleEpoch(index)}
                  >
                    <i className={
                      'glyphicon glyphicon-eye-'
                      + (visible ? 'open' : 'close')
                    }></i>
                  </button>
                  {(epoch.comment || epoch.hed) &&
                    <button
                      type="button"
                      className={'btn btn-xs btn-primary'}
                      onClick={() => handleCommentVisibilityChange()}
                    >
                      <i className={'glyphicon glyphicon-tags'}></i>
                    </button>
                  }
                </div>
                {visibleComments.includes(index) &&
                  <div className="epoch-tag">
                    {epoch.type == 'Annotation' && epoch.comment &&
                      <p><strong>Comment: </strong>{epoch.comment}</p>
                    }
                    {epoch.type == 'Event' && epoch.hed &&
                      <p><strong>HED: </strong>{epoch.hed}</p>
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
  filteredEpochs: [],
};

export default connect(
  (state: RootState)=> ({
    timeSelection: state.timeSelection,
    epochs: state.dataset.epochs,
    filteredEpochs: state.dataset.filteredEpochs,
    rightPanel: state.rightPanel,
    interval: state.bounds.interval,
    viewerHeight: state.bounds.viewerHeight,
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
