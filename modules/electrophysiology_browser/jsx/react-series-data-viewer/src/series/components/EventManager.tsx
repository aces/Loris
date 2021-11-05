import React from 'react';
import {Epoch as EpochType, RightPanel} from '../store/types';
import {connect} from 'react-redux';
import {setTimeSelection} from '../store/state/timeSelection';
import {setRightPanel} from '../store/state/rightPanel';
import * as R from 'ramda';
import {toggleEpoch, updateActiveEpoch} from '../store/logic/filterEpochs';
import {RootState} from '../store';

type CProps = {
  timeSelection?: [number, number],
  epochs: EpochType[],
  filteredEpochs: number[],
  setTimeSelection: (_: [number, number]) => void,
  setRightPanel: (_: RightPanel) => void,
  toggleEpoch: (_: number) => void,
  updateActiveEpoch: (_: number) => void,
  interval: [number, number],
};

const EventManager = ({
  epochs,
  filteredEpochs,
  setTimeSelection,
  setRightPanel,
  toggleEpoch,
  updateActiveEpoch,
  interval,
}: CProps) => {
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
        Events / Annotations
        in timeline view
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
          ).map((index) => {
            const epoch = epochs[index];
            const visible = filteredEpochs.includes(index);

            return (
              <div
                key={index}
                className={
                  (epoch.type == 'Annotation' ? 'annotation ' : '')
                  + 'list-group-item list-group-item-action'
                }
                style={{
                  position: 'relative',
                }}
              >
                {epoch.label} <br/>
                {epoch.onset}{epoch.duration > 0
                && ' - ' + (epoch.onset + epoch.duration)}
                <button
                  type="button"
                  className={(visible ? '' : 'active ')
                    + 'btn btn-xs btn-primary'}
                  onClick={() => toggleEpoch(index)}
                  onMouseEnter={() => updateActiveEpoch(index)}
                  onMouseLeave={() => updateActiveEpoch(null)}
                  style={{
                    position: 'absolute',
                    right: '15px',
                    top: '15px',
                    display: 'block',
                  }}
                >
                  <i className={
                    'glyphicon glyphicon-eye-'
                    + (visible ? 'open' : 'close')
                  }></i>
                </button>
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
