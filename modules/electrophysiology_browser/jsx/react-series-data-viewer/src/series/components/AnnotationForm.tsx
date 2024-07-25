import React, {useEffect, useState} from 'react';
import {
  Epoch as EpochType,
  RightPanel,
  HEDTag,
  HEDSchemaElement,
} from '../store/types';
import {connect} from 'react-redux';
import {setTimeSelection} from '../store/state/timeSelection';
import {setRightPanel} from '../store/state/rightPanel';
import * as R from 'ramda';
import {
  getNthMemberTrailingBadgeIndex,
  getTagsForEpoch,
  toggleEpoch,
  updateActiveEpoch
} from '../store/logic/filterEpochs';
import {RootState} from '../store';
import {setActiveEpoch, setEpochs} from '../store/state/dataset';
import {setCurrentAnnotation} from '../store/state/currentAnnotation';
import {NumericElement, SelectElement, TextboxElement} from './Form';
import swal from 'sweetalert2';
import {InfoIcon} from "./components";
import {colorOrder} from "../../color";


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
  hedSchema: HEDSchemaElement[],
  datasetTags: any,
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
 * @param root0.toggleEpoch,
 * @param root0.updateActiveEpoch,
 * @param root0.interval
 * @param root0.hedSchema
 * @param root0.datasetTags
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
  hedSchema,
  datasetTags,
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
  const [newTags, setNewTags] = useState([]);
  const [deletedTagIDs, setDeletedTagIDs] = useState([]);

  // Time Selection
  useEffect(() => {
    const [startEvent = '', endEvent = ''] = timeSelection || [];
    setEvent([startEvent, endEvent]);
  }, [timeSelection]);

  /**
   *
   * @param event
   */
  const validate = (event) => {
    return (event[0] || event[0] === 0)
      && (event[1] || event[1] === 0)
      && event[0] <= event[1]
      && (
        newTags.some((tag) => tag.value !== '') ||
        deletedTagIDs.length > 0
      );
  };

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
   */
  const handleAddTag = (tagType: string) => {
    // Add tag if all are filled
    if (newTags.find((tag) => {
      return tag.value === '';
    })) {
      setAnnoMessage('Fill other tags first');
      setTimeout(() => {
        setAnnoMessage('');
      }, 2000);
    } else {
      setNewTags([
        ...newTags,
        {
          type: tagType,
          value: '',
        }
      ]);
    }
  };


  /**
   *
   */
  const handleDeleteTag = (event) => {
    const elementID = event.target.getAttribute('id');
    const tagRelID = elementID.split('-').pop();
    if (currentAnnotation.hed &&
      currentAnnotation.hed.map((tag) => {
        return tag.ID
      }).includes(tagRelID)
    ) {
      setDeletedTagIDs([...deletedTagIDs, tagRelID]);
    }
  };

  /**
   *
   * @param tagIndex
   */
  const handleRemoveAddedTag = (tagIndex: number) => {
    setNewTags(newTags.filter((tag, index) => {
      return index !== tagIndex;
    }));
  };

  /**
   *
   * @param tagIndex
   * @param value
   */
  const handleTagChange = (tagIndex, value) => {
    setNewTags([
      ...newTags.slice(0, tagIndex),
      {
        ...newTags[tagIndex],
        value: value
      },
      ...newTags.slice(tagIndex + 1),
    ])
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
    setNewTags([]);
    setDeletedTagIDs([]);
  };

  /**
   *
   */
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

    const newTagIDs = newTags
      .filter((tag) => {
        return tag.value !== '';
      })
      .map((tag) => {
        const node = getNodeByName(tag.value);
        if (node)
          return node.id;
      });

    const currentTagIDs = (currentAnnotation.hed ?? []).map((tag) => {
      return tag.ID;
    }).filter(currentTagID => {
      return !deletedTagIDs.includes(currentTagID)
    });

    // Prevent duplicates
    // const addingNewTagMultipleTimes = newTagIDs.length !== (new Set(newTagIDs)).size;
    // const addingExistingTag = newTagIDs.filter((tagID) => {
    //   return currentTagIDs.includes(tagID)
    // }).length > 0;
    //
    // if (addingNewTagMultipleTimes || addingExistingTag) {
    //   swal.fire(
    //     'Warning',
    //     'Duplicates are not allowed',
    //     'warning'
    //   );
    //   setIsSubmitted(false);
    //   return;
    // }

    const url = window.location.origin +
      '/electrophysiology_browser/events/';

    // get duration of event
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
    // instance_id = null for new events
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
        added_hed: newTagIDs,
        deleted_hed: deletedTagIDs,
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
      throw (response);

    }).then((response) => {
      setIsSubmitted(false);

      // if in edit mode, remove old event instance
      if (currentAnnotation !== null) {
        epochs.splice(epochs.indexOf(currentAnnotation), 1);
      }
      // } else {
      //   newAnnotation.physiologicalTaskEventID = parseInt(data.instance_id);
      // }

      const data = response.instance;

      // TODO: Properly handle new event
      const hedTags = Array.from(data.hedTags).map((hedTag : HEDTag) => {
        const foundTag = hedSchema.find((tag) => {
          return tag.id === hedTag.HEDTagID;
        });
        // Currently only supporting schema-defined HED tags
        return {
          schemaElement: foundTag ?? null,
          HEDTagID: hedTag.HEDTagID,
          ID: hedTag.ID,
          PropertyName: hedTag.PropertyName,
          PropertyValue: hedTag.PropertyValue,
          TagValue: hedTag.TagValue,
          Description: hedTag.Description,
          HasPairing: hedTag.HasPairing,
          PairRelID: hedTag.PairRelID,
          AdditionalMembers: hedTag.AdditionalMembers,
        }
      });

      const epochLabel = [null, 'n/a'].includes(data.instance.TrialType)
          ? null
          : data.instance.TrialType;
      const newAnnotation : EpochType = {
        onset: parseFloat(data.instance.Onset),
        duration: parseFloat(data.instance.Duration),
        type: 'Event',
        label: epochLabel ?? data.instance.EventValue,
        value: data.instance.EventValue,
        trialType: data.instance.TrialType,
        properties: data.extraColumns,
        hed: hedTags,
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
      setCurrentAnnotation(newAnnotation);

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

              // If in edit mode, switch back to EventManager panel
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

  const getNodeByName = (name: string) => {
    return hedSchema.find((node) => {
      return node.name === name
    });
  }

  const addHedTagOptions = [
    {
      type: 'SCORE',
      value: 'SCORE Artifacts',
    },
    {
      type: 'DATASET',
      value: 'Tags in current dataset',
    },
  ]

  const buildPropertyOptions = (optgroup: string, parentHED: string) => {
    return hedSchema.filter((node) => {
      return node.longName.includes(parentHED)
    }).map((tag) => {
      return {
        HEDTagID: tag.id,
        label: tag.name,
        longName: tag.longName,
        value: tag.id,
        optgroup: optgroup,
        Description: tag.description,
      }
    }).sort((tagA, tagB) => {
      return tagA.label.localeCompare(tagB.label);
    });
  }

  const artifactTagOptions = [
    ...buildPropertyOptions(
      'Biological-artifact',
      'Artifact/Biological-artifact/'
    ),
    ...buildPropertyOptions(
      'Non-biological-artifact',
      'Artifact/Non-biological-artifact/'
    ),
  ];

  const getUniqueDatasetTags = () => {
    const idSet = new Set<number>();
    const tagList = [];
    Object.keys(datasetTags).forEach((columnName) => {
      Object.keys(datasetTags[columnName]).forEach((fieldValue) => {
        const hedTags = datasetTags[columnName][fieldValue].map((hedTag) => {
          if (hedTag && hedTag.HEDTagID !== null) {
            const schemaElement = hedSchema.find((schemaTag) => {
              return schemaTag.id === hedTag.HEDTagID;
            })
            if (schemaElement && !idSet.has(schemaElement.id)) {
              idSet.add(schemaElement.id);
              const optGroup = schemaElement.longName.substring(0, schemaElement.longName.lastIndexOf('/'));
              return {
                HEDTagID: schemaElement.id,
                label: schemaElement.name,
                longName: schemaElement.longName,
                value: schemaElement.id,
                optgroup: optGroup.length > 0 ? optGroup : schemaElement.name,
                Description: schemaElement.description,
              }
            }
          }
        });
        tagList.push(...hedTags.filter((tag) => {
          return tag !== undefined;
        }));
      });
    });
    return tagList.sort((tagA, tagB) => {
      return tagA.label.localeCompare(tagB.label);
    });
  }

  const getOptions = (optionType: string) => {
    switch (optionType) {
      case 'SCORE':
        return artifactTagOptions;
      case 'DATASET':
        return getUniqueDatasetTags();
      default:
        return [];
    }
  }

  const buildGroupSpan = (char: string, colorIndex: number) => {
    return (
      <span style={{
        fontSize: '30px',
        position: 'relative',
        bottom: '8px',
        color: colorOrder(colorIndex.toString()).toString(),
      }}>
        {char}
      </span>
    );
  }

  const buildHEDBadge = (hedTag: HEDTag, belongsToEvent: boolean) => {
    return (
      <div
        key={`hed-tag-${hedTag.ID}`}
        className={`selection-filter-tags tag-hed${hedTag.schemaElement.longName.includes('artifact') ? ' tag-hed-score' : ''}`}
      >
        <div className={`selection-filter-tag${belongsToEvent ? '' : ' selection-filter-dataset-tag'}`}>
                          <span className="filter-tag-name">
                            {hedTag.schemaElement.name}
                          </span>
          <span
            id={`hed-tag-${hedTag.ID}`}
            className={`tag-remove-button${belongsToEvent ? '' : ' dataset-tag-remove-button'}`}
            onClick={belongsToEvent ? handleDeleteTag : null}
            hidden={!belongsToEvent}
          >
          x
        </span>
        </div>
        <div className="badge-hed-tooltip">
          <div className="tooltip-title">
            {hedTag.schemaElement.longName}
          </div>
          <br/>
          <div className="tooltip-description">
            {hedTag.schemaElement.description}
          </div>
        </div>
      </div>
    );
  }

  const buildHEDBadges = (hedTags: HEDTag[], belongsToEvent: boolean = false) => {
    const rootTags = hedTags.filter((tag) => {
      return !hedTags.some((t) => {
        return tag.ID === t.PairRelID
      })
    });

    const tagBadges = [];

    rootTags.forEach((tag) => {
      if (deletedTagIDs.includes(tag.ID)) {
        return;
      }
      let groupColorIndex = 0;
      if (tag.PairRelID === null) {
        tagBadges.push(buildHEDBadge(tag, belongsToEvent));
        groupColorIndex++;
      } else {
        const tagGroup = [];
        let groupMember = tag;
        while (groupMember) {
          tagGroup.push(groupMember);
          groupMember = hedTags.find((hedTag) => {
            return hedTag.ID === groupMember.PairRelID;
          });
        }

        const tagBadgeGroup = [];
        const tagBadgeSubgroup = [];
        tagGroup.reverse().map((groupTag) => {
          if (groupTag.PairRelID === null) {
            tagBadgeGroup.push(buildHEDBadge(groupTag, belongsToEvent));
          } else {
            if (groupTag.HasPairing === '1') {
              if (groupTag.AdditionalMembers > 0 || tagBadgeSubgroup.length === 0) {
                let commaIndex = getNthMemberTrailingBadgeIndex(
                  tagBadgeGroup,
                  groupTag.AdditionalMembers + (
                    tagBadgeSubgroup.length > 0 ? 0 : 1
                  )
                );

                tagBadgeGroup.splice(commaIndex, 0, buildGroupSpan(')', groupColorIndex));
                if (tagBadgeSubgroup.length > 0) {
                  tagBadgeGroup.splice(0, 0, ...tagBadgeSubgroup);
                }
                if (groupTag.HEDTagID !== null) {
                  tagBadgeGroup.splice(0, 0, buildHEDBadge(groupTag, belongsToEvent));
                }
                tagBadgeGroup.splice(0, 0, buildGroupSpan('(', groupColorIndex));
                tagBadgeSubgroup.length = 0;
              } else {
                if (groupTag.HEDTagID === null) {
                  if (tagBadgeSubgroup.length > 0) {
                    tagBadgeSubgroup.splice(0, 0, buildGroupSpan('(', groupColorIndex));
                    tagBadgeSubgroup.push(buildGroupSpan(')', groupColorIndex));
                  } else {
                    console.error('UNEXPECTED STATE');
                  }
                } else {
                  if (tagBadgeSubgroup.length > 0) {
                    tagBadgeSubgroup.splice(0, 0, buildHEDBadge(groupTag, belongsToEvent));
                    tagBadgeSubgroup.splice(0, 0, buildGroupSpan('(', groupColorIndex));
                    tagBadgeSubgroup.push(buildGroupSpan(')', groupColorIndex));
                  } else {
                    tagBadgeGroup.splice(0, 0, buildHEDBadge(groupTag, belongsToEvent));
                    tagBadgeGroup.splice(0, 0, buildGroupSpan('(', groupColorIndex));
                    tagBadgeGroup.push(buildGroupSpan(')', groupColorIndex));
                  }
                }
              }
              groupColorIndex++;
            } else {
              if (tagBadgeSubgroup.length > 0) {
                tagBadgeGroup.splice(0, 0, ...tagBadgeSubgroup);
              }
              tagBadgeSubgroup.splice(0, tagBadgeSubgroup.length, buildHEDBadge(groupTag, belongsToEvent));
            }
          }
        });
        tagBadges.push(...tagBadgeGroup);
      }
    });
    return tagBadges;
  }

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
            if (deletedTagIDs.length > 0 ||
              (newTags.length > 0 && newTags.find((tag) => tag.value !== '')
              )) {
              if (!confirm('Are you sure you want to discard your changes? ' +
                ' Otherwise, press cancel and "Submit" your changes')) {
                return;
              }
            }
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
          <div
            className="row form-group"
          >
            <label
              className="col-sm-6 control-label"
              style={{lineHeight: '25px'}}>
              HED
              <InfoIcon
                title='Click this icon to view the HED SCORE schema'
                url='https://www.hedtags.org/display_hed.html?schema=score'
              />
            </label>
            <div
              style={{
                margin: '10px',
                clear: 'both',
              }}
            >
              {
                currentAnnotation && currentAnnotation.hed &&
                getTagsForEpoch(currentAnnotation, datasetTags, hedSchema)
                  .length > 0 && (
                  <>
                    <div style={{clear: 'both'}}>Dataset</div>
                    {
                      buildHEDBadges(
                        getTagsForEpoch(currentAnnotation, datasetTags, hedSchema),
                        false,
                      ).map((badge) => {
                        return badge;
                      })
                    }
                  </>
                )
              }
              {
                (
                  (
                    currentAnnotation
                    && currentAnnotation.hed
                    && currentAnnotation.hed.length > 0
                  ) || newTags.length > 0
                ) && (
                  <div style={{clear: 'both'}}>Instance</div>
                )
              }
              {
                currentAnnotation && currentAnnotation.hed &&
                buildHEDBadges(
                  currentAnnotation.hed,
                  true,
                ).map((badge) => {
                  return badge;
                })
              }
              <div style={{
                marginLeft: '5px',
                width: '90%',
              }}>
                {
                  newTags.map((tag, tagIndex) => {
                    return (
                      <>
                        <SelectElement
                          name={`${tag}-${tagIndex}`}
                          label=""
                          value={newTags[tagIndex].value}
                          options={getOptions(newTags[tagIndex].type)}
                          emptyOption={true}
                          required={false}
                          sortByValue={false}
                          onUserInput={(name, value) => {
                            handleTagChange(tagIndex, value);
                          }}
                          useOptionGroups={true}
                        />
                        <div
                          onClick={() => handleRemoveAddedTag(tagIndex)}
                          style={{
                            position: 'relative',
                            left: '100%',
                            bottom: '30px',
                            height: '0',
                            width: '10%',
                            textAlign: 'center',
                            marginLeft: '2px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                          }}
                        >
                          x
                        </div>
                      </>
                    );
                  })
                }
              </div>
              <div style={{ marginLeft: '5px', }}>
                <div style={{ fontWeight: 'bold' }}>
                  Select tag from:
                </div>
                <SelectElement
                  name='select-add-hed'
                  label=""
                  value={''}
                  options={addHedTagOptions}
                  emptyOption={true}
                  required={false}
                  sortByValue={false}
                  onUserInput={(name, value) => {
                    const addOption = addHedTagOptions.find((option) => {
                      return option.value === value;
                    })
                    handleAddTag(addOption.type)
                  }}
                />
                {/*<button*/}
                {/*  className="btn btn-xs btn-primary"*/}
                {/*  onClick={handleAddTag}*/}
                {/*>*/}
                {/*  Add Tag*/}
                {/*</button>*/}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitted || !validate(event)}
            onClick={handleSubmit}
            className="btn btn-primary"
          >
            Submit
          </button>
          <button
            type="reset"
            disabled={
              newTags.length === 0 &&
              deletedTagIDs.length === 0
            }
            onClick={handleReset}
            className="btn btn-primary"
          >
            Reset
          </button>
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
  hedSchema: [],
};

export default connect(
  (state: RootState)=> ({
    physioFileID: state.dataset.physioFileID,
    timeSelection: state.timeSelection,
    epochs: state.dataset.epochs,
    filteredEpochs: state.dataset.filteredEpochs.plotVisibility,
    currentAnnotation: state.currentAnnotation,
    interval: state.bounds.interval,
    hedSchema: state.dataset.hedSchema,
    datasetTags: state.dataset.datasetTags,
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
