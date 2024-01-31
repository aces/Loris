import React, {useEffect, useState} from 'react';
import {
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
import {NumericElement, SelectElement, TextboxElement} from './Form';
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
  toggleEpoch: (_: number) => void,
  updateActiveEpoch: (_: number) => void,
  interval: [number, number],
};

/**
 *
 * @param root0
 * @param root0.timeSelection
 * @param root0.epochs
 * @param root0.setTimeSelection
 * @param root0.setRightPanel
 * @param root0.setEpochs
 * @param root0.currentAnnotation
 * @param root0.setCurrentAnnotation
 * @param root0.physioFileID
 * @param root0.annotationMetadata
 * @param root0.toggleEpoch,
 * @param root0.updateActiveEpoch,
 * @param root0.interval
 * @param root0.toggleEpoch
 * @param root0.updateActiveEpoch
 */
const AnnotationForm = ({
  timeSelection,
  epochs,
  setTimeSelection,
  setRightPanel,
  setEpochs,
  currentAnnotation,
  setCurrentAnnotation,
  physioFileID,
  toggleEpoch,
  updateActiveEpoch,
  interval,
}: CProps) => {
  const [startEvent = '', endEvent = ''] = timeSelection || [];
  const [event, setEvent] = useState<(number | string)[]>(
    [
      startEvent,
      endEvent,
    ]
  );
  const [label, setLabel] = useState(
    currentAnnotation ?
    currentAnnotation.label :
    null
  );

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [annoMessage, setAnnoMessage] = useState('');

  // Time Selection
  useEffect(() => {
    const [startEvent = '', endEvent = ''] = timeSelection || [];
    setEvent([startEvent, endEvent]);
  }, [timeSelection]);

  /**
   *
   * @param event
   */
  const validate = (event) => (
    (event[0] || event[0] === 0)
      && (event[1] || event[1] === 0)
      && event[0] <= event[1]
  );

  /**
   *
   * @param id
   * @param val
   */
  const handleStartTimeChange = (id, val) => {
    const value = parseFloat(val);
    setEvent([value, event[1]]);

    if (validate([value, event[1]])) {
      let endTime = event[1];

      if (typeof endTime === 'string') {
        endTime = parseFloat(endTime);
      }
      setTimeSelection(
        [
          value || null,
          endTime || null,
        ]
      );
    }
  };

  /**
   *
   * @param name
   * @param val
   */
  const handleEndTimeChange = (name, val) => {
    const value = parseFloat(val);
    setEvent([event[0], value]);

    if (validate([event[0], value])) {
      let startTime = event[0];

      if (typeof startTime === 'string') {
        startTime = parseFloat(startTime);
      }
      setTimeSelection(
        [
          startTime || null,
          value,
        ]
      );
    }
  };

  /**
   *
   * @param name
   * @param value
   */
  const handleLabelChange = (name, value) => {
    setLabel(value);
  };

  /**
   *
   */
  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  /**
   *
   */
  const handleReset = () => {
    // Clear all fields
    // setEvent(['', '']);
    // setTimeSelection([null, null]);
    // setLabel('');
  };

  /**
   *
   */
  const handleDelete = () => {
    // setIsDeleted(true);
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
      '/electrophysiology_browser/events/';

    // get duration of annotation
    let startTime = event[0];
    let endTime = event[1];
    if (typeof startTime === 'string') {
      startTime = parseFloat(startTime);
    }
    if (typeof endTime === 'string') {
      endTime = parseFloat(endTime);
    }
    const duration = endTime - startTime;

    // set body
    // instance_id = null for new annotations
    const body = {
      request_type: 'event_update',
      physioFileID: physioFileID,
      instance_id: currentAnnotation ?
        currentAnnotation.physiologicalTaskEventID :
        null,
      instance: {
        onset: startTime,
        duration: duration,
        label_name: label,
        label_description: label,
        channels: 'all',
      },
    };

    fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify(body),
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
    }).then((response) => {
      setIsSubmitted(false);

      // if in edit mode, remove old annotation instance
      if (currentAnnotation !== null) {
        epochs.splice(epochs.indexOf(currentAnnotation), 1);
      }

      const data = response.instance;

      const newAnnotation : EpochType = {
        onset: parseFloat(data.instance.Onset),
        duration: parseFloat(data.instance.Duration),
        type: 'Event',
        label: data.instance.EventValue,  // Unused
        value: data.instance.EventValue,
        trialType: data.instance.TrialType,
        properties: data.extraColumns,
        channels: 'all',
        physiologicalTaskEventID: data.instance.PhysiologicalTaskEventID,
      };

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
        'Event Updated!' :
        'Event Added!');
      setTimeout(() => {
        setAnnoMessage(''); // Empty string will cause success div to hide
      }, 2000);
    }).catch((error) => {
      console.error(error);
      // Display error message
      if (error.status === 401) {
        swal.fire(
          'Unauthorized',
          'This action is not permitted.',
          'error'
        );
      } else {
        swal.fire(
          'Error',
          'Something went wrong!',
          'error'
        );
      }
    });
  }, [isSubmitted]);

  // Delete
  useEffect(() => {
    if (isDeleted) {
      const url = window.location.origin
                  + '/electrophysiology_browser/events/';
      const body = {
        physioFileID: physioFileID,
        instance_id: currentAnnotation ?
          currentAnnotation.physiologicalTaskEventID :
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
                'Event Deleted!',
                'success'
              );

              // If in edit mode, switch back to annotation panel
              if (currentAnnotation !== null) {
                setCurrentAnnotation(null);
                setRightPanel('eventList');
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
        {currentAnnotation ? 'Edit' : 'Add'} Event
        <i
          className='glyphicon glyphicon-remove'
          style={{cursor: 'pointer'}}
          onClick={() => {
            setRightPanel('eventList');
            setCurrentAnnotation(null);
            setTimeSelection(null);
            updateActiveEpoch(null);
          }}
        ></i>
      </div>
      <div className="panel-body">
        <div className="form-row no-gutters">
          <TextboxElement
            name="event-name"
            id="event-name"
            label={
              <span>Event Name
                <code style={{
                  display: 'inline-block',
                  position: 'absolute',
                  backgroundColor: '#eff1f2',
                  color: '#1f2329',
                  fontWeight: 'normal',
                  marginLeft: '10px',
                }}>
                  {
                    currentAnnotation.label === currentAnnotation.trialType
                      ? 'trial_type'
                      : 'value'
                  }
                </code>
              </span>
            }
            value={currentAnnotation ? currentAnnotation.label : ""}
            required={true}
            readonly={true}
          />
          <NumericElement
            name="start-time"
            id="start-time"
            min={0}
            label="Start Time"
            disabled={true}
            value={event
              ? Math.min(
                parseFloat(event[0] ? event[0].toString() : ''),
                parseFloat(event[1] ? event[1].toString() : '')
              )
              : ''
            }
            required={true}
            onUserInput={handleStartTimeChange}
          />
          <NumericElement
            name="end-time"
            id="end-time"
            min={0}
            label="End Time"
            disabled={true}
            value={event
              ? Math.max(
                parseFloat(event[0] ? event[0].toString() : ''),
                parseFloat(event[1] ? event[1].toString() : '')
              )
              : ''
            }
            required={true}
            onUserInput={handleEndTimeChange}
          />
          <div
            className="row form-group"
          >
            {
              currentAnnotation && currentAnnotation.properties.length > 0 && (
                <>
                  <label className="col-sm-12 control-label">
                    Additional Columns
                  </label>
                  <div style={{margin: '15px'}}>
                    {
                      currentAnnotation.properties.map((property) => {
                        return (
                          <TextboxElement
                            name="property-name"
                            label={property.PropertyName}
                            value={property.PropertyValue}
                            required={false}
                            readonly={true}
                          />
                        );
                      })
                    }
                  </div>
                </>
              )
            }
          </div>

          <button
            type="submit"
            disabled={isSubmitted || !validate(event)}
            onClick={handleSubmit}
            className="btn btn-primary"
          >
            Submit
          </button>
          <button type="reset"
                  onClick={handleReset}
                  className="btn btn-primary"
          >
            Reset
          </button>
          {/*{currentAnnotation &&*/}
          {/*  <button*/}
          {/*    type="button"*/}
          {/*    onClick={handleDelete}*/}
          {/*    className="btn btn-primary btn-xs"*/}
          {/*  >*/}
          {/*    Delete*/}
          {/*  </button>*/}
          {/*}*/}
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
    physioFileID: state.dataset.physioFileID,
    timeSelection: state.timeSelection,
    epochs: state.dataset.epochs,
    filteredEpochs: state.dataset.filteredEpochs.plotVisibility,
    currentAnnotation: state.currentAnnotation,
    interval: state.bounds.interval,
    domain: state.bounds.domain,
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
