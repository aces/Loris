import React, {useState, useEffect} from 'react';
import {setCurrentAnnotation} from '../store/state/currentAnnotation';
import {MAX_RENDERED_EPOCHS} from '../../vector';
import {toggleEpoch, updateActiveEpoch, updateFilteredEpochs} from '../store/logic/filterEpochs';
import {Epoch as EpochType, RightPanel} from '../store/types';
import {connect} from 'react-redux';
import {setTimeSelection} from '../store/state/timeSelection';
import {setRightPanel} from '../store/state/rightPanel';
import * as R from 'ramda';
import { RootState } from '../store';

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
  interval: [number, number],
};

const EventManager = ({
  epochs,
  filteredEpochs,
  rightPanel,
  setCurrentAnnotation,
  setTimeSelection,
  setRightPanel,
  toggleEpoch,
  updateActiveEpoch,
  interval,
}: CProps) => {
  const [epochType, setEpochType] = useState((rightPanel
    && rightPanel !== 'annotationForm'
    && rightPanel === 'eventList') ?
    'Event' : 'Annotation');
  const [activeEpochs, setActiveEpochs] = useState([]);
  const [allEpochsVisible, setAllEpochsVisibility] = useState(false);
  const [visibleComments, setVisibleComments] = useState([]);
  const [allCommentsVisible, setAllCommentsVisible] = useState(false);

  useEffect(() => {
    // Reset: turn all epochs on / off regardless of independent toggle state
    const epochsInRange = [...Array(epochs.length).keys()].filter((index) =>
      epochs[index].onset + epochs[index].duration > interval[0]
      && epochs[index].onset < interval[1]
      && epochs[index].type === epochType
    );
    if (epochsInRange.length < MAX_RENDERED_EPOCHS) {
      epochsInRange.map((index) => {
        if ((!allEpochsVisible && filteredEpochs.includes(index))
          || (allEpochsVisible && !filteredEpochs.includes(index))
        ) {
          toggleEpoch(index);
        }
      });
    }
  }, [allEpochsVisible]);

  useEffect(() => {
    // Toggle comment section if in range and has a comment / tag
    if (!allCommentsVisible) {
      setVisibleComments([]);
    } else {
      const commentIndexes = [...Array(epochs.length).keys()].filter((index) =>
        epochs[index].onset + epochs[index].duration > interval[0]
        && epochs[index].onset < interval[1]
        && epochs[index].type === epochType
        && (epochs[index].hed || epochs[index].comment)
      ).map((index) => index);
      setVisibleComments([...commentIndexes]);
    }
  }, [allCommentsVisible]);

  useEffect(() => {
    setEpochType((rightPanel
      && rightPanel !== 'annotationForm'
      && rightPanel === 'eventList') ?
      'Event' : 'Annotation');
  }, [rightPanel]);

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
        <p style={{ margin: '0px' }}>
          <strong>{`${epochType}s`}</strong>
          <span style={{ fontSize: '0.75em' }}>
            <br />in timeline view
          </span>
        </p>
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <i
            className={
              'glyphicon glyphicon-eye-'
              + (allEpochsVisible ? 'open' : 'close')
            }
            style={{padding: '0.5em'}}
            onClick={() => setAllEpochsVisibility(!allEpochsVisible)}
          ></i>
          <i
            className={'glyphicon glyphicon-tags'}
            style={{ padding: '0.5em' }}
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
            maxHeight: '540px',
            overflowY: 'scroll',
            marginBottom: 0,
          }}
        >
          {[...Array(epochs.length).keys()].filter((index) =>
            epochs[index].onset + epochs[index].duration > interval[0]
            && epochs[index].onset < interval[1]
            && epochs[index].type === epochType
          ).map((index) => {
            const epoch = epochs[index];
            const visible = filteredEpochs.includes(index);

            const handleCommentVisibilityChange = () => {
              if (!visibleComments.includes(index)) {
                setVisibleComments([
                  ...visibleComments,
                  index
                ]);
              } else {
                setVisibleComments(visibleComments.filter(
                  value => value !== index
                ));
              }
            }

            const handleEditClick = () => {
              setCurrentAnnotation(epoch);
              setRightPanel('annotationForm');
              const startTime = epoch.onset;
              const endTime = epoch.duration + startTime;
              setTimeSelection([startTime, endTime]);
            }

            return (
              <>
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
                    {epoch.onset}{epoch.duration > 0
                      && ' - ' + (epoch.onset + epoch.duration)}
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
                      onMouseEnter={() => updateActiveEpoch(index)}
                      onMouseLeave={() => updateActiveEpoch(null)}
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
              </>
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
  })
)(EventManager);
