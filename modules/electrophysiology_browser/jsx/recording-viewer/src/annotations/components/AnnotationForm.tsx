import React, {useContext, useEffect, useMemo, useState} from 'react';
import {
  ChannelMetadata,
  HEDEndorsement,
  HEDSchemaElement,
  HEDTag,
  RecordingEvent,
} from '../../domain/types';
import {
  getNthMemberTrailingBadgeIndex,
  getSchemaElementName,
  getTagsForEvent,
} from '../../events/eventLogic';
import {NumericElement, SelectElement, TextboxElement} from '../../ui/Form';
import Panel from '../../ui/Panel';
import Modal from 'jsx/Modal';
import ChannelsEditor from '../../montage/ChannelsEditor';
import swal from 'sweetalert2';
import {InfoIcon} from '../../ui/InfoIcon';
import {colorOrder} from '../../ui/colors';
import {useTranslation} from 'react-i18next';
import {ChannelMetadataContext} from '../../recording/RecordingDataProvider';
import {useTimeWindow} from '../../timeline/TimeWindowContext';
import {useTimeSelection} from '../../timeline/TimeSelectionContext';
import {useRightPanel} from '../../viewer/RightPanelContext';
import {useCurrentAnnotation} from '../state/CurrentAnnotationContext';
import {useEvents} from '../../events/state/EventContext';
import {useRecording} from '../../recording/RecordingContext';
import {useHED} from '../../hed/state/HEDContext';
import {roundTime} from '../../shared/utils';


type AnnotationFormProps = {
  panelIsDirty: boolean,
  setPanelIsDirty: (_: boolean) => void,
  eventChannels: string[],
  setEventChannels: React.Dispatch<React.SetStateAction<string[]>>,
};

type HEDTagOption = {
  HEDTagID: number,
  label: string,
  longName: string,
  value: number,
  optgroup: string,
  Description: string,
};

type EventTiming = {
  onset: number,
  duration: number,
};

/** Parse a numeric input value, or return null if it is not a number. */
function parseTime(value: string): number | null {
  const time = parseFloat(value);
  return Number.isFinite(time) ? time : null;
}

type PendingTag = {
  type: string,
  value: string,
};

/** Annotation form component. */
function AnnotationForm({
  panelIsDirty,
  setPanelIsDirty,
  eventChannels,
  setEventChannels,
}: AnnotationFormProps) {
  const {physioFileID, channelDelimiter} = useRecording();
  const {hedSchema, datasetTags} = useHED();
  const {currentAnnotation, setCurrentAnnotation} = useCurrentAnnotation();
  const {
    events,
    setEvents,
    setActiveEvent,
  } = useEvents();
  const {setRightPanel} = useRightPanel();
  const {recordingTimeRange} = useTimeWindow();
  const {timeSelection, setTimeSelection} = useTimeSelection();
  const {t} = useTranslation();
  const channelMetadata = useContext(ChannelMetadataContext);

  // A new event takes its timing from the time selection, while an existing
  // event keeps its own timing, which cannot currently be edited.
  const eventTiming = useMemo((): EventTiming => {
    if (currentAnnotation) {
      return {
        onset: currentAnnotation.onset,
        duration: currentAnnotation.duration,
      };
    }

    if (timeSelection === null) {
      return {onset: 0, duration: 0};
    }

    return {
      onset: Math.min(timeSelection[0], timeSelection[1]),
      duration: roundTime(Math.abs(timeSelection[1] - timeSelection[0])),
    };
  }, [currentAnnotation, timeSelection]);

  const eventEndTime = roundTime(eventTiming.onset + eventTiming.duration);

  // An event at time 0 with no duration is considered as not having a timing.
  const eventHasTiming = eventTiming.onset !== 0 || eventTiming.duration !== 0;
  const [label, setLabel] = useState<string | null>(
    currentAnnotation ?
      currentAnnotation.label :
      null
  );

  const [eventProperties, setEventProperties] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [annoMessage, setAnnoMessage] = useState('');
  const [newTags, setNewTags] = useState<PendingTag[]>([]);
  const [deletedTagIDs, setDeletedTagIDs] = useState<Array<string | number>>([]);

  const [throwChannelEditWarning, setThrowChannelEditWarning] = useState(false);
  const [channelSelectorVisible, setChannelSelectorVisible] = useState(false);

  useEffect(() => {
    setEventProperties(
      Object.keys(datasetTags)
        .filter((column) => column !== 'trial_type')
        .reduce<Record<string, string>>((properties, column) => {
          const property = currentAnnotation?.properties.find(
            (prop) => prop.PropertyName === column
          );
          properties[column] = property ? String(property.PropertyValue) : '';
          return properties;
        }, {})
    );
  }, []);


  useEffect(() => {
    setPanelIsDirty(
      (deletedTagIDs.length > 0 ||
        (newTags.length > 0 && newTags.some((tag) => tag.value !== '')) ||
        JSON.stringify(eventChannels) !==
        JSON.stringify(currentAnnotation ? currentAnnotation.channels : [])
      ) ||
      (!currentAnnotation && (
        (label && label.length > 0) ||
        Object.values(eventProperties).some(((prop: string) => {
          return prop.length > 0;
        }))
      ))
    );
  }, [label, eventProperties, deletedTagIDs, newTags, eventChannels, currentAnnotation?.channels]);

  // Initiate on load
  useEffect(() => {
    setEventChannels(currentAnnotation ? currentAnnotation.channels : []);
  }, []);


  /** Check whether the form can be submitted. */
  const validate = () => {
    return eventHasTiming && (
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
  };

  /**
   * Set the timing of the new event, clamped to the recording time range.
   */
  const setEventTiming = (onset: number, duration: number) => {
    const [recordingStart, recordingEnd] = recordingTimeRange;
    const clampedOnset = Math.min(
      Math.max(onset, recordingStart),
      recordingEnd,
    );
    const clampedDuration = Math.min(
      Math.max(duration, 0),
      recordingEnd - clampedOnset,
    );

    setTimeSelection([
      clampedOnset,
      roundTime(clampedOnset + clampedDuration),
    ]);
  };

  /** Move the event to a new onset, keeping its duration. */
  const handleOnsetChange = (_name: string, value: string) => {
    const onset = parseTime(value);
    if (onset !== null) {
      setEventTiming(onset, eventTiming.duration);
    }
  };

  /** Change the event duration, keeping its onset. */
  const handleDurationChange = (_name: string, value: string) => {
    const duration = parseTime(value);
    if (duration !== null) {
      setEventTiming(eventTiming.onset, duration);
    }
  };

  /** Change the event end time, keeping its onset. */
  const handleEndTimeChange = (_name: string, value: string) => {
    const endTime = parseTime(value);
    if (endTime !== null) {
      setEventTiming(eventTiming.onset, endTime - eventTiming.onset);
    }
  };

  /** Handle add tag. */
  const handleAddTag = (tagType: string) => {
    // Add tag if all are filled
    if (newTags.find((tag) => {
      return tag.value === '';
    })) {
      setAnnoMessage(t(
        'Fill other tags first', {
          ns: 'electrophysiology_browser',
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


  /** Handle delete tag. */
  const handleDeleteTag = (event: React.MouseEvent<HTMLSpanElement>) => {
    const elementID = (event.target as HTMLElement).getAttribute('id');
    const tagRelID = elementID?.split('-').pop();
    if (!tagRelID) {
      return;
    }
    if (currentAnnotation?.hed &&
      currentAnnotation.hed.map((tag) => {
        return tag.ID.toString();
      }).includes(tagRelID)
    ) {
      setDeletedTagIDs([...deletedTagIDs, tagRelID]);
    }
  };

  /**
   *
   * @param tagIndex - Tag index to remove.
   */
  const handleRemoveAddedTag = (tagIndex: number) => {
    setNewTags(newTags.filter((tag, index) => {
      return index !== tagIndex;
    }));
  };

  /**
   *
   * @param tagIndex - Tag index to update.
   * @param value - Updated tag value.
   */
  const handleTagChange = (tagIndex: number, value: string) => {
    setNewTags([
      ...newTags.slice(0, tagIndex),
      {
        ...newTags[tagIndex],
        value: value,
      },
      ...newTags.slice(tagIndex + 1),
    ]);
  };

  /** Handle submit. */
  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  /** Handle reset. */
  const handleReset = () => {
    if (!currentAnnotation) {
      // Clear all fields
      setLabel('');
      setTimeSelection(null);
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

  /** Handle delete. */
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
    if (!label || !eventHasTiming) {
      swal.fire(
        t(
          'Warning', {
            ns: 'electrophysiology_browser',
          }
        ),
        t(
          'Please fill out all required fields', {
            ns: 'electrophysiology_browser',
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
        if (node) {
          return node.id;
        }
      });

    const currentTagIDs = (
      currentAnnotation
        ? currentAnnotation.hed ?? []
        : []
    ).map((tag) => {
      return tag.ID;
    }).filter((currentTagID) => {
      return !deletedTagIDs.includes(currentTagID.toString());
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

    // set body
    // instance_id = null for new events
    const body = {
      request_type: 'event_update',
      physioFileID: physioFileID,
      instance_id: currentAnnotation ?
        currentAnnotation.physiologicalTaskEventID :
        null,
      instance: {
        onset: eventTiming.onset,
        duration: eventTiming.duration,
        label_name: label,
        label_description: label,
        channels: eventChannels.length > 0
          ? eventChannels
          : ['n/a'],
        added_hed: newTagIDs,
        deleted_hed: deletedTagIDs,
        event_type: 'trial_type',
        properties: Object.keys(eventProperties)
          .reduce<Record<string, string>>((properties, propertyName) => {
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
      const hedTags = (data.hed_tags as HEDTag[]).map((hedTag) => {
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
                ns: 'electrophysiology_browser',
              }
            )
            : hedTag.TaggerName,
          Endorsements: data.hed_endorsements
            .filter((endorsement: HEDEndorsement & {HEDRelID: HEDTag['ID']}) => {
              return endorsement.HEDRelID === hedTag.ID;
            }),
        };
      });

      const eventLabel = [null, 'n/a'].includes(data.instance.TrialType)
        ? null
        : data.instance.TrialType;

      const newAnnotation : RecordingEvent = {
        onset: parseFloat(data.instance.Onset),
        duration: parseFloat(data.instance.Duration),
        type: 'Event',
        label: eventLabel ?? data.instance.EventValue,
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
      let savedEventIndex;
      if (currentAnnotation !== null) {
        savedEventIndex = events.indexOf(currentAnnotation);
        setEvents([
          ...events.slice(0, savedEventIndex),
          newAnnotation,
          ...events.slice(savedEventIndex + 1),
        ]);
      } else {
        const nextEvents = [...events, newAnnotation].sort(
          (a, b) => a.onset - b.onset
        );
        savedEventIndex = nextEvents.indexOf(newAnnotation);
        setEvents(nextEvents);
      }

      // Display success message
      setAnnoMessage(
        t(currentAnnotation
          ? 'Event Updated!'
          : 'Event Added!', {
          ns: 'electrophysiology_browser',
        }
        )
      );
      setCurrentAnnotation(newAnnotation);

      // handleReset();
      setNewTags([]);
      setDeletedTagIDs([]);

      setTimeout(() => {
        setAnnoMessage(''); // Empty string will cause success div to hide
        setActiveEvent(savedEventIndex);
      }, 2000);
    }).catch((error) => {
      console.error(error);
      // Display error message
      if (error.status === 401) {
        swal.fire(
          t('Unauthorized', {ns: 'loris'}),
          t(
            'This action is not permitted.', {
              ns: 'electrophysiology_browser',
            }
          ),
          'error'
        );
      } else {
        swal.fire(
          t('Error!', {ns: 'loris'}),
          t('Something went wrong!', {
            ns: 'electrophysiology_browser',
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
          ns: 'electrophysiology_browser',
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

              setEvents(events.filter((event) => event !== currentAnnotation));

              // Reset Form
              handleReset();

              // Display success message
              swal.fire(
                t('Success', {ns: 'loris'}),
                t('Event Deleted!', {
                  ns: 'electrophysiology_browser',
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
                ns: 'electrophysiology_browser',
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

  /** Get node by name. */
  const getNodeByName = (name: string) => {
    return hedSchema.find((node) => {
      return node.name === name;
    });
  };

  const addHedTagOptions = [
    {
      type: 'DATASET',
      value: t('Tag in current dataset', {
        ns: 'electrophysiology_browser',
        count: 99,
      }),
    },
    {
      type: 'ARTIFACTS',
      value: t('HED {{hedVersion}} Artifact', {
        ns: 'electrophysiology_browser',
        hedVersion: '8.3.0',
        count: 99,
      }),
    },
  ];

  /** Build property options. */
  const buildPropertyOptions = (optgroup: string, parentHED: string) => {
    return hedSchema.filter((node) => {
      return node.longName.includes(parentHED);
    }).map((tag) => {
      return {
        HEDTagID: tag.id,
        label: tag.name,
        longName: tag.longName,
        value: tag.id,
        optgroup: `${optgroup} [${tag.schemaName}]`,
        Description: tag.description,
      };
    }).sort((tagA, tagB) => {
      return tagA.label.localeCompare(tagB.label);
    });
  };

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

  /** Get unique dataset tags. */
  const getUniqueDatasetTags = () => {
    const idSet = new Set<number>();
    const tagList: HEDTagOption[] = [];
    Object.keys(datasetTags).forEach((columnName) => {
      Object.keys(datasetTags[columnName]).forEach((fieldValue) => {
        const hedTags = datasetTags[columnName][fieldValue].map((hedTag) => {
          if (hedTag && hedTag.HEDTagID !== null) {
            const schemaElement = hedSchema.find((schemaTag) => {
              return schemaTag.id === hedTag.HEDTagID;
            });
            if (schemaElement && !idSet.has(schemaElement.id)) {
              idSet.add(schemaElement.id);
              const optGroup = schemaElement.longName.substring(
                0,
                schemaElement.longName.lastIndexOf('/')
              );
              return {
                HEDTagID: schemaElement.id,
                label: schemaElement.name,
                longName: schemaElement.longName,
                value: schemaElement.id,
                optgroup: optGroup.length > 0
                  ? `${optGroup} [${schemaElement.schemaName}]`
                  : schemaElement.name,
                Description: schemaElement.description,
              };
            }
          }
        });
        tagList.push(...hedTags.filter(
          (tag): tag is HEDTagOption => tag !== undefined
        ));
      });
    });
    return tagList.sort((tagA, tagB) => {
      return tagA.label.localeCompare(tagB.label);
    });
  };

  /** Get options. */
  const getOptions = (optionType: string) => {
    switch (optionType) {
    case 'ARTIFACTS':
      return artifactTagOptions;
    case 'DATASET':
      return getUniqueDatasetTags();
    default:
      return [];
    }
  };

  /** Build group span. */
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
  };

  /** Build HED badge. */
  const buildHEDBadge = (hedTag: HEDTag, belongsToEvent: boolean) => {
    return (
      <div
        key={`hed-tag-${hedTag.ID}`}
        className={
          `selection-filter-tags tag-hed
        ${getSchemaElementName(hedTag, true).includes('artifact')
        ? ' tag-hed-artifact'
        : ''
      }
         ${hedTag.TaggerName !== 'Data Authors'
        ? ' hed-badge-not-origin'
        : ''
      }`}
      >
        <div
          className={`selection-filter-tag${
            belongsToEvent ? '' : ' selection-filter-dataset-tag'
          }`}
        >
          <span className="filter-tag-name">
            {getSchemaElementName(hedTag, false)}
          </span>
          <span
            id={`hed-tag-${hedTag.ID}`}
            className={`tag-remove-button${belongsToEvent ? '' : ' dataset-tag-remove-button'}`}
            onClick={belongsToEvent ? handleDeleteTag : undefined}
            hidden={!belongsToEvent}
          >
          x
          </span>
        </div>
        <div className="badge-hed-tooltip">
          <div className="tooltip-title">
            {getSchemaElementName(hedTag, true)}
          </div>
          <br/>
          <div className="tooltip-description">
            {hedTag.schemaElement?.description}
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
                    ns: 'electrophysiology_browser',
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
                    ns: 'electrophysiology_browser',
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
                          </React.Fragment>;
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
  };

  /** Strikethrough text. */
  const strikethroughText = (text: string) => {
    const combiner = '\u0336';
    return text
      .split('')
      .map((char) => char + combiner)
      .join('');
  };

  /** Build HED badges. */
  const buildHEDBadges = (hedTags: HEDTag[], belongsToEvent = false) => {
    const rootTags = hedTags.filter((tag) => {
      return !hedTags.some((t) => {
        return tag.ID === t.PairRelID;
      });
    });

    const tagBadges: JSX.Element[] = [];

    rootTags.forEach((tag) => {
      if (deletedTagIDs.includes(tag.ID.toString())) {
        return;
      }
      let groupColorIndex = 0;
      if (tag.PairRelID === null) {
        tagBadges.push(buildHEDBadge(tag, belongsToEvent));
        groupColorIndex++;
      } else {
        const tagGroup: HEDTag[] = [];
        let groupMember: HEDTag | undefined = tag;
        while (groupMember) {
          const currentMember: HEDTag = groupMember;
          tagGroup.push(currentMember);
          groupMember = hedTags.find((hedTag) => {
            return hedTag.ID === currentMember.PairRelID;
          });
        }

        const tagBadgeGroup: JSX.Element[] = [];
        const tagBadgeSubgroup: JSX.Element[] = [];
        tagGroup.reverse().map((groupTag) => {
          if (groupTag.PairRelID === null) {
            tagBadgeGroup.push(buildHEDBadge(groupTag, belongsToEvent));
          } else {
            if (groupTag.HasPairing == '1') {
              if (groupTag.AdditionalMembers > 0 || tagBadgeSubgroup.length === 0) {
                const commaIndex = getNthMemberTrailingBadgeIndex(
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
              tagBadgeSubgroup.splice(
                0,
                tagBadgeSubgroup.length,
                buildHEDBadge(groupTag, belongsToEvent)
              );
            }
          }
        });
        tagBadges.push(...tagBadgeGroup);
      }
    });
    return tagBadges;
  };

  /** Close panel. */
  const closePanel = () => {
    setRightPanel('eventList');
    handleReset();
    setCurrentAnnotation(null);
    setTimeSelection(null);
    setActiveEvent(null);
    setPanelIsDirty(false);
  };

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
            ns: 'electrophysiology_browser',
          }
        )}
      </div>
      <div className="panel-body">
        <label style={{fontSize: '16px'}}>{t(
          'Event Details', {
            ns: 'electrophysiology_browser',
          }
        )}</label>
        <div className="form-row">
          <TextboxElement
            name="event-name"
            id="event-name"
            className={'form-control input-sm' + (
              currentAnnotation
                ? ' form-edit'
                : ''
            )}
            label="trial_type"
            value={currentAnnotation ? currentAnnotation.label : (label ?? '')}
            onUserInput={(_, value) => setLabel(value)}
            required={false/* currentAnnotation === null*/}
            disabled={currentAnnotation !== null}
            labelOuterClass={'flex-basis-40'}
            labelClass={'control-label'}
            elementClass={'additional-columns-outer'}
            inputClass={'additional-columns-inner'}
          />
          <div
            style={{
              display: 'flex',
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
                min={recordingTimeRange[0]}
                max={recordingTimeRange[1]}
                label="onset"
                noMargins={true}
                elementClass={'form-element-row numeric-element-row'}
                inputClass={'form-control input-sm' + (
                  currentAnnotation
                    ? ' form-edit'
                    : ''
                )}
                disabled={currentAnnotation !== null}
                value={eventTiming.onset.toString()}
                required={currentAnnotation === null}
                onUserInput={handleOnsetChange}
              />
              <NumericElement
                name="duration"
                id="duration"
                min={0}
                max={recordingTimeRange[1] - eventTiming.onset}
                label="duration"
                noMargins={true}
                elementClass={'form-element-row numeric-element-row'}
                inputClass={'form-control input-sm' + (
                  currentAnnotation
                    ? ' form-edit'
                    : ''
                )}
                disabled={currentAnnotation !== null}
                value={eventTiming.duration.toString()}
                required={currentAnnotation === null}
                onUserInput={handleDurationChange}
              />
              <NumericElement
                name="end-time"
                id="end-time"
                min={eventTiming.onset}
                max={recordingTimeRange[1]}
                label="end time"
                noMargins={true}
                elementClass={'form-element-row numeric-element-row'}
                inputClass={'form-control input-sm' + (
                  currentAnnotation
                    ? ' form-edit'
                    : ''
                )}
                disabled={currentAnnotation !== null}
                value={eventEndTime.toString()}
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
                    style={{whiteSpace: 'normal'}}
                  >
                    {t(
                      'Select from Montage', {
                        ns: 'electrophysiology_browser',
                      }
                    )}
                  </button>
                  <Modal
                    title={t(
                      'Select Channels', {
                        ns: 'electrophysiology_browser',
                      }
                    )}
                    throwWarning={throwChannelEditWarning}
                    onClose={() => {
                      setChannelSelectorVisible(false);
                    }}
                    show={channelSelectorVisible}
                  >
                    <ChannelsEditor
                      colorMap={{
                        color: '#8FBDFF',
                        mode: 'fill',
                        ids: eventChannels.map((channelName) => {
                          return channelMetadata.findIndex((channel) => {
                            return channel.name === channelName;
                          });
                        }).filter((index) => index !== -1),
                      }}
                      contentHeight='75vh'
                      cssClass={'scale-1_5'}
                      setCancelWarning={setThrowChannelEditWarning}
                      setEventChannels={setEventChannels}
                      eventChannels={eventChannels}
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
                  key={`channel-list-${
                    currentAnnotation
                      ? currentAnnotation.physiologicalTaskEventID
                      : 'new'
                  }`}
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
                      ? Array.from(new Set([
                        ...eventChannels,
                        ...(currentAnnotation?.channels ?? []),
                      ]))
                        .sort((channelA, channelB) => {
                          return channelMetadata.findIndex((channel) => channel.name === channelA)
                            - channelMetadata.findIndex((channel) => channel.name === channelB);
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
                              {/* !currentAnnotation?.channels.includes(channel) ? '*' : ''*/}
                            </span>
                          </span>;
                        })
                      : 'n/a'
                  }
                </div>

              </div>
            </div>
          </div>
          {
            Object.keys(datasetTags)
              .filter((column) => column !== 'trial_type')
              .length > 0 && (
              <>
                <Panel
                  collapsing={false}
                  id={`additional-columns-panel`}
                  class={'panel-primary additional-columns-panel'}
                  title={
                    <span style={{fontWeight: 'bold'}}>
                      {t('Additional Columns', {
                        ns: 'electrophysiology_browser',
                      }
                      )}
                    </span>
                  }
                  style={{
                    padding: '0 15px',
                    margin: '5px 15px 0 15px',
                  }}
                >
                  <div className="form-group">
                    {Object.keys(datasetTags)
                      .filter((column) => column !== 'trial_type')
                      .map((property, i) => {
                        return (
                          <TextboxElement
                            key={`property-${property}-${i}`}
                            name="property-name"
                            className={'form-control input-sm' + (
                              currentAnnotation ? ' form-edit' : ''
                            )}
                            label={property}
                            value={
                              currentAnnotation
                                ? currentAnnotation.properties.find(
                                  (prop) => prop.PropertyName === property
                                )?.PropertyValue ?? 'n/a'
                                : eventProperties[property]
                            }
                            onUserInput={(_, value) => setEventProperties({
                              ...eventProperties,
                              [property]: value,
                            })}
                            required={false}
                            disabled={currentAnnotation !== null}
                            labelOuterClass={'flex-basis-40'}
                            labelClass={
                              'event-label code-mimic word-break-word'
                            }
                            elementClass={'additional-columns-outer'}
                            inputClass={'additional-columns-inner'}
                          />
                        );
                      })}
                  </div>
                </Panel>
              </>
            )
          }
          <div className="hed-form-row form-group">
            <label
              className="control-label"
            >
              HED
              <InfoIcon
                title={t('Click this icon to view the latest HED schema', {
                  ns: 'electrophysiology_browser',
                }
                )}
                url='https://www.hedtags.org/display_hed.html'
              />
            </label>
            {currentAnnotation && currentAnnotation.hed && (
              currentAnnotation.hed.some(
                (hedTag) => hedTag.TaggerName !== 'Data Authors'
              ) || getTagsForEvent(currentAnnotation, datasetTags, hedSchema)
                .some((hedTag) => hedTag.TaggerName !== 'Data Authors')
            ) && (
              <div className='hed-attribution-note'>
                {t('※ = Not tagged by Data Authors', {
                  ns: 'electrophysiology_browser',
                })}
              </div>
            )}
            <div className='hed-tags-editor' style={{
              margin: '10px',
              clear: 'both',
            }}>
              {
                currentAnnotation && currentAnnotation.hed &&
                getTagsForEvent(currentAnnotation, datasetTags, hedSchema).length > 0 && (
                  <>
                    <div style={{clear: 'both'}}>
                      {t('Dataset', {
                        ns: 'electrophysiology_browser',
                      }
                      )}
                    </div>
                    {
                      buildHEDBadges(
                        getTagsForEvent(currentAnnotation, datasetTags, hedSchema),
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
                      ns: 'electrophysiology_browser',
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
              <div style={{marginLeft: '5px'}}>
                <div style={{fontWeight: 'bold'}}>
                  {t('Add tag from:', {
                    ns: 'electrophysiology_browser',
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
                    ns: 'electrophysiology_browser',
                  })}
                  emptyTextClass={'select-tag-text'}
                  required={false}
                  sortByValue={false}
                  onUserInput={(_name: string, value: string) => {
                    const addOption = addHedTagOptions.find((option) => {
                      return option.value === value;
                    });
                    if (addOption) {
                      handleAddTag(addOption.type);
                    }
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
                        })?.value ?? '',
                        {
                          ns: 'electrophysiology_browser',
                          count: 1,
                        }
                      ),
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
                          onUserInput={(_name: string, value: string) => {
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
                disabled={isSubmitted || !validate()}
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
                    !eventHasTiming &&
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
                        ns: 'loris',
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

          {/* {currentAnnotation &&*/}
          {/*  <button*/}
          {/*    type="button"*/}
          {/*    onClick={handleDelete}*/}
          {/*    className="btn btn-primary btn-xs"*/}
          {/*  >*/}
          {/*    Delete*/}
          {/*  </button>*/}
          {/* }*/}
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
}

export default AnnotationForm;
