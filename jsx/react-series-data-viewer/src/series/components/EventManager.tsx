import React, {useState, useEffect} from 'react';
import {Epoch as EpochType, RightPanel} from '../store/types';
import {connect} from 'react-redux';
import {setTimeSelection} from '../store/state/timeSelection';
import {setRightPanel} from '../store/state/rightPanel';
import * as R from 'ramda';
import {toggleEpoch, updateActiveEpoch, updateFilteredEpochs} from '../store/logic/filterEpochs';
import {RootState} from '../store';

type CProps = {
  timeSelection?: [number, number],
  epochs: EpochType[],
  filteredEpochs: number[],
  rightPanel: RightPanel,
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
  setTimeSelection,
  setRightPanel,
  toggleEpoch,
  updateActiveEpoch,
  interval,
}: CProps) => {
  const epochType = (rightPanel && rightPanel !== 'annotationForm' && rightPanel === 'eventList') ? 'Event' : 'Annotation';
  const [allEpochsVisible, setAllEpochsVisibility] = useState(false);

  useEffect(() => {
    // Reset: turn all epochs on / off regardless of independent toggle state
    [...Array(epochs.length).keys()].filter((index) =>
      epochs[index].onset + epochs[index].duration > interval[0]
      && epochs[index].onset < interval[1]
      && epochs[index].type === epochType
    ).map((index) => {
      if ((!allEpochsVisible && filteredEpochs.includes(index))
        || (allEpochsVisible && !filteredEpochs.includes(index))
      ) {
        toggleEpoch(index);
      }
    });
  }, [allEpochsVisible]);

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
        {`${epochType}s in timeline view`}
        <i
          className={
            'glyphicon glyphicon-eye-'
            + (allEpochsVisible ? 'open' : 'close')
          }
          onClick={() => setAllEpochsVisibility(!allEpochsVisible)}
        ></i>
        <i
          className='glyphicon glyphicon-remove'
          style={{cursor: 'pointer'}}
          onClick={() => {
            setRightPanel(null);
          }}
        ></i>
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
            let commentVisible = false;

            return (
              <>
                <div
                  key={index}
                  className={
                    (epoch.type == 'Annotation' ? 'annotation ' : '')
                    + 'list-group-item list-group-item-action'
                  }
                  style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'sapce-between',
                    alignItems: 'center',
                  }}
                >
                  <div className="epoch-details">
                    {epoch.label} <br/>
                    {epoch.onset}{epoch.duration > 0
                      && ' - ' + (epoch.onset + epoch.duration)}
                  </div>
                  <div
                    className="epoch-action"
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      position: 'absolute',
                      right: '15px',
                    }}
                  >
                    {epoch.type === 'Annotation' &&
                      <button
                        type="button"
                        className={'btn btn-xs btn-primary'}
                        //onClick={}
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
                        onClick={() => commentVisible = !commentVisible}
                      >
                        <i className={
                          'glyphicon glyphicon-collapse-'
                          + (commentVisible ? 'up' : 'down')
                        }></i>
                      </button>
                    }
                  </div>
                </div>
                {commentVisible && epoch.comment &&
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
