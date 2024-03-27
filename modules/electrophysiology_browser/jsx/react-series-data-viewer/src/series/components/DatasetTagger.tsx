import React, {useEffect, useRef, useState} from 'react';
import * as R from 'ramda';
import {connect} from "react-redux";
import {RootState} from "../store";
import {SelectDropdown} from 'jsx/MultiSelectDropdown';
import {CheckboxElement} from 'jsx/Form';
import {HEDTag, HEDSchemaElement} from "../store/types";
import {setAddedTags, setDatasetTags, setDeletedTags, setRelOverrides} from "../store/state/dataset";
import swal from "sweetalert2";
import {buildHEDString, getNthMemberTrailingBadgeIndex} from "../store/logic/filterEpochs";
import {colorOrder} from "../../color";

type CProps = {
  physioFileID: number,
  hedSchema: HEDSchemaElement[],
  datasetTags: HEDTag,
  relOverrides: HEDTag[],
  addedTags: HEDTag[],
  deletedTags: HEDTag[],
  setAddedTags: (_: HEDTag[]) => void,
  setDeletedTags: (_: HEDTag[]) => void,
  setRelOverrides: (_: HEDTag[]) => void,
  setDatasetTags: (_: any) => void,
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
 * @param root0.setAddedTags
 * @param root0.setDeletedTags
 * @param root0.setDatasetTags
 * @param root0.setRelOverrides
 */
const DatasetTagger = ({
  physioFileID,
  datasetTags,
  relOverrides,
  hedSchema,
  addedTags,
  deletedTags,
  setAddedTags,
  setDeletedTags,
  setDatasetTags,
  setRelOverrides,
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
  });
  const [activeHEDSchemas, setActiveHEDSchemas] = useState({});

  useEffect(() => {
    // Initialize active HED schemas
    const activeSchemas = {};
    hedSchema.forEach((tag) => {
      if (!activeSchemas.hasOwnProperty(tag.schemaName.toUpperCase())) {
        activeSchemas[tag.schemaName.toUpperCase()] = true;
      }
    });
    setActiveHEDSchemas(activeSchemas);
  }, []);

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
        setAddedTags([]);
        setDeletedTags([]);
        setRelOverrides([]);
        setGroupedTags([]);
;      }
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
          addedTag.ID = tagMapping.RelID
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
    const openTagViewerClasses = document
      .querySelector('#tag-modal-container > div > button')
      .classList;

    if ([...addedTags, ...deletedTags].length > 0) {
      openTagViewerClasses.add('tag-modal-container-dirty');
    } else {
      openTagViewerClasses.remove('tag-modal-container-dirty');
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
        }
      ]);
      setSearchText('');
      setSearchTextValid(false);
    } else {
      console.error('Failed to add tag. TODO: report')
    }
  }

  const getRootTags = (tags: HEDTag[]) => {
    return tags.filter((tag) => {
      return tag.ID &&
        !tags.some((t) => {
          return tag.ID === t.PairRelID;
        })
    });
  }

  const handleRemoveTag = (tagRelID: any) => {
    if (groupMode) {
      console.warn('If you want to delete a tag, you cannot be in "Group Mode". Press the "Tag Mode" button');
      return;
    }

    const tagsToSearch = applyOverrides(datasetTags[activeColumnName][activeFieldValue]);
    const tagFromDataset = tagsToSearch.find((tag) => {
      return tag.ID === tagRelID;
    })

    if (tagFromDataset) {
      // Only allow deletion if not grouped
      const rootTags = getRootTags(tagsToSearch);

      const tagInRootTags = rootTags.find((tag) => {
        return tag.ID === tagFromDataset.ID
      });

      const tagInGroupedTags = applyOverrides(groupedTags).find((tag) => {
        return tag.ID === tagFromDataset.ID;
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
          return tag.ID === tagRelID;
        });
        const tagInGroupedTags = tagFromAdded
          ? updatedGroupedTags.find((tag) => {
            return tag.ID === tagFromDataset.ID;
          })
          : false;
        if (!tagInGroupedTags && tagFromAdded) {
          setAddedTags(updatedAddedTags.filter((tag) => {
            return tag !== tagFromAdded;
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

    return column.field_values.map((fieldValue) => {
      const valueIsDirty = isDirty(columnName, fieldValue);
      return (
        <option
          key={`field-value-${fieldValue}`}
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

  const handleHEDMouseEnter = (hedSchemaElement: HEDSchemaElement) => {
    if (hedSchemaElement) {
      setDatasetTooltip({
        title: hedSchemaElement.longName,
        description: hedSchemaElement.description,
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
              return t.ID === pairRelID;
            });
          if (pairRelTag) {
            tagPairings.push(pairRelTag);
            pairRelID = pairRelTag.PairRelID;
          } else {
            console.error(`Something went wrong. Tag with ID ${pairRelID} not found. Should not proceed.`);
            pairRelID = null;
          }
        }
      });
    }
    return tagPairings;
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

  const buildHEDBadges = (tags: HEDTag[]) => {
    const hedTags = applyOverrides(tags).filter((tag) => {
      // Filter out invalidated addedTags that were added for structure (HEDTagID === null) and DB garbage
      return tag.HEDTagID !== null || tag.PairRelID !== null;
    });

    const rootTags = getRootTags(hedTags);
    const tagBadges = [];

    rootTags.forEach((tag) => {
      let groupColorIndex = 0;
      if (tag.PairRelID === null) {
        tagBadges.push(buildHEDBadge(tag.schemaElement.longName, tag.ID.toString(), true));
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
            tagBadgeGroup.push(buildHEDBadge(groupTag.schemaElement.longName, groupTag.ID, true));
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
                  tagBadgeGroup.splice(0, 0, buildHEDBadge(groupTag.schemaElement.longName, groupTag.ID, true));
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
                    tagBadgeSubgroup.splice(0, 0, buildHEDBadge(groupTag.schemaElement.longName, groupTag.ID, true));
                    tagBadgeSubgroup.splice(0, 0, buildGroupSpan('(', groupColorIndex));
                    tagBadgeSubgroup.push(buildGroupSpan(')', groupColorIndex));
                  } else {
                    tagBadgeGroup.splice(0, 0, buildHEDBadge(groupTag.schemaElement.longName, groupTag.ID, true));
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
              tagBadgeSubgroup.splice(0, tagBadgeSubgroup.length, buildHEDBadge(groupTag.schemaElement.longName, groupTag.ID, true));
            }
          }
        });
        tagBadges.push(...tagBadgeGroup);
      }
    });
    return tagBadges;
  }

  const buildHEDBadge = (text: string, relID: string, isSubmitted: boolean = true) => {
    const hedTag = schemaTags.find((tag) => {
      return tag.longName.trim() === text;
    });

    const tagsToSearch = applyOverrides([...addedTags, ...datasetTags[activeColumnName][activeFieldValue]]);

    let hedTagObj = isSubmitted && tagsToSearch.find((tag) => {
        return tag.ID === relID;
    });

    const tagIsGrouped = hedTagObj && hedTagObj.HasPairing === '1' || (
      tagsToSearch.some((tag) => {
        return tag.PairRelID ? tag.PairRelID.toString() : undefined === relID
      })
    );

    let tagIsSelected = false;

    if (hedTagObj) {
      tagIsSelected = applyOverrides(groupedTags).some((tag) => {
        if (tag.ID === relID) {
          return true;
        }
        if (tag.PairRelID) {
          let tagObject = tagsToSearch.find((t) => {
              return t.ID === tag.ID;
            });
          while (tagObject && (tagObject.PairRelID !== null || tagObject.HasPairing === '1')) {
            tagObject = tagsToSearch.find((t) => {
                return t.ID === tagObject.PairRelID;
              });
            if (tagObject && tagObject.ID === relID) {
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
        className='selection-filter-tags dataset-tag-hed'
        onMouseEnter={() => {
          handleHEDMouseEnter(hedTag);
        }}
        onMouseLeave={handleHEDMouseLeave}
        onClick={(e) => {
          if (!isSubmitted || (!groupMode && !e.shiftKey))
            return;

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
                return tag.ID !== tagRelID;
              }));
            } else {
              // Add leaf
              setGroupedTags([...groupedTags, hedTagObj]);
            }
          } else {
            console.error(`Tag not found: ${relID}`);
          }
        }}
      >
        <div className={tagClassName}>
          <span className="filter-tag-name dataset-tag-name">
            {
              hedTag
                ? showLongFormHED
                  ? hedTag.longName
                  : hedTag.name
                : text
            }
          </span>
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
        </div>
      </div>
    );
  }

  const applyOverrides = (hedTags: HEDTag[]): HEDTag[] => {
    return hedTags.map((hedTag) => {
      let schemaElement = hedTag.schemaElement;
      if (hedTag.HEDTagID !== null && !schemaElement) {
        schemaElement = schemaTags.find((tag) => {
          return tag.id === hedTag.HEDTagID;
        })
      }
      const overriddenTag = relOverrides.find((tag) => {
        return tag.ID === hedTag.ID;
      });

      if (overriddenTag) {
        hedTag = {
          ...hedTag,
          HasPairing: overriddenTag.HasPairing,
          PairRelID: overriddenTag.PairRelID,
          AdditionalMembers: overriddenTag.AdditionalMembers,
        }
      }
      return {
        ...hedTag,
        schemaElement: schemaElement,
      };
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
    }
    newTags.push(newTag);

    updatedGroupTags.forEach((rootTag, groupTagIndex) => {
      const tagPairings = applyOverrides(getGroupedTagPairings([rootTag]));
      const leafTag = tagPairings.length > 0 ? tagPairings.slice(-1)[0] : rootTag;
      const leafHadPairing = leafTag.HasPairing === '1';

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
    setActiveHEDSchemas(previouslyActive => ({
      ...previouslyActive,
      [key]: action === 'check'
    }));
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

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '60vh'
  }}>
      <div
        style={{
          flexBasis: '80%',
          display: 'flex',
          flexDirection: 'row',
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
          <div style={{ width: '90%', }}>
            <label htmlFor={'select_column'}>Column Name</label>
          </div>
          <div style={{ width: '90%', }}>
            <select
              id='select_column'
              className='form-control input-sm'
              style={{ width: '100%' }}
              value={activeColumnName}
              onChange={handleColumnValueChange}
            >
              <option></option>
              {buildColumnNames()}
            </select>
          </div>
          <div style={{ fontWeight: 'bold', }}>Column Values</div>
          <select
            id='field-levels'
            size={10}
            style={{ width: '90%', height: '40vh', }}
            value={activeFieldValue}
            onChange={handleFieldValueChange}
            placeholder='Select a column from the dropdown'
          >
            {buildFieldValues(activeColumnName)}
          </select>
          <div
            id='dataset-hed-tooltip'
            style={{
              display: `${datasetTooltip.title.length > 0 ? 'block' : 'none'}`,
              position: 'absolute',
              width: '22.5%',
              height: '52.5vh',
              backgroundColor: '#555555',
              color: '#fff',
              padding: '10px',
              borderRadius: '6px',
              textAlign: 'left',
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: 'bold', }}>
              {datasetTooltip.title}
            </div>
            <div className='tooltip-description' style={{ fontSize: '12px', marginTop: '15px', }}>
              {datasetTooltip.description}
            </div>
          </div>
        </div>
        <div
          style={{
            flexBasis: '75%',
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
                Select a Column Name and Value to Add or View HED Tags
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
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <CheckboxElement
                    name='toggle-long-hed'
                    class='flex-basis-45 toggle-long-hed'
                    offset=''
                    label='Show long-form HED tags'
                    value={showLongFormHED}
                    onUserInput={() => {
                      setShowLongFormHED(!showLongFormHED);
                    }}
                  />
                  <div style={{
                    flexBasis: '45%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}>
                    <div style={{
                      flexBasis: '50%',
                      textAlign: 'right',
                    }}>
                      Currently active schemas:
                    </div>
                    <div style={{
                      flexBasis: '40%',
                    }}>
                      <SelectDropdown
                        multi={true}
                        options={activeHEDSchemas}
                        onFieldClick={handleSchemaFieldClick}
                        onToggleAll={handleToggleAllSchemas}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '20px', }}>
                  <form autoComplete="off" onSubmit={(e) => {e.preventDefault()}}>
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
                      disabled={!searchTextValid}
                    >
                      Add
                    </button>
                    {buildDataList(searchText.length === 0)}
                  </form>
                </div>


                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginTop: '18px',
                  }}>
                  <div
                    style={{
                      flexBasis: '10%',
                      fontWeight: 'bold',
                      marginRight: '5px',
                    }}>
                    Description:
                  </div>
                  <div
                    style={{
                      flexBasis: '2.5%',
                    }}>
                  </div>
                  <div
                    style={{
                      flexBasis: '87.5%',
                    }}>
                    <textarea
                      placeholder='n/a'
                      style={{
                        minWidth: '47vw',
                        maxWidth: '47vw',
                        width: '47vw',
                        height: '100%',
                        minHeight: '26px',
                        maxHeight: '150px',
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
                <div
                  style={{
                    marginTop: '10px',
                  }}
                >
                {
                  buildHEDBadges([
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
                  ]).map((badge) => {
                    return badge;
                  })
                }
                {
                  searchText.length > 0
                  && buildHEDBadge(
                    searchText,
                    null,
                    false
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
          }}
        >
          {
            groupedTags.length > 0 && (
              <>
                <div style={{flexBasis: '25%'}}/>
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
              (activeFieldValue !== null && activeFieldValue !== '') && (
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
                  applyOverrides(groupedTags)[0].HasPairing === '1' || applyOverrides(groupedTags)[0].PairRelID !== null
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
          </div>
          <div style={{
            flexBasis: '50%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'end',
            justifyContent: 'end',
          }}>
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
            <button
              className='btn btn-warning'
              style={{
                backgroundColor: '#E89A0C',
              }}
              onClick={handleResetFieldChanges}
              disabled={
                activeColumnName.length === 0 || activeFieldValue === null ||
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
              className='btn btn-primary'
              onClick={handleSubmitChanges}
              disabled={submittingChanges || (
                [...addedTags, ...deletedTags].length === 0 &&
                relOverrides.length === 0
              )}
            >
              Submit Changes
            </button>
          </div>
       </div>
      </div>
    </div>
  );
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
  })
)(DatasetTagger);
