import React, {useEffect, useState} from 'react';
import {ChannelMetadata, Epoch as EpochType, HEDSchemaElement, HEDTag, RightPanel,} from '../store/types';
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
import {setEpochs} from '../store/state/dataset';
import {setCurrentAnnotation} from '../store/state/currentAnnotation';
import {NumericElement, SelectElement, TextboxElement} from './Form';
import Panel from './Panel';
import Modal from 'jsx/Modal';
import EEGMontage from "./EEGMontage";
import swal from 'sweetalert2';
import {InfoIcon} from "./components";
import {colorOrder} from "../../color";
import {useTranslation} from "react-i18next";


type CProps = {
  timeSelection?: [number, number],
  epochs: EpochType[],
  domain: [number, number],
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
  channelDelimiter: string,
  channelMetadata: ChannelMetadata[],
  panelIsDirty: boolean,
  setPanelIsDirty: (_: boolean) => void,
  eventChannels: string[],
  setEventChannels: (_: string[] ) => void,
};

/**
 *
 * @param root0
 * @param root0.timeSelection
 * @param root0.epochs
 * @param root0.domain
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
 * @param root0.channelDelimiter
 * @param root0.channelMetadata
 * @param root0.panelIsDirty
 * @param root0.setPanelIsDirty
 * @param root0.eventChannels
 * @param root0.setEventChannels
 */
const AnnotationForm = ({
  timeSelection,
  epochs,
  domain,
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
  channelDelimiter,
  channelMetadata,
  panelIsDirty,
  setPanelIsDirty,
  eventChannels,
  setEventChannels,
}: CProps) => {
  const {t} = useTranslation();
  const [eventInterval, setEventInterval] = useState<(number | string)[]>(
    timeSelection ?? ['', '']
  );
  const [label, setLabel] = useState(
    currentAnnotation ?
    currentAnnotation.label :
    null
  );

  const [eventProperties, setEventProperties] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [annoMessage, setAnnoMessage] = useState('');
  const [newTags, setNewTags] = useState([]);
  const [deletedTagIDs, setDeletedTagIDs] = useState([]);

  const [throwChannelEditWarning, setThrowChannelEditWarning] = useState(false);
  const [channelSelectorVisible, setChannelSelectorVisible] = useState(false);

  useEffect(() => {
   setEventProperties(
     Object.keys(datasetTags)
       .filter(column => column !== 'trial_type')
       .reduce((properties, column) => {
         const property = currentAnnotation?.properties.find(prop => prop.PropertyName === column);
         properties[column] = property ? property.PropertyValue : '';
         return properties;
       }, {})
   );
  }, []);


  // Time Selection
  useEffect(() => {
    if (!currentAnnotation) {
      // Only if being created. Time edit not currently allowed
      const [startEvent, endEvent] = timeSelection ?? [0, 0];
      setEventInterval([startEvent, endEvent]);
    }
  }, [timeSelection]);

  useEffect(() => {
    setPanelIsDirty(
      (deletedTagIDs.length > 0 ||
        (newTags.length > 0 && newTags.find((tag) => tag.value !== '')) ||
        JSON.stringify(eventChannels) !==
        JSON.stringify(currentAnnotation ? currentAnnotation.channels : [])
      ) ||
      (!currentAnnotation && (
        (label && label.length > 0) ||
        Object.values(eventProperties).some(((prop: string) => {
          return prop.length > 0;
        }))
      ))
    )
  }, [label, eventProperties, deletedTagIDs, newTags, eventChannels, currentAnnotation?.channels]);

  const validateTimeRange = (timeRange) => {
    return (timeRange[0] || timeRange[0] === 0)
      && (timeRange[1] || timeRange[1] === 0)
      && !(
        timeRange[0] === 0 &&
        timeRange[1] === 0
      );
  }

  // Initiate on load
  useEffect(() => {
    setEventChannels(currentAnnotation ? currentAnnotation.channels : []);
  }, []);


  /**
   *
   * @param event
   */
  const validate = (event) => {
    return validateTimeRange(event) &&
      event[0] <= event[1] && (
        (
          currentAnnotation && (
            newTags.some((tag) => tag.value !== '') ||
            deletedTagIDs.length > 0 ||
            JSON.stringify(eventChannels) !== JSON.stringify(currentAnnotation?.channels)
          )
        ) || (
          !currentAnnotation && (
            (label && label.length > 0) ||
            Object.values(eventProperties).some(((prop: string) => {
              return prop.length > 0;
            })) ||
            newTags.some((tag) => tag.value !== '')
          )
        )
      );
  }

  /**
   *
   * @param id
   * @param val
   */
  const handleStartTimeChange = (id, val) => {
    const value =  Math.min(Math.max(parseFloat(val), domain[0]), domain[1]);
    setEventInterval([value, eventInterval[1]]);

    if (validateTimeRange([value, eventInterval[1]])) {
      let endTime = eventInterval[1];

      if (typeof endTime === 'string') {
        endTime = parseFloat(endTime);
      }

      setTimeSelection(
        [
          value,
          endTime,
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
    const value = Math.min(Math.max(parseFloat(val), domain[0]), domain[1]);
    setEventInterval([eventInterval[0], value]);

    if (validateTimeRange([eventInterval[0], value])) {
      let startTime = eventInterval[0];

      if (typeof startTime === 'string') {
        startTime = parseFloat(startTime);
      }
      setTimeSelection(
        [
          startTime,
          value,
        ]
      );
    }
  };

  /**
   *
   * @param name
   * @param val
   */
  const handleDurationChange = (name, val) => {
    const value = Math.min(Math.max(parseFloat(val), domain[0]), domain[1]);
    const endTime = parseFloat(eventInterval[0].toString()) + value;
    setEventInterval([eventInterval[0], endTime]);

    if (validateTimeRange([eventInterval[0], endTime])) {
      let startTime = eventInterval[0];

      if (typeof startTime === 'string') {
        startTime = parseFloat(startTime);
      }
      setTimeSelection(
        [
          startTime,
          endTime,
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
      setAnnoMessage(t(
        'Fill other tags first', {
          ns: 'electrophysiology_browser'
        }
      ));
      setTimeout(() => {
        setAnnoMessage('');
      }, 2000);
    } else {
      setNewTags([
        {
          type: tagType,
          value: '',
        },
        ...newTags,
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
        return tag.ID.toString();
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
    if (!currentAnnotation) {
      // Clear all fields
      setLabel('');
      setTimeSelection([0, 0]);
      setEventInterval([0, 0]);
      setEventProperties(
        Object.keys(eventProperties)
          .reduce((props, prop) => {
            return {
              ...props,
              [prop]: '',
            };
          }, {})
      );
    }
    setNewTags([]);
    setDeletedTagIDs([]);

    setEventChannels(currentAnnotation
      ? currentAnnotation.channels
      : []
    );
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
    if (!label || !validateTimeRange(eventInterval)) {
      swal.fire(
        t(
          'Warning', {
            ns: 'electrophysiology_browser'
          }
        ),
        t(
          'Please fill out all required fields', {
            ns: 'electrophysiology_browser'
          }
        ),
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

    const currentTagIDs = (
      currentAnnotation
        ? currentAnnotation.hed ?? []
        : []
    ).map((tag) => {
      return tag.ID;
    }).filter(currentTagID => {
      return !deletedTagIDs.includes(currentTagID.toString())
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
    let startTime = eventInterval[0];
    let endTime = eventInterval[1];
    if (typeof startTime === 'string') {
      startTime = parseFloat(startTime);
    }
    if (typeof endTime === 'string') {
      endTime = parseFloat(endTime);
    }
    const duration = currentAnnotation   // Edit not currently allowed
      ? currentAnnotation.duration
      : Math.abs(endTime - startTime);

    const onset = currentAnnotation      // Edit not currently allowed
      ? currentAnnotation.onset
      : Math.min(startTime, endTime);

    // set body
    // instance_id = null for new events
    const body = {
      request_type: 'event_update',
      physioFileID: physioFileID,
      instance_id: currentAnnotation ?
        currentAnnotation.physiologicalTaskEventID :
        null,
      instance: {
        onset: onset,
        duration: duration,
        label_name: label,
        label_description: label,
        channels: eventChannels.length > 0
          ? eventChannels
          : ['n/a'],
        added_hed: newTagIDs,
        deleted_hed: deletedTagIDs,
        event_type: 'trial_type',
        properties: Object.keys(eventProperties)
          .reduce((properties, propertyName) => {
            properties[propertyName] =
             eventProperties[propertyName].length > 0
              ? eventProperties[propertyName]
              : 'n/a';
            return properties;
          }, {}),
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

      const data = response.instance;

      // TODO: Properly handle new event -- below line strange
      const hedTags = Array.from(data.hed_tags).map((hedTag : HEDTag) => {
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
          TaggedBy: hedTag.TaggedBy,
          TaggerName: hedTag.TaggerName === 'Origin'
            ? t(
              'Data Authors', {
                ns: 'electrophysiology_browser'
              }
            )
            : hedTag.TaggerName,
          Endorsements: data.hed_endorsements
            .filter((endorsement) => {
              return endorsement.HEDRelID === hedTag.ID;
            }),
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
        properties: data.extra_columns,
        hed: hedTags,
        channels: data.instance.Channel === 'n/a'
          ? []
          : data.instance.Channel.split(channelDelimiter),
        physiologicalTaskEventID: data.instance.PhysiologicalTaskEventID,
      };


      // Maintain index
      if (currentAnnotation !== null) {
        const eventIndex = epochs.indexOf(currentAnnotation);
        setEpochs([
          ...epochs.slice(0, eventIndex),
          newAnnotation,
          ...epochs.slice(eventIndex + 1),
        ]);
      } else {
        epochs.push(newAnnotation);
        setEpochs(
          epochs
            .sort(function(a, b) {
              return a.onset - b.onset;
            })
        );
      }

      // Display success message
      setAnnoMessage(
        t(currentAnnotation
          ? 'Event Updated!'
          : 'Event Added!', {
            ns: 'electrophysiology_browser'
          }
        )
      );
      setCurrentAnnotation(newAnnotation);

      // handleReset();
      setNewTags([]);
      setDeletedTagIDs([]);

      setTimeout(() => {
        setAnnoMessage(''); // Empty string will cause success div to hide
        updateActiveEpoch(epochs.indexOf(currentAnnotation ? currentAnnotation : newAnnotation));
      }, 2000);
    }).catch((error) => {
      console.error(error);
      // Display error message
      if (error.status === 401) {
        swal.fire(
          t('Unauthorized', {ns: 'loris'}),
          t(
            'This action is not permitted.', {
              ns: 'electrophysiology_browser'
            }
          ),
          'error'
        );
      } else {
        swal.fire(
          t('Error!', {ns: 'loris'}),
          t('Something went wrong!', {
            ns: 'electrophysiology_browser'
          }),
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
        title: t('Are you sure?', {ns: 'loris'}),
        text: t('You won\'t be able to revert this!', {
          ns: 'electrophysiology_browser'
        }),
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
                t('Success', {ns: 'loris'}),
                t('Event Deleted!', {
                  ns: 'electrophysiology_browser'
                }),
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
              t('Error!', {ns: 'loris'}),
              t('Something went wrong!', {
                ns: 'electrophysiology_browser'
              }),
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
      type: 'DATASET',
      value: t('Tags in current dataset', {
        ns: 'electrophysiology_browser',
        count: 99,
      }),
    },
    {
      type: 'ARTIFACTS',
      value: t('HED {{hedVersion}} Artifacts', {
        ns: 'electrophysiology_browser',
        hedVersion: '8.3.0',
        count: 99,
      }),
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
        optgroup: `${optgroup} [${tag.schemaName}]`,
        Description: tag.description,
      }
    }).sort((tagA, tagB) => {
      return tagA.label.localeCompare(tagB.label);
    });
  }

  const artifactTagOptions = [
    ...buildPropertyOptions(
      'Biological-artifact',
      'Property/Data-property/Data-artifact/Biological-artifact/'
    ),
    ...buildPropertyOptions(
      'Nonbiological-artifact',
      'Property/Data-property/Data-artifact/Nonbiological-artifact/'
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
                optgroup: optGroup.length > 0
                  ? `${optGroup} [${schemaElement.schemaName}]`
                  : schemaElement.name,
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
      case 'ARTIFACTS':
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
        className={
        `selection-filter-tags tag-hed
        ${hedTag.schemaElement.longName.includes('artifact')
          ? ' tag-hed-artifact'
          : ''
        }
         ${hedTag.TaggerName !==  'Data Authors'
          ? ' hed-badge-not-origin'
          : ''
        }`}
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
          <br/>
          <div className='tooltip-footer tooltip-footer-panel'>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              fontWeight: 'normal',
            }}>
              <div style={{
                flexBasis: '40%',
                textAlign: 'right',
              }}>
                {t(
                  'Tagged By', {
                    ns: 'electrophysiology_browser'
                  }
                )}:
              </div>
              <div style={{
                flexBasis: '60%',
                textAlign: 'left',
                paddingLeft: '5px',
              }}>
                {hedTag.TaggerName}
              </div>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              fontWeight: 'normal',
            }}>
              <div style={{
                flexBasis: '40%',
                textAlign: 'right',
              }}>
                {t(
                  'Endorsed By', {
                    ns: 'electrophysiology_browser'
                  }
                )}:
              </div>
              <div style={{
                flexBasis: '60%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-evenly',
                textAlign: 'left',
                paddingLeft: '5px',
              }}>
                <div>
                  {
                    hedTag.Endorsements.length > 0
                      ? hedTag.Endorsements
                        .filter((endorsement) => {
                          return ['Endorsed', 'Caveat']
                            .includes(endorsement.EndorsementStatus);
                        })
                        .map((endorsement, i) => {
                          return <React.Fragment key={`hed-tag-${hedTag.ID}-endorsement-${i}`}>
                            {endorsement.EndorsedBy}
                            <i
                              className='glyphicon glyphicon-flag'
                              style={{
                                color: endorsement.EndorsementStatus === 'Endorsed'
                                  ? 'green'
                                  : '#256eb6',
                                paddingLeft: '5px',
                              }}
                            />
                          </React.Fragment>
                        })
                      : 'n/a'
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const strikethroughText = (text) => {
    const combiner = '\u0336';
    return text
      .split('')
      .map(char => char + combiner)
      .join('');
  }

  const buildHEDBadges = (hedTags: HEDTag[], belongsToEvent: boolean = false) => {
    const rootTags = hedTags.filter((tag) => {
      return !hedTags.some((t) => {
        return tag.ID === t.PairRelID
      })
    });

    const tagBadges = [];

    rootTags.forEach((tag) => {
      if (deletedTagIDs.includes(tag.ID.toString())) {
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
            if (groupTag.HasPairing == '1') {
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

  const closePanel = () => {
    setRightPanel('eventList');
    handleReset();
    setCurrentAnnotation(null);
    setTimeSelection(null);
    updateActiveEpoch(null);
    setPanelIsDirty(false);
  }

  return (
    <div
      className="panel panel-primary event-list"
      id='new_annotation'
      style={{borderTopLeftRadius: 0}}
    >
      <div
        className="panel-heading"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTopLeftRadius: 0,
          }}
      >
        {t(
          currentAnnotation ? 'Edit Event' : 'Add Event', {
            ns: 'electrophysiology_browser'
          }
        )}
      </div>
      <div className="panel-body">
        <label style={{ fontSize: '16px', }}>Event Details</label>
        <div className="form-row">
          <TextboxElement
            name="event-name"
            id="event-name"
            className={"form-control input-sm" + (
              currentAnnotation
                ? ' form-edit'
                : ''
            )}
            label="trial_type"
            value={currentAnnotation ? currentAnnotation.label : (label ?? '')}
            onUserInput={(_, value) => setLabel(value)}
            required={false/*currentAnnotation === null*/}
            disabled={currentAnnotation !== null}
            labelOuterClass={'flex-basis-40'}
            labelClass={'control-label'}
            elementClass={'additional-columns-outer'}
            inputClass={'additional-columns-inner'}
          />
          <div
            style={{
              display: 'flex'
            }}
          >
            <div
              style={{
                flexBasis: '100%',
              }}
            >
              <NumericElement
                name="start-time"
                id="start-time"
                min={domain[0]}
                max={domain[1]}
                label="onset"
                noMargins={true}
                elementClass={'form-element-row numeric-element-row'}
                inputClass={"form-control input-sm" + (
                  currentAnnotation
                    ? ' form-edit'
                    : ''
                )}
                disabled={currentAnnotation !== null}
                value={eventInterval
                  ? eventInterval[0].toString()
                  : '0'
                }
                required={currentAnnotation === null}
                onUserInput={handleStartTimeChange}
              />
              <NumericElement
                name="duration"
                id="duration"
                min={domain[0]}
                max={domain[1]}
                label="duration"
                noMargins={true}
                elementClass={'form-element-row numeric-element-row'}
                inputClass={"form-control input-sm" + (
                  currentAnnotation
                    ? ' form-edit'
                    : ''
                )}
                disabled={currentAnnotation !== null}
                value={eventInterval && (eventInterval[1] > eventInterval[0])
                  ? (
                      Math.round((
                        // Math.abs(
                          parseFloat(eventInterval[1].toString()) - parseFloat(eventInterval[0].toString())
                        // )
                        + Number.EPSILON) * 1000) / 1000
                  ).toString()
                  : '0'
                }
                required={currentAnnotation === null}
                onUserInput={handleDurationChange}
              />
              <NumericElement
                name="end-time"
                id="end-time"
                min={domain[0]}
                max={domain[1]}
                label="end time"
                noMargins={true}
                elementClass={'form-element-row numeric-element-row'}
                inputClass={"form-control input-sm" + (
                  currentAnnotation
                    ? ' form-edit'
                    : ''
                )}
                disabled={currentAnnotation !== null}
                value={eventInterval
                  ? (Math.round((
                    parseFloat(eventInterval[1].toString())
                    + Number.EPSILON) * 1000) / 1000).toString()
                  : '0'
                }
                required={currentAnnotation === null}
                onUserInput={handleEndTimeChange}
              />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                }}
                >
                <div className='flex-basis-40'>
                  <label className="control-label">
                    {t(
                      'Channel', {
                        ns: 'electrophysiology_browser',
                        count: 99,
                      }
                    ).toString().toLowerCase()}
                  </label>
                </div>
                <div
                  id='channel-selector-montage'
                  style={{
                    marginLeft: '8px',
                    padding: '5px 0',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setChannelSelectorVisible(true)}
                    className="btn btn-primary btn-sm"
                    style={{ whiteSpace: 'normal', }}
                  >
                    {t(
                      'Select from Montage', {
                        ns: 'electrophysiology_browser'
                      }
                    )}
                  </button>
                  <Modal
                    title={t(
                      'Select Channels', {
                        ns: 'electrophysiology_browser'
                      }
                    )}
                    throwWarning={throwChannelEditWarning}
                    onClose={() => { setChannelSelectorVisible(false); }}
                    show={channelSelectorVisible}
                  >
                    <EEGMontage
                      // @ts-ignore
                      withPanel={false}
                      colorMap={{
                        color: '#8FBDFF',
                        mode: 'fill',
                        ids: eventChannels.map((channelName) => {
                          return channelMetadata.findIndex((channel) => {
                            return channel.name === channelName;
                          })
                        }).filter(index => index !== -1),
                      }}
                      contentHeight='75vh'
                      cssClass={'scale-1_5'}
                      editChannels={true}
                      setCancelWarning={setThrowChannelEditWarning}
                      setEventChannels={setEventChannels}
                      eventChannels={eventChannels}
                      setChannelSelectorVisible={setChannelSelectorVisible}
                    />
                  </Modal>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  margin: '10px 0',
                }}
              >
                {
                  [...eventChannels, ...(currentAnnotation?.channels ?? [])].length < 5 &&
                  <div className='flex-basis-40' />
                }
                <div
                  key={`channel-list-${currentAnnotation ? currentAnnotation.physiologicalTaskEventID : 'new'}`}
                  style={{
                    display: 'block',
                    marginLeft: '15px',
                    marginRight: '5px',
                    wordBreak: 'break-word',
                    fontSize: '12px',
                  }}
                >
                  {
                    [...eventChannels, ...(currentAnnotation?.channels ?? [])].length > 0
                      ? Array.from((new Set([...eventChannels, ...(currentAnnotation?.channels ?? [])])))
                        .sort((channelA, channelB) => {
                          return channelMetadata.findIndex(channel => channel.name === channelA)
                            - channelMetadata.findIndex(channel => channel.name === channelB);
                        })
                        .map((channel, i) => {
                          return <span key={`list-channel-${channel}`}>
                            {i > 0 && <>{channelDelimiter}&nbsp;</>}
                            <span
                              style={{
                              textDecoration: !eventChannels.includes(channel)
                                ? 'line-through'
                                : 'none',
                              fontWeight: !currentAnnotation?.channels.includes(channel)
                                ? 'bold'
                                : 'normal',
                              color: !eventChannels.includes(channel)
                                ? 'red'
                                : !currentAnnotation?.channels.includes(channel)
                                  ? 'green'
                                  : 'black',
                            }}>
                              {channel}
                              {/*!currentAnnotation?.channels.includes(channel) ? '*' : ''*/}
                            </span>
                          </span>
                        })
                      : 'n/a'
                  }
                </div>

              </div>
            </div>
          </div>
            {
              Object.keys(datasetTags)
                .filter(column => column !== 'trial_type')
                .length > 0 && (
                <>
                  <Panel
                    id={`additional-columns-panel`}
                    class={'panel-primary additional-columns-panel'}
                    title={
                      <span style={{ fontWeight: 'bold', }}>
                        {t('Additional Columns', {
                            ns: 'electrophysiology_browser'
                          }
                        )}
                    </span>
                    }
                    initCollapsed={true}
                    collapsed={true}
                    style={{
                      padding: '0 15px',
                      margin: '5px 15px 0 15px',
                    }}
                  >
                    <div
                      className="row form-group"
                    >
                      <div>
                        {
                          Object.keys(datasetTags)
                            .filter(column => column !== 'trial_type')
                            .map((property, i) => {
                              return (
                                <TextboxElement
                                  key={`property-${property}-${i}`}
                                  name="property-name"
                                  className={"form-control input-sm" + (
                                    currentAnnotation
                                      ? ' form-edit'
                                      : ''
                                  )}
                                  label={property}
                                  value={
                                    currentAnnotation
                                      ? currentAnnotation.properties.some(prop => prop.PropertyName === property)
                                        ? currentAnnotation.properties.find(prop => prop.PropertyName === property).PropertyValue
                                        : 'n/a'
                                      : eventProperties[property]
                                  }
                                  onUserInput={
                                    (_, value) =>  setEventProperties({
                                      ...eventProperties,
                                      [property]: value,
                                    })
                                  }
                                  required={false}
                                  disabled={currentAnnotation !== null}
                                  labelOuterClass={'flex-basis-40'}
                                  labelClass={'event-label code-mimic word-break-word'}
                                  elementClass={'additional-columns-outer'}
                                  inputClass={'additional-columns-inner'}
                                />
                              );
                            })
                        }
                      </div>
                    </div>
                  </Panel>
                </>
              )
            }
          <div
            className="row form-group"
          >
            <label
              className="col-sm-4 control-label"
              >
              HED
              <InfoIcon
                title={t('Click this icon to view the latest HED schema', {
                    ns: 'electrophysiology_browser'
                  }
                )}
                url='https://www.hedtags.org/display_hed.html'
              />
            </label>
            <div className='col-sm-8'>
              {
                currentAnnotation && currentAnnotation.hed && (
                  currentAnnotation.hed.some(hedTag => hedTag.TaggerName !==  'Data Authors') ||
                  getTagsForEpoch(currentAnnotation, datasetTags, hedSchema)
                    .some(hedTag => hedTag.TaggerName !==  'Data Authors')
                ) && (
                  <>
                    {t('※ = Not tagged by Data Authors', {
                        ns: 'electrophysiology_browser'
                      }
                    )}
                  </>
                )
              }
            </div>
            <div style={{
              margin: '10px',
              clear: 'both',
            }}>
              {
                currentAnnotation && currentAnnotation.hed &&
                getTagsForEpoch(currentAnnotation, datasetTags, hedSchema).length > 0 && (
                  <>
                    <div style={{clear: 'both'}}>
                      {t('Dataset', {
                          ns: 'electrophysiology_browser'
                        }
                      )}
                    </div>
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
                    <div style={{clear: 'both'}}>
                      {t('Instance', {
                          ns: 'electrophysiology_browser'
                        }
                      )}
                    </div>
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
              <div style={{ marginLeft: '5px', }}>
                <div style={{ fontWeight: 'bold' }}>
                  {t('Add tag from:', {
                      ns: 'electrophysiology_browser'
                    }
                  )}
                </div>
                <SelectElement
                  name='select-add-hed'
                  label={''}
                  value={''}
                  options={addHedTagOptions}
                  emptyOption={true}
                  emptyText={t('Select Category', {
                    ns: 'electrophysiology_browser'
                  })}
                  emptyTextClass={'select-tag-text'}
                  required={false}
                  sortByValue={false}
                  onUserInput={(name, value) => {
                    const addOption = addHedTagOptions.find((option) => {
                      return option.value === value;
                    })
                    handleAddTag(addOption.type)
                  }}
                />
              </div>
              <div style={{
                marginLeft: '5px',
                width: '90%',
              }}>
                {
                  newTags.map((tag, tagIndex) => {
                    const emptyText = t('Select {{tagType}}', {
                      ns: 'electrophysiology_browser',
                      tagType: t(
                        addHedTagOptions.find((option) => {
                          return option.type === newTags[tagIndex].type;
                        }).value,
                        {
                          ns: 'electrophysiology_browser',
                          count: 1,
                        }
                      )
                    });

                    return (
                      <React.Fragment key={`select-${tag}-${tagIndex}`}>
                        <SelectElement
                          name={`new-tag-${tagIndex}`}
                          label=""
                          value={newTags[tagIndex].value}
                          options={getOptions(newTags[tagIndex].type)}
                          emptyOption={true}
                          emptyText={emptyText}
                          emptyTextClass={'select-tag-text'}
                          required={false}
                          sortByValue={false}
                          onUserInput={(name, value) => {
                            handleTagChange(
                              tagIndex,
                              value === emptyText ? '' : value
                            );
                          }}
                          useOptionGroups={true}
                        />
                        <div
                          key={`remove-tag-${tagIndex}`}
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
                      </React.Fragment>
                    );
                  })
                }
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <button
                type="submit"
                disabled={isSubmitted || !validate(eventInterval)}
                onClick={handleSubmit}
                className="btn btn-primary"
              >
                {t('Submit', {ns: 'loris'})}
              </button>
              <button
                type="reset"
                disabled={isSubmitted || (
                  (currentAnnotation || (
                    !currentAnnotation &&
                    [null, ''].includes(label) &&
                    [0, ''].includes(eventInterval[0]) &&
                    [0, ''].includes(eventInterval[1]) &&
                    Object.values(eventProperties).every(((prop: string) => {
                      return prop.length === 0;
                    }))
                  )) &&
                  newTags.length === 0 &&
                  deletedTagIDs.length === 0 &&
                  JSON.stringify(eventChannels) ===
                  JSON.stringify(currentAnnotation ? currentAnnotation.channels : [])
                )}
                onClick={handleReset}
                className="btn btn-primary"
              >
                {t('Reset', {ns: 'loris'})}
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                if (panelIsDirty) {
                  swal.fire({
                    title: t('Are you sure?', {ns: 'loris'}),
                    text: t(
                      'Leaving the form will result in the ' +
                      'loss of any information entered.', {
                        ns: 'loris'
                      }
                    ),
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Proceed',
                    cancelButtonText: 'Cancel',
                  }).then((result) => {
                    if (result.value) {
                      closePanel();
                    }
                  });
                } else {
                  closePanel();
                }
              }}
              className="btn btn-primary"
            >
              {t('Cancel', {ns: 'loris'})}
            </button>
          </div>

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
  hedSchema: [],
};

export default connect(
  (state: RootState)=> ({
    physioFileID: state.dataset.physioFileID,
    timeSelection: state.timeSelection,
    epochs: state.dataset.epochs,
    domain: state.bounds.domain,
    filteredEpochs: state.dataset.filteredEpochs.plotVisibility,
    currentAnnotation: state.currentAnnotation,
    interval: state.bounds.interval,
    hedSchema: state.dataset.hedSchema,
    datasetTags: state.dataset.datasetTags,
    channelDelimiter: state.dataset.channelDelimiter,
    channelMetadata: state.dataset.channelMetadata,
    channels: state.channels,
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
