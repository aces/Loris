// ##################### EEGNET OVERRIDE START ################## //
import React, {useState, useEffect} from 'react';
import {setCurrentAnnotation} from '../store/state/currentAnnotation';
import {MAX_RENDERED_EPOCHS} from '../../vector';
import {toggleEpoch, updateActiveEpoch, updateFilteredEpochs} from '../store/logic/filterEpochs';
// ##################### EEGNET OVERRIDE END ################## //
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
  // ##################### EEGNET OVERRIDE START ################## //
  rightPanel: RightPanel,
  setCurrentAnnotation: (_: EpochType) => void,
  // ##################### EEGNET OVERRIDE END ################## //
  setTimeSelection: (_: [number, number]) => void,
  setRightPanel: (_: RightPanel) => void,
  toggleEpoch: (_: number) => void,
  updateActiveEpoch: (_: number) => void,
  interval: [number, number],
};

const EventManager = ({
  epochs,
  filteredEpochs,
  // ##################### EEGNET OVERRIDE START ################## //
  rightPanel,
  setCurrentAnnotation,
  // ##################### EEGNET OVERRIDE END ################## //
  setTimeSelection,
  setRightPanel,
  toggleEpoch,
  updateActiveEpoch,
  interval,
}: CProps) => {
  // ##################### EEGNET OVERRIDE START ################## //
  const [epochType, setEpochType] = useState((rightPanel
    && rightPanel !== 'annotationForm'
    && rightPanel === 'eventList') ?
    'Event' : 'Annotation');
  const [activeEpochs, setActiveEpochs] = useState([]);
  const [allEpochsVisible, setAllEpochsVisibility] = useState(false);
  const [visibleComments, setVisibleComments] = useState([]);

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
                    {epoch.type === 'Annotation' && epoch.comment &&
                      <button
                        type="button"
                        className={'btn btn-xs btn-primary'}
                        onClick={() => handleCommentVisibilityChange()}
                      >
                        <i className={
                          'glyphicon glyphicon-chevron-'
                          + (visibleComments.includes(index) ? 'up' : 'down')
                        }></i>
                      </button>
                    }
                  </div>
                </div>
                {visibleComments.includes(index) && epoch.comment &&
                  <div
                    className='list-group-item list-group-item-action'
                  >
                    <strong>Comment:</strong>  {epoch.comment}
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
// ##################### EEGNET OVERRIDE END ################## //

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
    // ##################### EEGNET OVERRIDE START ################## //
    rightPanel: state.rightPanel,
    // ##################### EEGNET OVERRIDE END ################## //
    interval: state.bounds.interval,
  }),
  (dispatch: (_: any) => void) => ({
    // ##################### EEGNET OVERRIDE START ################## //
    setCurrentAnnotation: R.compose(
      dispatch,
      setCurrentAnnotation
    ),
    // ##################### EEGNET OVERRIDE END ################## //
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
