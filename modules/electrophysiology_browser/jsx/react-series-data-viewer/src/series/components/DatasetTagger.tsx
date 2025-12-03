import React, {MutableRefObject, useEffect, useRef, useState} from 'react';
import * as R from 'ramda';
import {connect} from "react-redux";
import {RootState} from "../store";
import {CheckboxElement, SelectDropdown} from './Form';
import Panel from './Panel'; // Different from jsx/Panel
import {HEDSchemaElement, HEDTag} from "../store/types";
import {setAddedTags, setDatasetTags, setDeletedTags, setRelOverrides, setDatasetMetadata} from "../store/state/dataset";
import swal from "sweetalert2";
import {buildHEDString, getNthMemberTrailingBadgeIndex, getRootTags} from "../store/logic/filterEpochs";
import {colorOrder} from "../../color";

const TagAction = {
  'Select': {
    text: 'Select Action',
    icon: undefined,
    color: 'white',
  },
  'Endorsed': {
    text: 'Endorse',
    icon: 'flag',
    color: 'green',
  },
  'Caveat': {
    text: 'Caveat',
    icon: 'flag',
    color: 'red',
  },
  'Comment': {
    text: 'Comment',
    icon: 'comment',
    color: '#256eb6',
  },
}

type CProps = {
  physioFileID: number,
  hedSchema: HEDSchemaElement[],
  datasetTags: HEDTag,
  relOverrides: HEDTag[],
  addedTags: HEDTag[],
  deletedTags: HEDTag[],
  setAddedTags: (_: HEDTag[]) => void,
  setDeletedTags: (_: HEDTag[]) => void,
  channelDelimiter: string,
  setRelOverrides: (_: HEDTag[]) => void,
  setDatasetTags: (_: any) => void,
  activeMenuTab: string,
  setActiveMenuTab:  (_: string) => void,
  tabsRef: MutableRefObject<any>,
  tagsHaveChanges: boolean,
  setDatasetMetadata: (_: any) => void,
  filenamePrefix: string,
};

/**
 *
 * @param root0
 * @param root0.physioFileID
 * @param root0.datasetTags
 * @param root0.relOverrides
 * @param root0.hedSchema
 * @param root0.addedTags
 * @param root0.deletedTags
 * @param root0.channelDelimiter
 * @param root0.setAddedTags
 * @param root0.setDeletedTags
 * @param root0.setDatasetTags
 * @param root0.setRelOverrides
 * @param root0.activeMenuTab
 * @param root0.setActiveMenuTab
 * @param root0.tabsRef
 * @param root0.tagsHaveChanges
 * @param root0.setDatasetMetadata
 * @param root0.filenamePrefix
 */
const DatasetTagger = ({
  physioFileID,
  datasetTags,
  relOverrides,
  hedSchema,
  addedTags,
  deletedTags,
  channelDelimiter,
  setAddedTags,
  setDeletedTags,
  setDatasetTags,
  setRelOverrides,
  activeMenuTab,
  setActiveMenuTab,
  tabsRef,
  tagsHaveChanges,
  setDatasetMetadata,
  filenamePrefix,
}: CProps) => {
  const tagListID = 'searchable-hed-tags';
  const [searchText, setSearchText] = useState('');
  const [searchTextValid, setSearchTextValid] = useState(false);
  const [showLongFormHED, setShowLongFormHED] = useState(false);
  const [groupMode, setGroupMode] = useState(false);
  const [groupedTags, setGroupedTags] = useState<HEDTag[]>([]);
  const [activeColumnName, setActiveColumnName] = useState('');
  const [activeFieldValue, setActiveFieldValue] = useState('');
  const [submittingChanges, setSubmittingChanges] = useState(false);
  const [datasetTooltip, setDatasetTooltip] = useState({
    title: '',
    description: '',
    taggedBy: 0,
    taggerName: '',
    endorsements: [],
  });
  const [activeHEDSchemas, setActiveHEDSchemas] = useState({});
  const [numJSONSpaces, setNumJSONSpaces] = useState(2);
  const [showUnpublishedTags, setShowUnpublishedTags] = useState(false);

  const [activeEndorsementMenuItem, setActiveEndorsementMenuItem] = useState({
    action: 'Select',
    commentText: '',
  });
  const endorsementMenuRef = useRef(null);


  const handleOutsideClick = (event) => {
    // Currently the best way to distinguish outer box
    if (event.target.style.zIndex === '9999') {
      event.stopPropagation();
    }
  }

  const resetAllChanges = () => {
    setAddedTags([]);
    setDeletedTags([]);
    setRelOverrides([]);
    setGroupedTags([]);
  }

  const onModalClose = (event) => {
    if ([...addedTags, ...deletedTags].length > 0) {
      event.stopPropagation();
      swal.fire({
        title: 'Are you sure?',
        text: 'Leaving this window will result in the loss of any information entered.',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Proceed',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.value) {
          resetAllChanges();
          event.target.dispatchEvent((new Event('click', { bubbles: true, cancelable: true })));
        }
      });
    }
  }

  useEffect(() => {
    // Initialize active HED schemas
    const activeSchemas = {};
    hedSchema.forEach((tag) => {
      if (!activeSchemas.hasOwnProperty(tag.schemaName.toUpperCase())) {
        activeSchemas[tag.schemaName.toUpperCase()] = true;
      }
    });
    setActiveHEDSchemas(activeSchemas);

    // ff only one column, preselect it
    if (Object.keys(datasetTags).length === 1) {
      setColumnTo(Object.keys(datasetTags)[0]);
    }

    // Prevent default behaviour
    document.querySelector('#tag-modal-container > div')
      .addEventListener('click', handleOutsideClick, true);

    return () => {
      document.querySelector('#tag-modal-container > div')
        ?.removeEventListener('click', handleOutsideClick, true);

    };


    // Tabs initially invisible
    // tabsRef.current.style.display = 'none';
    // setActiveMenuTab('TAG_MODE');
  }, []);

  useEffect(() => {
    setDatasetMetadata({ tagsHaveChanges: false, });
  }, [tagsHaveChanges]);

  const generateTagID = (index: number) => {
    return `add_${Date.now()}${index}`;
  }

  const schemaTags : HEDSchemaElement[] = hedSchema.map((hedTag: HEDSchemaElement) => {
    return {
      ...hedTag,
      longName: hedTag.longName + (
        hedTag.parentID === null
          ? ' '   // Need to add space otherwise doesn't display
          : ''
      ),
    };
  });
  const parentNodes = schemaTags.filter((hedTag: HEDSchemaElement) => {
    return hedTag.parentID === null;
  });
  const inputFieldRef = useRef(null);

  const handleResetAllChanges = () => {
    swal.fire({
      title: 'Are you sure?',
      text: "This will undo all changes since your latest submission. You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, reset all changes!'
    }).then((result) => {
      if (result.value) {
        resetAllChanges();
      }
    });
  }

  const handleResetFieldChanges = () => {
    setAddedTags(addedTags.filter((tag) => {
      return !(
        tag.PropertyName === activeColumnName &&
        tag.PropertyValue === activeFieldValue
      );
    }));
    setDeletedTags(deletedTags.filter((tag) => {
      return !(
        tag.PropertyName === activeColumnName &&
        tag.PropertyValue === activeFieldValue
      );
    }));

    const relIDs = datasetTags[activeColumnName][activeFieldValue].map((tag) => {
      return tag.ID;
    })
    setRelOverrides(relOverrides.filter((tag) => {
      return !relIDs.includes(tag.ID);
    }));

    setGroupedTags([]);
  }

  const getFirstGroupTag = (tag: HEDTag) => {
    const tagsToSearch = applyOverrides([...addedTags, ...datasetTags[activeColumnName][activeFieldValue]]);

    let rootTag = tag;
    let tagFound = true;
    while (tagFound) {
      const previousTag = tagsToSearch.find((t) => {
        return t.PairRelID === rootTag.ID;
      });
      if (!previousTag) {
        tagFound = false; // redundant
        break;
      }
       rootTag = previousTag;
    }
    return rootTag;
  }

  const sortTagsByPlaceholderIDs = (tags: HEDTag[]) => {
    const sortedIDs = [];
    tags.forEach((tag) => {
      if (sortedIDs.includes(tag.ID))
        return;   // continue;
      const rootTag = getFirstGroupTag(tag);
      const tagPairings = getGroupedTagPairings([rootTag]);
      sortedIDs.push(
        ...[rootTag, ...tagPairings].map((t) => {
          return t.ID;
        })
      );
    });
    return tags.sort((a, b) => {
      return sortedIDs.indexOf(b.ID) - sortedIDs.indexOf(a.ID);
    });
  }

  const handleSubmitChanges = () => {
    setSubmittingChanges(true);
    const url = window.location.origin +
      '/electrophysiology_browser/events/';

    const updatedAddedTags = sortTagsByPlaceholderIDs(applyOverrides(addedTags));

    const editedTags = relOverrides.filter((tag) => {
      return !updatedAddedTags.some((t) => {
        return t.ID === tag.ID;
      }) && !deletedTags.some((t) => {
        return t.ID === tag.ID;
      });
    });

    const body = {
      request_type: 'dataset_tags',
      physioFileID: physioFileID,
      added_tags: updatedAddedTags, // So that new PairRelIDs can be referenced
      deleted_tags: deletedTags,
      edited_tags: editedTags,
    };

    fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify(body),
    }).then((response) => {
      setSubmittingChanges(false);
      if (response.ok) {
        return response.json();
      }
      throw (response);
    }).then((response) => {
      const updatedDatasetTags = datasetTags;

      deletedTags.forEach((deletedTag) => {
        const tagList = updatedDatasetTags[deletedTag.PropertyName][deletedTag.PropertyValue];
        updatedDatasetTags[deletedTag.PropertyName][deletedTag.PropertyValue] =
          tagList.filter((tag) => {
            return tag.ID !== deletedTag.ID
          });
      })

      applyOverrides(addedTags).forEach((addedTag) => {
        const pairRelTagMapping = response['mapping'].find((mapping) => {
          return mapping.AddID === addedTag.PairRelID
        });
        const addedTagID = addedTag.ID
        const tagMapping = response['mapping'].find((mapping) => {
          return mapping.AddID === addedTagID;
        });
        if (tagMapping) {
          addedTag.ID = tagMapping.RelID;
          addedTag.TaggerName = tagMapping.TaggerName;
          addedTag.TaggedBy = tagMapping.TaggedBy;
          if (pairRelTagMapping) {
            addedTag.PairRelID = pairRelTagMapping.RelID;
          }
          updatedDatasetTags[addedTag.PropertyName][addedTag.PropertyValue].push(
            addedTag
          );

          const tagInGrouped = groupedTags.find((tag: HEDTag) => {
            return tag.ID === addedTagID
          });
          if (tagInGrouped) {
            setGroupedTags([
              ...applyOverrides(groupedTags).filter((tag) => {
                return tag.ID !== addedTagID;
              }),
              addedTag
            ]);
          }
        } else {
          swal.fire(
            'Error',
            'There was an error with the response. Please report this incident.',
            'error'
          );
          return;
        }
      });

      editedTags.forEach((editedTag) => {
        const tagInDataset =
          updatedDatasetTags[editedTag.PropertyName][editedTag.PropertyValue]
            .find((tag) => {
              return tag.ID === editedTag.ID
            })
        ;
        if (!tagInDataset) {
          console.error('Unable to find an edited tag!');
          return;
        }
        const pairRelTagMapping = response['mapping'].find((mapping) => {
          return mapping.AddID === editedTag.PairRelID
        });

        updatedDatasetTags[editedTag.PropertyName][editedTag.PropertyValue] = [
          ...updatedDatasetTags[editedTag.PropertyName][editedTag.PropertyValue].filter((tag) => {
            return tag.ID !== editedTag.ID;
          }),
          {
            ...editedTag,
            PairRelID: pairRelTagMapping ? pairRelTagMapping.RelID : editedTag.PairRelID,
          },
        ];
      });

      // Filter invalidated tags
      Object.keys(updatedDatasetTags).forEach((columnName) => {
        Object.keys(updatedDatasetTags[columnName]).forEach((columnValue) => {
          updatedDatasetTags[columnName][columnValue] =
            updatedDatasetTags[columnName][columnValue].filter((tag) => {
              return !(tag.HEDTagID === null && tag.PairRelID === null);
            });
        });
      });

      setDatasetTags(updatedDatasetTags);
      setDatasetMetadata({ tagsHaveChanges: true });
      setAddedTags([]);
      setDeletedTags([]);
      setRelOverrides([]);

      swal.fire(
        'Success',
        'Tags updated successfully',
        'success'
      );
    }).catch((error) => {
      console.error(error);
      if (error.status === 401) {
        swal.fire(
          'Unauthorized',
          'This action is not permitted.',
          'error'
        );
      } else {
        swal.fire(
          'Error',
          'There was an error with the request! Please report this incident.',
          'error'
        );
      }
    });
  }

  const isDirty = (columnName: string, columnValue: string) => {
    return [...deletedTags, ...addedTags].some((tag) => {
        return tag.PropertyName === columnName
          && (
            columnValue.length > 0
              ? tag.PropertyValue === columnValue
              : true
        );
    }) || (
      columnValue.length === 0 &&
      Object.keys(datasetTags[columnName]).some((colVal) => {
        return datasetTags[columnName][colVal].some((tag) => {
          return relOverrides.map((relOverride) => {
            return relOverride.ID;
          }).includes(tag.ID);
        })
      })
    ) || (
      columnValue.length > 0 &&
      datasetTags[columnName][columnValue].some((tag) => {
       return relOverrides.map((relOverride) => {
         return relOverride.ID;
       }).includes(tag.ID);
     })
    );
  }

  useEffect(() => {
    // Override onClose()
    document
      .querySelector(
        '#tag-modal-container > div > div > div > span'
      ).addEventListener('click', onModalClose, true);

    return () => {
      document.querySelector(
        '#tag-modal-container > div > div > div > span')
        ?.removeEventListener('click', onModalClose, true);
    }
  }, [addedTags, deletedTags])

  const validateSearchTag = (longName: string) => {
    const hedTag = schemaTags.find((tag: HEDSchemaElement) => {
      return tag.longName === longName;
    })
    return hedTag ? hedTag.id : false;
  }

  const handleAddTag = () => {
    const tagText = inputFieldRef.current.value.trim();

    // Validate tag exists
    const hedTagID = validateSearchTag(tagText);
    const newTagID = generateTagID(0);

    if (hedTagID) {
      const hedTag = schemaTags.find((tag) => {
        return tag.id === hedTagID;
      })

      setAddedTags([
        ...addedTags,
        {
          schemaElement: hedTag,
          HEDTagID: hedTag.id,
          ID: newTagID,
          PropertyName: activeColumnName,
          PropertyValue: activeFieldValue,
          TagValue: null,
          Description:
            datasetTags[activeColumnName][activeFieldValue].length > 0
              ? datasetTags[activeColumnName][activeFieldValue][0].Description ?? ''
              : '',
          HasPairing: '0',
          PairRelID: null,
          AdditionalMembers: 0,
          TaggedBy: 0,
          TaggerName: 'You',
          Endorsements: [],
        }
      ]);
      setSearchText('');
      setSearchTextValid(false);
    } else {
      console.error('Failed to add tag. TODO: report')
    }
  }

  const handleRemoveTag = (tagRelID: any) => {
    if (groupMode) {
      console.warn('If you want to delete a tag, you cannot be in "Group Mode". Press the "Tag Mode" button');
      return;
    }

    const tagsToSearch = applyOverrides(datasetTags[activeColumnName][activeFieldValue]);
    const tagFromDataset = tagsToSearch.find((tag) => {
      return tag.ID == tagRelID;
    })

    if (tagFromDataset) {
      // Only allow deletion if not grouped
      const rootTags = getRootTags(tagsToSearch);

      const tagInRootTags = rootTags.find((tag) => {
        return tag.ID == tagFromDataset.ID
      });

      const tagInGroupedTags = applyOverrides(groupedTags).find((tag) => {
        return tag.ID == tagFromDataset.ID;
      })

      if (!tagInGroupedTags && tagInRootTags && tagInRootTags.PairRelID === null) {
        setDeletedTags([
          ...deletedTags,
          tagFromDataset
        ]);
      } else {
        console.error('You may not delete a grouped tag. Undo group first.');
      }
    } else {
      const updatedAddedTags = applyOverrides(addedTags);
      const updatedGroupedTags = applyOverrides(groupedTags);
      // Remove tag from addedTags
      if (tagRelID.startsWith('add_')) {
        const tagFromAdded = updatedAddedTags.find((tag) => {
          return tag.ID == tagRelID;
        });
        const tagInGroupedTags = tagFromAdded
          ? updatedGroupedTags.find((tag) => {
            return tag.ID == tagFromDataset.ID;
          })
          : false;
        if (!tagInGroupedTags && tagFromAdded) {
          setAddedTags(updatedAddedTags.filter((tag) => {
            return tag != tagFromAdded;
          }));
        }
      }
    }

    // Force tooltip removal
    handleHEDMouseLeave();
  }

  const handleTextChange = (e) => {
    const newText = e.target.value;
    let fullHEDString = newText;
    const hedTag = schemaTags.find((tag) => {
      return tag.name === newText;
    })
    if (hedTag && hedTag.longName.trim().length > fullHEDString.length)
      fullHEDString = hedTag.longName.trim();
    setSearchText(fullHEDString);
    setSearchTextValid(!!validateSearchTag(fullHEDString));
  }

  const handleFieldValueChange = (e) => {
    setActiveFieldValue(e.target.value);
    setGroupedTags([]);
    tabsRef.current.style.display = 'block';  // overkill - revise
  }

  const setColumnTo = (columnName: string) => {
    setActiveColumnName(columnName);
    setActiveFieldValue(null);
    setSearchText('');
  }

  const handleColumnValueChange = (e) => {
    setActiveColumnName(e.target.value);
    setActiveFieldValue(null);
    setSearchText('');
  }

  const getNumberOfDirectChildren = (tagName: string) => {
    return schemaTags.filter((hedTag) => {
      const tagSplit = hedTag.longName.split('/');
      return tagSplit.length === 2 && tagSplit[0] === tagName.trim();
    }).length;
  }

  // TODO: Revise this -- Breaks when a comment is present (different from HEDEndorsement)
  const tagInGroupIsEndorsed = (tag: HEDTag, tagList: HEDTag[]) => {
    return tag.Endorsements.length === 0 ||
      tag.Endorsements.every((endorsement) => {
        return endorsement.EndorsementStatus !== 'Endorsed'
      }) || (
        tag.PairRelID !== null &&
        tagInGroupIsEndorsed(tagList.find(t => t.ID === tag.PairRelID), tagList)
      );
  }

  const allTagsAreEndorsed = (hedTags: HEDTag[]) => {
    return hedTags.length > 0 &&
      !getRootTags(hedTags).some((rootTag) => {
        return tagInGroupIsEndorsed(rootTag, hedTags);
      });
  }

  const buildDataList = (onlyParentNodes: boolean) => {
    return (
      <datalist id={tagListID}>
        {
          (onlyParentNodes
            ? parentNodes
            : schemaTags
          ).map((hedTag) => {
            if (!activeHEDSchemas[hedTag.schemaName.toUpperCase()])
              return null;

            return (
              <option
                key={`${hedTag.name}-${onlyParentNodes ? 0 : 1}`}
                id={hedTag.name}
                value={hedTag.name}
                label={
                  onlyParentNodes
                    ? `Schema: ${hedTag.schemaName.toUpperCase()}`
                    : `[${hedTag.schemaName.toUpperCase()}] ${hedTag.longName}`
                }
                title={hedTag.longName}
              />
            )
          })
        }
      </datalist>
    );
  }

  const buildColumnNames = () => {
    return columnOptions.filter((column) => {
      return column.value !== 'channels' // Removed until recognized
        && column.field_values.filter((value) => {
          return !['', 'n/a'].includes(value);  // Column has real values
        }).length > 0
    }).map((column) => {
      const columnName = column.value;
      const columnIsDirty = isDirty(columnName, '');

      return (
        <option
          key={`column-name-${columnName}`}
          value={columnName}
        >
          {columnName + (columnIsDirty ? ' (edited)' : '')}
        </option>
      )
    });
  }

  const buildFieldValues = (columnName: string) => {
    const column = columnOptions.find((opt) => {
      return opt.value === columnName
    });

    if (!column)
      return null;

    return column.field_values
        .filter((value) => value !== '')
        .map((fieldValue) => {
      const valueIsDirty = isDirty(columnName, fieldValue);
      const tagsAreEndorsed = allTagsAreEndorsed(datasetTags[columnName][fieldValue]);
      return (
        <option
          key={`field-value-${fieldValue}`}
          className={tagsAreEndorsed ? 'hed-endorsed' : ''}
          value={fieldValue}
          style={{
            color: valueIsDirty ? '#F0AD4E' : 'black',
          }} // Color instead of background due to unexpected behaviour
        >
          {fieldValue + (valueIsDirty ? ' (edited)' : '')}
        </option>
      )
    })
  }

  const handleHEDMouseEnter = (hedTagElement: HEDTag) => {
    if (hedTagElement) {
      setDatasetTooltip({
        title: hedTagElement.schemaElement.longName,
        description: hedTagElement.schemaElement.description,
        taggedBy: hedTagElement.TaggedBy,
        taggerName: hedTagElement.TaggerName,
        endorsements: hedTagElement.Endorsements,
     });
    }
  }

  const handleHEDMouseLeave = () => {
    clearDatasetTooltip();
  }

  const clearDatasetTooltip = () => {
    setDatasetTooltip({
      title: '',
      description: '',
      taggedBy: 0,
      taggerName: '',
      endorsements: [],
    });
  }

  const getGroupedTagPairings = (hedTags: HEDTag[]) => {
    const tagPairings = [];
    if (activeFieldValue) { // null between transitions
      hedTags.forEach((hedTag) => {
        let pairRelID = hedTag.PairRelID;
        while (pairRelID !== null) {
          const pairRelTag = applyOverrides([...addedTags, ...datasetTags[activeColumnName][activeFieldValue]])
            .find((t) => {
              return t.ID == pairRelID;
            });
          if (pairRelTag) {
            tagPairings.push(pairRelTag);
            pairRelID = pairRelTag.PairRelID;
          } else {
            console.warn(`Something went wrong. Tag with ID ${pairRelID} not found. Should not proceed.`);
            pairRelID = null;
          }
        }
      });
    }
    return tagPairings;
  }

  const buildGroupSpan = (char: string, colorIndex: number) => {
    return (
      <span
        key={`group-span-${char}-${colorIndex}`}
        style={{
          fontSize: '30px',
          position: 'relative',
          bottom: '8px',
          color: colorOrder(colorIndex.toString()).toString(),
      }}>
        {char}
      </span>
    );
  }

  const buildHEDBadges = (tags: HEDTag[]) => {
    const hedTags = activeMenuTab === 'TAG_MODE'
      ? applyOverrides(tags).filter((tag) => {
        // Filter out invalidated addedTags that were added for structure (HEDTagID === null) and DB garbage
        return tag.HEDTagID !== null || tag.PairRelID !== null;
      })
     : tags.map(addSchemaElement);

    const rootTags = getRootTags(hedTags);
    const tagBadges = [];

    rootTags.forEach((tag) => {
      let groupColorIndex = 0;
      if (tag.PairRelID === null) {
        tagBadges.push(buildHEDBadge(
          tag.schemaElement.longName, tag.ID.toString(),
          true, tag.TaggerName ===  'Data Authors'
        ));
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
        tagGroup.reverse().map((groupTag: HEDTag) => {
          if (groupTag.PairRelID === null) {
            tagBadgeGroup.push(buildHEDBadge(
              groupTag.schemaElement.longName, groupTag.ID,
              true, tag.TaggerName ===  'Data Authors'
            ));
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
                  tagBadgeGroup.splice(0, 0, buildHEDBadge(
                    groupTag.schemaElement.longName, groupTag.ID,
                    true, tag.TaggerName ===  'Data Authors'
                  ));
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
                    tagBadgeSubgroup.splice(0, 0, buildHEDBadge(
                      groupTag.schemaElement.longName, groupTag.ID,
                      true, tag.TaggerName ===  'Data Authors'
                    ));
                    tagBadgeSubgroup.splice(0, 0, buildGroupSpan('(', groupColorIndex));
                    tagBadgeSubgroup.push(buildGroupSpan(')', groupColorIndex));
                  } else {
                    tagBadgeGroup.splice(0, 0, buildHEDBadge(
                      groupTag.schemaElement.longName, groupTag.ID,
                      true, tag.TaggerName ===  'Data Authors'
                    ));
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
              tagBadgeSubgroup.splice(0, tagBadgeSubgroup.length,
                buildHEDBadge(groupTag.schemaElement.longName, groupTag.ID,
                true, tag.TaggerName ===  'Data Authors'
              ));
            }
          }
        });
        tagBadges.push(...tagBadgeGroup);
      }
    });
    return tagBadges;
  }

  const buildHEDBadge = (
    text: string,
    relID: string,
    isSubmitted: boolean = true,
    taggedByOrigin: boolean = false
  ) => {
    const hedTag = schemaTags.find((tag) => {
      return tag.longName.trim() === text;
    });

    const tagsToSearch =
      activeMenuTab === 'TAG_MODE'
        ? applyOverrides([...addedTags, ...datasetTags[activeColumnName][activeFieldValue]])
        : datasetTags[activeColumnName][activeFieldValue].map(addSchemaElement);

    let hedTagObj = isSubmitted && tagsToSearch.find((tag) => {
      return tag.ID == relID;
    });

    const tagIsGrouped = hedTagObj && hedTagObj.HasPairing == '1' || (
      tagsToSearch.some((tag) => {
        return tag.PairRelID ? tag.PairRelID.toString() : undefined === relID
      })
    );

    let tagIsSelected = false;

    if (hedTagObj && activeMenuTab === 'TAG_MODE') {
      tagIsSelected = applyOverrides(groupedTags).some((tag) => {
        if (tag.ID == relID) {
          return true;
        }
        if (tag.PairRelID) {
          let tagObject = tagsToSearch.find((t) => {
              return t.ID == tag.ID;
            });
          while (tagObject && (tagObject.PairRelID !== null || tagObject.HasPairing == '1')) {
            tagObject = tagsToSearch.find((t) => {
                return t.ID == tagObject.PairRelID;
              });
            if (tagObject && tagObject.ID == relID) {
              return true;
            }
          }
        }
      });
    }

    let tagClassName = 'selection-filter-tag selection-filter-dataset-tag dataset-filter-tag';
    tagClassName += isSubmitted ? '' : ' dataset-tag-dirty';
    tagClassName += tagIsSelected ? ' dataset-tag-selected' : '';

    return (
      <div
        key={`hed-badge-${relID}`}
        className={
          'selection-filter-tags dataset-tag-hed' + (
            !taggedByOrigin ? ' hed-badge-not-origin' : ''
          )
        }
        onMouseEnter={() => {
          handleHEDMouseEnter(hedTagObj);
        }}
        onMouseLeave={handleHEDMouseLeave}
        onClick={(e) => {
          if (!isSubmitted || (!groupMode && !e.shiftKey))
            return;

          if (activeMenuTab === 'TAG_MODE') { // GROUP MODE
            if (hedTagObj) {
              let tagRelID = relID;
              if (tagIsGrouped) {
                // Find leaf tag
                let pairRelObj = hedTagObj;
                while (pairRelObj !== undefined) {
                  tagRelID = pairRelObj.ID;
                  hedTagObj = pairRelObj;
                  pairRelObj = tagsToSearch.find((tag) => {
                    return tag.PairRelID === pairRelObj.ID;
                  });
                }
              }
              if (tagIsSelected) {
                // Remove leaf
                setGroupedTags(applyOverrides(groupedTags).filter((tag) => {
                  return tag.ID != tagRelID;
                }));
              } else {
                // Add leaf
                setGroupedTags([...groupedTags, hedTagObj]);
              }
            } else {
              console.error(`Tag not found: ${relID}`);
            }
          }
        }}
      >
        <div className={tagClassName}>
          <span
            className="filter-tag-name dataset-tag-name"
            style={{
              maxWidth: `calc(100% - ${activeMenuTab === 'TAG_MODE' ? 20 : 0}px)`,
            }}
          >
            {
              hedTag
                ? showLongFormHED
                  ? hedTag.longName
                  : hedTag.name
                : text
            }
          </span>
          {
            activeMenuTab === 'TAG_MODE' && (
              <span
                id={`hed-tag-${relID}`}
                className='tag-remove-button dataset-tag-remove-button'
                onClick={() => {
                  if (isSubmitted) {
                    handleRemoveTag(relID);
                  } else {
                    setSearchText('');
                    clearDatasetTooltip();
                  }
                }}
              >
                x
              </span>
            )
          }
        </div>
      </div>
    );
  }

  const addSchemaElement = (hedTag: HEDTag) => {
    const schemaElement = schemaTags.find((tag) => {
      return tag.id == hedTag.HEDTagID;
    })
    return {
      ...hedTag,
      schemaElement: schemaElement,
    };
  }

  const applyOverrides = (hedTags: HEDTag[]): HEDTag[] => {
    return hedTags.map((hedTag) => {
      let schemaElement = hedTag.schemaElement;

      const overriddenTag = relOverrides.find((tag) => {
        return tag.ID == hedTag.ID;
      });
      if (overriddenTag) {
        hedTag = {
          ...hedTag,
          HasPairing: overriddenTag.HasPairing,
          PairRelID: overriddenTag.PairRelID,
          AdditionalMembers: overriddenTag.AdditionalMembers,
        }
      }
      return (hedTag.HEDTagID !== null && !schemaElement)
        ? addSchemaElement(hedTag)
        : hedTag;
    })
  }


  const columnOptions = Object.keys(datasetTags).map((column) => {
    return {
      label: column,
      value: column,
      description: '',
      field_values: Object.keys(datasetTags[column]).map((columnValue) => {
        return columnValue;
      })
    }
  });

  const handleConfirmGroup = () => {
    const updatedGroupTags = applyOverrides(groupedTags);
    const newTags = [];
    const tagOverrides = [];

    // Tag created before first
    const newTagID = generateTagID(0);
    const newTag: HEDTag = {
      schemaElement: null,
      HEDTagID: null,
      ID: newTagID,
      PropertyName: activeColumnName,
      PropertyValue: activeFieldValue,
      TagValue: null,
      Description: updatedGroupTags[0].Description,
      HasPairing: '1',
      PairRelID: updatedGroupTags[0].ID,
      AdditionalMembers: updatedGroupTags.length - 1,
      TaggedBy: 0,
      TaggerName: 'You',
      Endorsements: [],
    }
    newTags.push(newTag);

    updatedGroupTags.forEach((rootTag, groupTagIndex) => {
      const tagPairings = applyOverrides(getGroupedTagPairings([rootTag]));
      const leafTag = tagPairings.length > 0 ? tagPairings.slice(-1)[0] : rootTag;
      const leafHadPairing = leafTag.HasPairing == '1';

      if ((groupTagIndex + 1) < updatedGroupTags.length) {
        tagOverrides.push({
          ...leafTag,
          HasPairing: '0',
          PairRelID: updatedGroupTags[groupTagIndex + 1].ID,
        });
      }

      if (leafHadPairing) {
        console.error('Something went wrong');
      }
    });

    setAddedTags([...addedTags, ...newTags]);
    setRelOverrides([
      ...relOverrides.filter((t) => {
        return !tagOverrides.some((relTag) => {
          return relTag.ID === t.ID;
        })
      }),
      ...tagOverrides
    ]);

    setGroupedTags([]);
  }

  const handleUndoGroup = () => {
    let firstTag = applyOverrides(groupedTags)[0];
    const tagPairings = getGroupedTagPairings([firstTag]);
    const tagOverrides = [];
    // Remove pairings
    [firstTag, ...tagPairings].forEach((tag) => {
      tagOverrides.push({
        ...tag,
        HasPairing: '0',
        PairRelID: null,
        AdditionalMembers: 0,
      });
    });

    setRelOverrides([
      ...relOverrides.filter((t) => {
        return !tagOverrides.some((relTag) => {
          return relTag.ID === t.ID;
        })
      }),
      ...tagOverrides
    ]);

    setGroupedTags([]);
    // TODO: IF REL SAME AS OG, DELETE FROM REL
  }

  const handleSchemaFieldClick = (key, action) => {
    setActiveHEDSchemas({
      ...activeHEDSchemas,
      [key]: action === 'check'
    });
  }

  const handleToggleAllSchemas = (action) => {
    const active = action === 'check';
    setActiveHEDSchemas(
      Object.keys(activeHEDSchemas).reduce((schemas, schema) => {
        return {
          ...schemas,
          [schema]: active
        };
      }, {})
    );
  }

  const convertDatasetTagsToJSON = () => {
    const assembledHEDTags = {};

    // Add channel delimiter
    if (channelDelimiter.length > 0) {
      assembledHEDTags['channel'] = {
        'Description': 'Channel(s) associated with the event',
        'Delimiter': channelDelimiter,
      };
    }

    // Add HED columns
    Object.keys(datasetTags)
      .sort()   // Sort for demo -- TODO: establish convention
      .forEach((propertyName) => {
      assembledHEDTags[propertyName] = {
        'Levels': {},
        'HED': {},
      };
      Object.keys(datasetTags[propertyName])
        .forEach((propertyValue) => {

          const hedTags = showUnpublishedTags
            ? applyOverrides([
              ...datasetTags[propertyName][propertyValue]
                .filter((datasetTag) => {
                  return !deletedTags.find((tag) => {
                    return tag.ID === datasetTag.ID;
                  });
                }),
              ...addedTags.filter((tag) => {
                return tag.PropertyName === propertyName
                  && tag.PropertyValue === propertyValue;
              }),
            ])
            : datasetTags[propertyName][propertyValue].map(addSchemaElement);

          assembledHEDTags[propertyName]['Levels'][propertyValue] =
            hedTags.length > 0
              ? hedTags[0].Description ?? ''
              : '';
          assembledHEDTags[propertyName]['HED'][propertyValue] =
            buildHEDString(hedTags, showLongFormHED).join(', ');
        });
    });

    return assembledHEDTags;
  }

  const downloadEventsJSON = (e) => {
    const jsonString = JSON.stringify(
      convertDatasetTagsToJSON(),
      undefined,
      numJSONSpaces
    );
    const jsonBlob = new Blob([jsonString], { type: "application/json" });
    (e.target as HTMLAnchorElement).href = URL.createObjectURL(jsonBlob);
  }

  const submitHEDEndorsement = () => {
    setSubmittingChanges(true);
    const url = window.location.origin +
      '/electrophysiology_browser/events/';

    const body = {
      request_type: 'endorse_dataset_tags',
      physioFileID: physioFileID,
      property_name: activeColumnName,
      property_value: activeFieldValue,
      endorsement_status: activeEndorsementMenuItem.action,
      endorsement_comment: activeEndorsementMenuItem.action === 'Comment'
        ? activeEndorsementMenuItem.commentText
        : null
    };

    fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify(body),
    }).then((response) => {
      setSubmittingChanges(false);
      if (response.ok) {
        return response.json();
      }
      throw (response);
    }).then((response) => {
      const endorsement = {
        EndorsedBy: response.endorsedBy,
        EndorsedByID: response.endorsedByID,
        EndorsementComment: activeEndorsementMenuItem.commentText,
        EndorsementStatus: activeEndorsementMenuItem.action,
        EndorsementTime: response.endorsementTime,
      };

      datasetTags[activeColumnName][activeFieldValue] = datasetTags[activeColumnName][activeFieldValue].map((tag) => {
        return {
          ...tag,
          Endorsements: [
            ...tag.Endorsements,
            endorsement,
          ]
        }
      });
      setDatasetTags(datasetTags);
      setActiveEndorsementMenuItem({
        action: 'Select',
        commentText: '',
      });
      swal.fire(
        'Success',
        'Endorsement successful',
        'success'
      );
    }).catch((error) => {
      console.error(error);
      if (error.status === 401) {
        swal.fire(
          'Unauthorized',
          'This action is not permitted.',
          'error'
        );
      } else {
        swal.fire(
          'Error',
          'There was an error with the request! Please report this incident.',
          'error'
        );
      }
    });
  }

  if (activeMenuTab === 'JSON_MODE') {
    return (
      <div style={{ /* TODO: create outer class */
        display: 'flex',
        flexDirection: 'column',
        height: '62vh',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          marginBottom: '5px',
        }}>
          <div style={{
            display: 'flex',
            marginLeft: '2.5%',
            flex: 1,
          }}>
            Below is the resulting events.json file
          </div>
          <div style={{
            marginRight: '2.5%',
          }}>
            <a
              id='download-events-json'
              className='btn btn-default'
              style={{ marginLeft: '10px', }}
              onClick={downloadEventsJSON}
              download={`${filenamePrefix}_events.json`}
            >
              <span className="glyphicon glyphicon-download-alt"/>
              &nbsp;&nbsp;Download
            </a>
          </div>
        </div>
        <div
          style={{
            width: '95%',
            resize: 'none',
            overflowY: 'scroll',
            border: 'solid 2px #256eb6',
            borderRadius: '5px',
            flex: 8,
          }}
        >
          <pre style={{ margin: 0, }}>
            {
              JSON.stringify(
                convertDatasetTagsToJSON(),
                undefined,
                numJSONSpaces
              )
            }
          </pre>
        </div>
      </div>
    );
  } else {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '62vh'
      }}>
        <div
          style={{
            flexBasis: '80%',
            display: 'flex',
            flexDirection: 'row',
            overflowY: 'hidden'
          }}>
          <div
            style={{
              flexBasis: '25%',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/*<div style={{*/}
            {/*  fontWeight: 'bold',*/}
            {/*  marginBottom: '5px',*/}
            {/*}}>*/}
            {/*  <span className='code-mimic'>trial_type</span> values*/}
            <div style={{ width: '90%', }}>
              <label htmlFor={'select_column'}>Column Name</label>
            </div>
            <div style={{ width: '90%', }}>
              <select
                id='select_column'
                className={'form-control input-sm' + (
                  activeColumnName.length === 0
                    ? ' select-placeholder-text'
                    : ''
                )}
                style={{ width: '100%' }}
                value={activeColumnName ?? ''}
                onChange={handleColumnValueChange}
              >
                <option
                  key={`column-name-placeholder`}
                  value={''}
                >
                  Select a column
                </option>
                {buildColumnNames()}
              </select>
            </div>
            <div style={{ fontWeight: 'bold', }}>
              {
                activeColumnName.length > 0
                  ? <span className='code-mimic'>{activeColumnName}</span>
                  : 'Column'
              }
              &nbsp;Values
            </div>
            <select
              id='field-levels'
              size={10}
              style={{ width: '90%', height: '40vh', }}
              value={activeFieldValue ?? ''}
              onChange={handleFieldValueChange}
            >
              {buildFieldValues(activeColumnName)}
            </select>
            <div
              id='dataset-hed-tooltip'
              style={{
                display: `${datasetTooltip.title.length > 0 ? 'block' : 'none'}`,
              }}
            >
              <div style={{ fontSize: '14px', fontWeight: 'bold', }}>
                {datasetTooltip.title}
              </div>
              <div className='tooltip-description'>
                {datasetTooltip.description}
              </div>
              {/* tooltip-footer below */}
              <div className='tooltip-footer tooltip-footer-viewer'>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  fontSize: '12px',
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                  }}>
                    <div style={{
                      flexBasis: '40%',
                      textAlign: 'right',
                    }}>
                      Tagged By:
                    </div>
                    <div style={{
                      flexBasis: '60%',
                      textAlign: 'left',
                      paddingLeft: '5px',
                    }}>
                      {datasetTooltip.taggerName}
                    </div>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                }}>
                  <div style={{
                    flexBasis: '40%',
                    textAlign: 'right',
                  }}>
                    Endorsed By:
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
                          datasetTooltip.endorsements.length > 0
                            ? datasetTooltip.endorsements.filter((endorsement) => {
                              return ['Endorsed', 'Caveat']
                                .includes(endorsement.EndorsementStatus);
                            })
                              .map((endorsement, i) => {
                                return <React.Fragment key={`flag-${endorsement.EndorsedByID}-${i}`}>
                                  {endorsement.EndorsedBy}
                                  <i
                                    className='glyphicon glyphicon-flag'
                                    style={{
                                      color: endorsement.EndorsementStatus === 'Endorsed'
                                        ? 'green'
                                        : 'red',
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
          <div
            style={{
              flexBasis: '75%',
              overflowY: 'scroll',
            }}>
            {
              (activeFieldValue === null || activeFieldValue === '') && (
                <div
                  style={{
                    textAlign: 'center',
                    lineHeight: '45vh',
                    fontSize: '18px',
                    fontStyle: 'italic',
                  }}
                >
                  Select a Column Name and Value to Manage HED Tags
                  {/*Select a <span className='code-mimic'>trial_type</span> value to Manage HED Tags*/}
                </div>
              )
            }
            {
              (activeFieldValue !== null && activeFieldValue !== '') && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                      margin: '5px 15px',
                    }}>
                      <div
                        style={{
                          flexBasis: '25%',
                          fontWeight: 'normal',
                          textAlign: 'center',
                        }}>
                        <span style={{ fontWeight: 'bold',}}>
                          {activeFieldValue}
                        </span>
                        <br/>
                        Description
                      </div>
                      <div
                        style={{
                          flexBasis: 'calc(100% * 2 / 3)',
                          flexGrow: 1,
                        }}>
                        <textarea
                          placeholder='No Description Available'
                          style={{
                            // minWidth: '47vw',
                            // maxWidth: '47vw',
                            width: '100%',
                            // height: '100%',
                            minHeight: '25px',
                            maxHeight: '60px',
                            // resize: activeMenuTab === 'TAG_MODE'
                            //   ? 'vertical'
                            //   : 'none',
                            fontStyle: 'italic',
                            resize: 'none',
                            border: 'none',
                          }}
                          readOnly={true}
                          value={
                            datasetTags[activeColumnName] && datasetTags[activeColumnName][activeFieldValue] &&
                            datasetTags[activeColumnName][activeFieldValue].length > 0
                              ? datasetTags[activeColumnName][activeFieldValue][0].Description ?? ''
                              : ''
                          }
                        />
                      </div>
                    </div>

                    <fieldset
                      style={{
                        margin: '5px 15px',
                        maxHeight: '26vh',
                        overflowY: 'scroll',
                      }}
                    >
                      <legend>HED Tags</legend>
                      {
                        buildHEDBadges(
                          activeMenuTab === 'TAG_MODE'
                            ? [
                              ...(datasetTags[activeColumnName] && datasetTags[activeColumnName][activeFieldValue])
                                ? datasetTags[activeColumnName][activeFieldValue].filter((datasetTag) => {
                                  return !deletedTags.find((tag) => {
                                    return tag.ID === datasetTag.ID;
                                  });
                                })
                                : [],
                              ...addedTags.filter((tag) => {
                                return tag.PropertyName === activeColumnName
                                  && tag.PropertyValue === activeFieldValue;
                              })
                            ]
                            : datasetTags[activeColumnName][activeFieldValue]
                        ).map((badge) => {
                          return badge;
                        })
                      }
                      {
                        activeMenuTab === 'TAG_MODE'
                        && searchText.length > 0
                        && buildHEDBadge(
                          searchText,
                          null,
                          false,
                          false
                        )
                      }
                    </fieldset>

                    {/* Add tag */}
                    <fieldset style={{
                      margin: '5px 15px',
                      paddingBottom: '1.15em',
                    }}>
                      <legend>Add Tag from HED Schemas</legend>
                      <form
                        autoComplete="off"
                        onSubmit={(e) => {e.preventDefault()}}
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <div
                          id='select-schema-dropdown'
                          style={{
                            width: '25%',
                          }}
                        >
                          <SelectDropdown
                            multi={true}
                            options={activeHEDSchemas}
                            onFieldClick={handleSchemaFieldClick}
                            onToggleAll={handleToggleAllSchemas}
                          />
                        </div>
                        <input
                          id='hed-tag-input'
                          ref={inputFieldRef}
                          name='hed-tag-input'
                          type='text'
                          list={tagListID}
                          placeholder='Type to search or select from dropdown'
                          style={{
                            width: 'calc(100% - 50px)',
                          }}
                          value={searchText}
                          onChange={handleTextChange}
                          disabled={activeMenuTab !== 'TAG_MODE'}
                        />
                        <button
                          className='btn btn-primary'
                          style={{
                            width: '40px',
                            marginLeft: '5px',
                            height: '26.5px',
                            padding: 'unset',
                            verticalAlign: 'unset'
                          }}
                          onClick={handleAddTag}
                          disabled={!searchTextValid || activeMenuTab !== 'TAG_MODE'}
                        >
                          Add
                        </button>
                        {buildDataList(searchText.length === 0)}
                      </form>
                    </fieldset>

                    <div style={{
                      width: 'fit-content',
                      margin: '5px 15px',
                    }}>
                    {
                      datasetTags[activeColumnName][activeFieldValue].length > 0 && (
                        <Panel
                          id={`tagged-by-panel-${activeColumnName}-${activeFieldValue}`}
                          key={`tagged-by-panel-${activeColumnName}-${activeFieldValue}`}
                          class={'panel-primary dataset-tagged-by-panel'}
                          title={
                            <>
                              Tagged By:&nbsp;
                              {
                                datasetTags[activeColumnName][activeFieldValue]
                                  .map(tag => tag.TaggerName)
                                  .filter((tagger, index, taggers) => {
                                    return taggers.indexOf(tagger) === index; // unique list
                                  })
                                  .join(', ')
                              }
                              &emsp;
                              {
                                datasetTags[activeColumnName][activeFieldValue].find(
                                  tag => tag.Endorsements.some(
                                    endorsement => endorsement.EndorsementStatus === 'Endorsed'
                                  )
                                ) && (
                                  <i
                                    className='glyphicon glyphicon-flag glyphicon-endorsement-panel'
                                    style={{color: 'green',}}
                                  />
                                )
                              }
                              {
                                datasetTags[activeColumnName][activeFieldValue].find(
                                  tag => tag.Endorsements.some(
                                    endorsement => endorsement.EndorsementStatus === 'Caveat'
                                  )
                                ) && (
                                  <i
                                    className='glyphicon glyphicon-flag glyphicon-endorsement-panel'
                                    style={{color: 'red',}}
                                  />
                                )
                              }
                              {
                                datasetTags[activeColumnName][activeFieldValue].find(
                                  tag => tag.Endorsements.some(
                                    endorsement => endorsement.EndorsementComment
                                  )
                                ) && (
                                  <i
                                    className='glyphicon glyphicon-comment glyphicon-endorsement-panel'
                                    style={{color: '#256eb6',}}
                                  />
                                )
                              }
                            </>
                          }
                          initCollapsed={true}
                          collapsed={true}
                          style={{backgroundColor: 'white',}}
                        >
                          <div>
                            {
                              datasetTags[activeColumnName][activeFieldValue].some((tag) => {
                                return tag.Endorsements.length > 0;
                              }) ? (
                                  <ul style={{
                                    margin: 0,
                                    marginLeft: '-10px',
                                  }}>
                                    {
                                      datasetTags[activeColumnName][activeFieldValue]
                                        .filter((hedTag) => {
                                          return hedTag.Endorsements.length > 0;
                                        })
                                        .reduce((endorsements, hedTag) => {
                                          const uniqueEndorsements = hedTag.Endorsements
                                            .filter((endorsement) => {
                                              return !endorsements.find(
                                                v => (
                                                  v.EndorsementTime.slice(0, -1) === endorsement.EndorsementTime.slice(0, -1)
                                                  && v.EndorsementComment === endorsement.EndorsementComment
                                                )
                                              );
                                            });
                                          return [
                                            ...endorsements,
                                            ...uniqueEndorsements,
                                          ];
                                        }, [])
                                        .sort((a, b) =>
                                          a.EndorsementTime - b.EndorsementTime
                                        )
                                        .map((endorsement) => {
                                          return (
                                            <React.Fragment key={`endorsement-${endorsement.EndorsedByID}`}>
                                              {
                                                endorsement.EndorsementStatus !== 'Comment' && (
                                                  <li key={`li-${endorsement.EndorsedByID}`}
                                                      className={'hed-endorsement hed-' +
                                                    endorsement.EndorsementStatus.toLowerCase()
                                                  }>
                                                    <div
                                                      style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                      }}
                                                    >
                                                      <span>
                                                        {endorsement.EndorsedBy}
                                                      </span>
                                                      <span style={{ marginLeft: '50px', }}>
                                                        {endorsement.EndorsementTime.slice(0, -3)}
                                                      </span>
                                                    </div>
                                                  </li>
                                                )
                                              }
                                              {
                                                endorsement.EndorsementComment && (
                                                  <li key={`endorsement-${endorsement.EndorsedByID}`}
                                                      className='hed-endorsement hed-comment'>
                                                    <div
                                                      style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                      }}
                                                    >
                                                      <div>
                                                        <span>
                                                          {endorsement.EndorsedBy}:&nbsp;
                                                        </span>
                                                        <span style={{fontStyle: 'italic',}}>
                                                          {endorsement.EndorsementComment}
                                                        </span>
                                                      </div>
                                                      <span style={{ marginLeft: '50px', }}>
                                                        {endorsement.EndorsementTime.slice(0, -3)}
                                                      </span>
                                                    </div>
                                                  </li>
                                                )
                                              }
                                            </React.Fragment>
                                          );
                                        })
                                    }
                                  </ul>
                                )
                                : 'No comment'
                            }
                          </div>
                        </Panel>
                      )
                    }
                  </div>
                  </div>
              )
            }
          </div>
        </div>
        <div style={{
          flexBasis: '20%',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div
            style={{
              flexBasis: '50%',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {
              (activeFieldValue !== null && activeFieldValue !== '') && (
                <>
                  <CheckboxElement
                    name='toggle-long-hed'
                    offset=''
                    label={<span>Show long-form HED tags</span>}
                    value={showLongFormHED}
                    onUserInput={() => {
                      setShowLongFormHED(!showLongFormHED);
                    }}
                    outerStyles={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      paddingLeft: '32px',
                      alignItems: 'center',
                      flex: 1,
                    }}
                  />
                  <div style={{
                    flexBasis: '25%',
                    display: 'flex',
                    alignItems: 'end',
                    paddingLeft: '15px',
                  }}>
                    ※ = Not tagged by Data Authors
                  </div>
                  {
                    groupedTags.length > 0 && (
                      <>
                        <div style={{
                          flexBasis: '75%',
                          textAlign: 'left',
                          marginTop: '10px',
                        }}>
                          <span style={{ fontWeight: 'bold', }}>Preview</span>: <span>(</span>
                          {
                            buildHEDString(
                              [...applyOverrides(groupedTags), ...getGroupedTagPairings(applyOverrides(groupedTags))],
                              showLongFormHED
                            ).join(', ')
                          }
                          <span>)</span>
                        </div>
                      </>
                    )
                  }
                </>
              )
            }
          </div>
          <div
            style={{
              flexBasis: '50%',
              display: 'flex',
              flexDirection: 'row',
              marginLeft: '12.5px',
            }}
          >
            <div style={{
              flexBasis: '50%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'end',
              justifyContent: 'start',
            }}>
              {
                (activeMenuTab === 'TAG_MODE' &&
                  activeFieldValue !== null && activeFieldValue !== '') && (
                  <>
                    <button
                      className='btn btn-success'
                      style={{
                        backgroundColor: groupMode ? 'white' : 'rgb(24, 99, 0)',
                        color: groupMode ? 'rgb(24, 99, 0)' : 'white',
                      }}
                      onClick={() => {
                        if (groupMode)
                          setGroupedTags([]);
                        setGroupMode(!groupMode)

                      }}
                    >
                      {
                        (groupMode ? 'Tag' : 'Group') + ' Mode'
                      }
                    </button>
                    {
                      groupedTags.length > 0 && (
                        <button
                          className='btn btn-primary'
                          onClick={handleConfirmGroup}
                        >
                          Confirm Group
                        </button>
                      )
                    }
                    {
                      groupedTags.length === 1 && (
                        applyOverrides(groupedTags)[0].HasPairing == '1' || applyOverrides(groupedTags)[0].PairRelID !== null
                      ) && (
                        <button
                          className='btn btn-primary'
                          onClick={handleUndoGroup}
                        >
                          Ungroup
                        </button>
                      )
                    }
                  </>
                )
              }
              {
                (activeMenuTab === 'ENDORSEMENT_MODE' &&
                  activeFieldValue !== null && activeFieldValue !== '') && (
                  <div>
                    <button
                      type='button'
                      className='btn btn-default dropdown-toggle'
                      data-toggle='dropdown'
                      style={{
                        borderRadius: '3px',
                        minWidth: '125px',
                        textAlign: 'start',
                      }}
                      onClick={() => {
                        if (endorsementMenuRef.current) {
                          const isVisible = endorsementMenuRef.current
                            .style.display === 'block';
                          endorsementMenuRef.current.style.display =
                            isVisible ? 'none' : 'block';
                        }
                      }}
                    >
                      {
                        TagAction[activeEndorsementMenuItem.action].icon && (
                          <i
                            className={'glyphicon glyphicon-' + TagAction[activeEndorsementMenuItem.action].icon}
                            style={{ color: TagAction[activeEndorsementMenuItem.action].color, }}
                          />
                        )
                      }
                      &nbsp;{TagAction[activeEndorsementMenuItem.action].text}&nbsp;
                      <span
                        className="glyphicon glyphicon-menu-down"
                        style={{ float: 'right', marginTop: '2px', }}
                      ></span>
                    </button>
                    <ul
                      ref={endorsementMenuRef}
                      className='dropdown-menu pull-left'
                      role='menu'
                      style={{
                        minWidth: 'unset',
                        width: 'fit-content',
                        top: 'unset',
                        left: 'unset',
                        padding: '5px 2px',
                        fontSize: '15px',
                      }}
                    >
                      {
                        Object.keys(TagAction).map((tagAction, i) => {
                          return (
                            <li
                              key={`endorsement-${TagAction[tagAction].icon}-${i}`}
                              onClick={() => {
                                setActiveEndorsementMenuItem({
                                  ...activeEndorsementMenuItem,
                                  action: tagAction,
                                })
                                endorsementMenuRef.current.style.display = 'none';
                              }}>
                              {
                                TagAction[tagAction].icon && (
                                  <i
                                    className={'glyphicon glyphicon-' + TagAction[tagAction].icon}
                                    style={{ color: TagAction[tagAction].color, }}
                                  />
                                )
                              }
                              &nbsp;{TagAction[tagAction].text}
                            </li>
                          );
                        })
                      }
                    </ul>
                  </div>
                )
              }
            </div>
            {
              activeColumnName && activeFieldValue && (
                <div style={{
                  flexBasis: '50%',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'end',
                  justifyContent: 'end',
                }}>
                  {
                    activeMenuTab === 'TAG_MODE' && (
                      <>
                        <button
                          className='btn btn-primary'
                          onClick={handleSubmitChanges}
                          disabled={submittingChanges || (
                            [...addedTags, ...deletedTags].length === 0 &&
                            relOverrides.length === 0
                          )}
                        >
                          Submit Changes
                        </button>
                        <button
                          className='btn btn-warning'
                          style={{
                            backgroundColor: '#E89A0C',
                          }}
                          onClick={handleResetFieldChanges}
                          disabled={
                            activeColumnName.length === 0 ||
                            ![...addedTags, ...deletedTags].some((tag) => {
                              return tag.PropertyName === activeColumnName &&
                                tag.PropertyValue === activeFieldValue;
                            }) && (
                              activeColumnName && activeFieldValue &&
                              !datasetTags[activeColumnName][activeFieldValue].some((tag) => {
                                return relOverrides.map((relOverride) => {
                                  return relOverride.ID;
                                }).includes(tag.ID);
                              })
                            )
                          }
                        >
                          Reset Column Changes
                        </button>
                        <button
                          className='btn btn-danger'
                          onClick={handleResetAllChanges}
                          disabled={
                            [...addedTags, ...deletedTags].length === 0 &&
                            relOverrides.length === 0
                          }
                        >
                          Reset All Columns
                        </button>
                      </>
                    )
                  }
                  {
                    activeMenuTab === 'ENDORSEMENT_MODE' && (
                      <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        flex: 1,
                      }}>
                        {
                          activeEndorsementMenuItem.action === 'Comment' && (
                            <textarea
                              id={`hed-dataset-endorsement-comment`}
                              value={activeEndorsementMenuItem.commentText}
                              onChange={(event) => {
                                setActiveEndorsementMenuItem({
                                  ...activeEndorsementMenuItem,
                                  commentText: event.target.value,
                                });
                              }}
                              style={{
                                height: '34px',
                                minHeight: '34px',
                                maxHeight: '34px',
                                resize: 'none',
                                marginRight: '2%',
                                padding: '5px',
                                flexBasis: 'calc(100% - 85px)',
                              }}
                            />
                          )
                        }
                        {
                          activeEndorsementMenuItem.action !== 'Select' && (
                            <button
                              className='btn btn-primary'
                              onClick={submitHEDEndorsement}
                              disabled={submittingChanges || (
                                activeEndorsementMenuItem.action === 'Comment' &&
                                activeEndorsementMenuItem.commentText.length === 0
                              )}
                            >
                              Submit
                            </button>
                          )
                        }
                      </div>
                    )
                  }
                </div>
              )
            }
          </div>
        </div>
      </div>
    );
  }
};

DatasetTagger.defaultProps = {};

export default connect(
  (state: RootState) => ({
    physioFileID: state.dataset.physioFileID,
    datasetTags: state.dataset.datasetTags,
    relOverrides: state.dataset.hedRelOverrides,
    hedSchema: state.dataset.hedSchema,
    addedTags: state.dataset.addedTags,
    deletedTags: state.dataset.deletedTags,
    channelDelimiter: state.dataset.channelDelimiter,
    tagsHaveChanges: state.dataset.tagsHaveChanges,
  }),
  (dispatch: (_: any) => void) => ({
    setAddedTags: R.compose(
      dispatch,
      setAddedTags
    ),
    setDeletedTags: R.compose(
      dispatch,
      setDeletedTags
    ),
    setDatasetTags: R.compose(
      dispatch,
      setDatasetTags
    ),
    setRelOverrides: R.compose(
      dispatch,
      setRelOverrides
    ),
    setDatasetMetadata: R.compose(
      dispatch,
      setDatasetMetadata
    ),
  })
)(DatasetTagger);
