import React, {useEffect, useState} from 'react';
import {Epoch as EpochType, RightPanel} from '../store/types';
import {connect, DefaultRootState} from 'react-redux';
import {setTimeSelection} from '../store/state/timeSelection';
import {setRightPanel} from '../store/state/rightPanel';
import * as R from 'ramda';
import {toggleEpoch, updateActiveEpoch} from '../store/logic/filterEpochs';
import {RootState} from '../store';
// ##################### EEGNET OVERRIDE START ################## //
import {setEpochs} from '../store/state/dataset';
// ##################### EEGNET OVERRIDE END ################## //

type CProps = {
  timeSelection?: [number, number],
  epochs: EpochType[],
  filteredEpochs: number[],
  setTimeSelection: (_: [number, number]) => void,
  setRightPanel: (_: RightPanel) => void,
  // ##################### EEGNET OVERRIDE START ################## //
  setEpochs: (_: EpochType[]) => void,
  // ##################### EEGNET OVERRIDE END ################## //
  toggleEpoch: (_: number) => void,
  updateActiveEpoch: (_: number) => void,
  interval: [number, number],
};

const AnnotationForm = ({
  timeSelection,
  epochs,
  filteredEpochs,
  setTimeSelection,
  setRightPanel,
  // ##################### EEGNET OVERRIDE START ################## //
  setEpochs,
  // ##################### EEGNET OVERRIDE END ################## //
  toggleEpoch,
  updateActiveEpoch,
  interval,
}: CProps) => {
  const [startEvent = '', endEvent = ''] = timeSelection || [];
  let [event, setEvent] = useState([startEvent, endEvent]);
  // ##################### EEGNET OVERRIDE START ################## //
  let [label, setLabel] = useState('');
  let [comment, setComment] = useState('');
  let [isSubmitted, setIsSubmitted] = useState(false);
  // ##################### EEGNET OVERRIDE END ################## //

  useEffect(() => {
    const [startEvent = '', endEvent = ''] = timeSelection || [];
    setEvent([startEvent, endEvent]);
  }, [timeSelection]);

  const validate = (event) => (
    (event[0] || event[0] === 0)
      && (event[1] || event[1] === 0)
      && event[0] <= event[1]
      && event[0] >= interval[0] && event[0] <= interval[1]
      && event[1] >= interval[0] && event[1] <= interval[1]
  );

   // ##################### EEGNET OVERRIDE START ################## //
  const handleLabelChange = (e) => {
    setLabel(e.target.value);
  };
  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };
  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  useEffect(() => {
    // only proceed if isSubmitted === true
    if (!isSubmitted) {
      return;
    }

    // Validate inputs
    if (!label || !comment || !event[0] || !event[1]) {
      // TODO: Display message
      setIsSubmitted(false);
      return;
    }

    const url = window.location.origin +
      '/electrophysiology_browser/annotations/';

    // get duration of annotation
    let startTime = event[0];
    let endTime = event[1];
    if (typeof startTime === 'string') {
      startTime = parseInt(startTime);
    }
    if (typeof endTime === 'string') {
      endTime = parseInt(endTime);
    }
    const duration = endTime - startTime;

    // get sessionID from path
    const sessionID = window.location.pathname.split('/')[3];

    // set body
    // instance_id = null for new annotations, 
    // should be updated when we implement annotation editing
    const body = {
      sessionID: sessionID,
      instance_id: null,
      instance: {
        onset: startTime,
        duration: duration,
        label_name: label,
        label_description: label,
        channels: 'all',
        description: comment,
      },
      // TODO: Figure out data that should go here
      metadata: {
        description: 'An annotation',
        sources: 'LORIS',
        author: 'LORIS user',
      },
    };

    const newAnnotation : EpochType = {
      onset: startTime,
      duration: duration,
      type: 'Annotation',
      label: label,
      comment: comment,
      channels: 'all'
    };

    fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify(body),
    }).then(response => {
      if (response.ok) {
        setIsSubmitted(false);
        epochs.push(newAnnotation);
        setEpochs(
          epochs
          .sort(function(a, b) {
            return a.onset - b.onset;
          })
        );
      }
    }).catch(error => {
      console.log(error);
    }) 
  }, [isSubmitted]);
   // ##################### EEGNET OVERRIDE END ################## //

  return (
    <div
      className="panel panel-primary"
      id='new_annotation'
    >
      <div
        className="panel-heading"
        style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
      >
        New Annotation
        <i
          className='glyphicon glyphicon-remove'
          style={{cursor: 'pointer'}}
          onClick={() => {
            setRightPanel(null);
          }}
        ></i>
      </div>
      <div className="panel-body">
        <div className="form-row no-gutters">
          <div className="form-group">
            <label htmlFor="start-time">Start time</label>
            <input
              type="number"
              className="form-control input-sm"
              id="start-time"
              placeholder="Start time"
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setEvent([value, event[1]]);

                if (validate([value, event[1]])) {
                  let endTime = event[1];
                  if (typeof endTime === 'string'){
                    endTime = parseInt(endTime);
                  }
                  setTimeSelection(
                    [
                      value || null,
                      endTime || null,
                    ]
                  );
                }
              }}
              value={event[0]}
            />
          </div>
          <div className="form-group">
            <label htmlFor="end-time">End time</label>
            <input
              type="number"
              className="form-control input-sm"
              id="end-time"
              placeholder="End time"
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setEvent([event[0], value]);

                if (validate([event[0], value])) {
                  let startTime = event[0];
                  if (typeof startTime === 'string'){
                    startTime = parseInt(startTime);
                  }
                  setTimeSelection(
                    [
                      startTime || null,
                      value
                    ]
                  );
                }
              }}
              value={event[1]}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="label">Label</label>
          <select className="form-control input-sm" id="label" onChange={handleLabelChange}>
            <option></option>
            <option>Artifact</option>
            <option>Motion</option>
            <option>Flux jump</option>
            <option>Line noise</option>
            <option>Muscle</option>
            <option>Epilepsy interictal</option>
            <option>Epilepsy preictal</option>
            <option>Epilepsy seizure</option>
            <option>Epilepsy postictal</option>
            <option>Epileptiform</option>
            <option>Epileptiform single</option>
            <option>Epileptiform run</option>
            <option>Eye blink</option>
            <option>Eye movement</option>
            <option>Eye fixation</option>
            <option>Sleep N1</option>
            <option>Sleep N2</option>
            <option>Sleep N3</option>
            <option>Sleep REM</option>
            <option>Sleep wake</option>
            <option>Sleep spindle</option>
            <option>Sleep k-complex</option>
            <option>Score labeled</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="comment">Comment</label>
          <textarea
            className="form-control"
            id="comment"
            rows={3}
            onChange={handleCommentChange}
          ></textarea>
        </div>
        <button type="submit" disabled={isSubmitted} onClick={handleSubmit} className="btn btn-primary btn-xs">
          Submit
        </button>
      </div>
    </div>
  );
};

AnnotationForm.defaultProps = {
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
  (dispatch: (any) => void) => ({
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
    // ##################### EEGNET OVERRIDE START ################## //
    setEpochs: R.compose(
      dispatch,
      setEpochs
    ),
    // ##################### EEGNET OVERRIDE END ################## //
  })
)(AnnotationForm);
