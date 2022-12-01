import React, {useEffect, useState} from 'react';
import {
  AnnotationMetadata,
  Epoch as EpochType,
  RightPanel,
} from '../store/types';
import {connect} from 'react-redux';
import {setTimeSelection} from '../store/state/timeSelection';
import {setRightPanel} from '../store/state/rightPanel';
import * as R from 'ramda';
import {toggleEpoch, updateActiveEpoch} from '../store/logic/filterEpochs';
import {RootState} from '../store';
import {setEpochs} from '../store/state/dataset';
import {setCurrentAnnotation} from '../store/state/currentAnnotation';
import {NumericElement, SelectElement, TextareaElement} from './Form';
import swal from 'sweetalert2';

type CProps = {
  timeSelection?: [number, number],
  epochs: EpochType[],
  filteredEpochs: number[],
  setTimeSelection: (_: [number, number]) => void,
  setRightPanel: (_: RightPanel) => void,
  setEpochs: (_: EpochType[]) => void,
  currentAnnotation: EpochType,
  setCurrentAnnotation: (_: EpochType) => void,
  physioFileID: number,
  annotationMetadata: AnnotationMetadata,
  toggleEpoch: (_: number) => void,
  updateActiveEpoch: (_: number) => void,
  interval: [number, number],
};

const AnnotationForm = ({
  timeSelection,
  epochs,
  setTimeSelection,
  setRightPanel,
  setEpochs,
  currentAnnotation,
  setCurrentAnnotation,
  physioFileID,
  annotationMetadata,
  interval,
}: CProps) => {
  const [startEvent = '', endEvent = ''] = timeSelection || [];
  const [event, setEvent] = useState([startEvent, endEvent]);
  const [label, setLabel] = useState(
    currentAnnotation ?
    currentAnnotation.label :
    null
  );
  const [comment, setComment] = useState(
    currentAnnotation ?
    currentAnnotation.comment :
    ''
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [annoMessage, setAnnoMessage] = useState('');

  // Time Selection
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

  const handleStartTimeChange = (id, val) => {
    const value = parseInt(val);
    setEvent([value, event[1]]);

    if (validate([value, event[1]])) {
      let endTime = event[1];
      if (typeof endTime === 'string') {
        endTime = parseInt(endTime);
      }
      setTimeSelection(
        [
          value || null,
          endTime || null,
        ]
      );
    }
  };

  const handleEndTimeChange = (name, val) => {
    const value = parseInt(val);
    setEvent([event[0], value]);

    if (validate([event[0], value])) {
      let startTime = event[0];
      if (typeof startTime === 'string') {
        startTime = parseInt(startTime);
      }
      setTimeSelection(
        [
          startTime || null,
          value,
        ]
      );
    }
  };

  const handleLabelChange = (name, value) => {
    setLabel(value);
  };
  const handleCommentChange = (name, value) => {
    setComment(value);
  };
  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const handleReset = () => {
    // Clear all fields
    setEvent(['', '']);
    setTimeSelection([null, null]);
    setLabel('');
    setComment('');
  };

  const handleDelete = () => {
    setIsDeleted(true);
  };

  // Submit
  useEffect(() => {
    // only proceed if isSubmitted === true
    if (!isSubmitted) {
      return;
    }

    // Validate inputs
    if (!label || !event[0] || !event[1]) {
      swal.fire(
        'Warning',
        'Please fill out all required fields',
        'warning'
      );
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

    // set body
    // instance_id = null for new annotations
    const body = {
      physioFileID: physioFileID,
      instance_id: currentAnnotation ?
        currentAnnotation.annotationInstanceID :
        null,
      instance: {
        onset: startTime,
        duration: duration,
        label_name: label,
        label_description: label,
        channels: 'all',
        description: comment,
      },
    };

    const newAnnotation : EpochType = {
      onset: startTime,
      duration: duration,
      type: 'Annotation',
      label: label,
      comment: comment,
      channels: 'all',
      annotationInstanceID: currentAnnotation ?
        currentAnnotation.annotationInstanceID :
        null,
    };

    fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify(body),
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
    }).then((data) => {
      setIsSubmitted(false);

      // if in edit mode, remove old annotation instance
      if (currentAnnotation !== null) {
        epochs.splice(epochs.indexOf(currentAnnotation), 1);
      } else {
        newAnnotation.annotationInstanceID = parseInt(data.instance_id);
      }
      epochs.push(newAnnotation);
      setEpochs(
        epochs
        .sort(function(a, b) {
          return a.onset - b.onset;
        })
      );

      // Reset Form
      handleReset();

      // Display success message
      setAnnoMessage(currentAnnotation ?
        'Annotation Updated!' :
        'Annotation Added!');
      setTimeout(() => {
        setAnnoMessage(''); // Empty string will cause success div to hide

        // If in edit mode, switch back to annotation panel
        if (currentAnnotation !== null) {
          setCurrentAnnotation(null);
          setRightPanel('annotationList');
        }
      }, 3000);
    }).catch((error) => {
      console.error(error);
      // Display error message
      swal.fire(
        'Error',
        'Something went wrong!',
        'error'
      );
    });
  }, [isSubmitted]);

  // Delete
  useEffect(() => {
    if (isDeleted) {
      const url = window.location.origin
                  + '/electrophysiology_browser/annotations/';
      const body = {
        physioFileID: physioFileID,
        instance_id: currentAnnotation ?
          currentAnnotation.annotationInstanceID :
          null,
      };

      swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        // if isConfirmed
        if (result.value) {
          fetch(url, {
            method: 'DELETE',
            credentials: 'same-origin',
            body: JSON.stringify(body),
          }).then((response) => {
            if (response.ok) {
              setIsDeleted(false);

              epochs.splice(epochs.indexOf(currentAnnotation), 1);
              setEpochs(
                epochs
                  .sort(function(a, b) {
                    return a.onset - b.onset;
                  })
              );

              // Reset Form
              handleReset();

              // Display success message
              swal.fire(
                'Success',
                'Annotation Deleted!',
                'success'
              );

              // If in edit mode, switch back to annotation panel
              if (currentAnnotation !== null) {
                setCurrentAnnotation(null);
                setRightPanel('annotationList');
              }
            }
          }).catch((error) => {
            console.error(error);
            // Display error message
            swal.fire(
              'Error',
              'Something went wrong!',
              'error'
            );
          });
        } else {
          setIsDeleted(false);
        }
      });
    }
  }, [isDeleted]);

  let labelOptions = {};
  annotationMetadata.labels.map((label) => {
    labelOptions = {
      ...labelOptions,
      [label.LabelName]: label.LabelName,
    };
  });

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
        {currentAnnotation ? 'Edit' : 'Add'} Annotation
        <i
          className='glyphicon glyphicon-remove'
          style={{cursor: 'pointer'}}
          onClick={() => {
            setRightPanel('annotationList');
            setCurrentAnnotation(null);
            setTimeSelection(null);
          }}
        ></i>
      </div>
      <div className="panel-body">
        <div className="form-row no-gutters">
          <NumericElement
            name="start-time"
            id="start-time"
            min="0"
            label="Start Time"
            value={event[0]}
            required={true}
            onUserInput={handleStartTimeChange}
          />
          <NumericElement
              name="end-time"
              id="end-time"
              min="0"
              label="End Time"
              value={event[1]}
              required={true}
              onUserInput={handleEndTimeChange}
          />
          <SelectElement
            name="label"
            id="label"
            label="Label"
            value={label}
            options={labelOptions}
            required={true}
            onUserInput={handleLabelChange}
          />
          <TextareaElement
            name="comment"
            id="comment"
            label="Comment"
            value={comment}
            onUserInput={handleCommentChange}
          />
          <button
            type="submit"
            disabled={isSubmitted}
            onClick={handleSubmit}
            className="btn btn-primary btn-xs"
          >
            Submit
          </button>
          <button type="reset"
            onClick={handleReset}
            className="btn btn-primary btn-xs"
          >
            Clear
          </button>
          {currentAnnotation &&
            <button
              type="button"
              onClick={handleDelete}
              className="btn btn-primary btn-xs"
            >
              Delete
            </button>
          }
          {annoMessage && (
            <div
              className="alert alert-success text-center"
              role="alert"
              style={{margin: '5px'}}
            >
              {annoMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

AnnotationForm.defaultProps = {
  timeSelection: null,
  epochs: [],
  filteredEpochs: [],
  currentAnnotation: null,
};

export default connect(
  (state: RootState)=> ({
    timeSelection: state.timeSelection,
    epochs: state.dataset.epochs,
    filteredEpochs: state.dataset.filteredEpochs,
    currentAnnotation: state.currentAnnotation,
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
    setEpochs: R.compose(
      dispatch,
      setEpochs
    ),
    setCurrentAnnotation: R.compose(
      dispatch,
      setCurrentAnnotation
    ),
  })
)(AnnotationForm);
