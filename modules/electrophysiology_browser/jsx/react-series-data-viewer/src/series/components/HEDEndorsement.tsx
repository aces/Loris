import React, {useEffect, useRef, useState} from 'react';
import {setCurrentAnnotation} from '../store/state/currentAnnotation';
import {buildHEDString, getRootTags, updateActiveEpoch,} from '../store/logic/filterEpochs';
import {Epoch as EpochType, HEDTag, RightPanel} from '../store/types';
import {connect} from 'react-redux';
import {setTimeSelection} from '../store/state/timeSelection';
import {setRightPanel} from '../store/state/rightPanel';
import * as R from 'ramda';
import {RootState} from '../store';
import {setInterval} from '../store/state/bounds';
import Panel from './Panel';
import {setEpochs} from "../store/state/dataset";
import {useTranslation} from "react-i18next";

type CProps = {
  timeSelection?: [number, number],
  epochs: EpochType[],
  domain: [number, number],
  setCurrentAnnotation: (_: EpochType) => void,
  updateActiveEpoch: (_: number) => void,
  setTimeSelection: (_: [number, number]) => void,
  setRightPanel: (_: RightPanel) => void,
  setInterval: (_: [number, number]) => void,
  setEpochs: (_: EpochType[]) => void,
  activeEpoch: number,
  viewerHeight: number,
  physioFileID: number,
  canEndorse: boolean,
  pressedKey: string,
};

/**
 *
 * @param root0
 * @param root0.epochs
 * @param root0.updateActiveEpoch
 * @param root0.setCurrentAnnotation
 * @param root0.setTimeSelection
 * @param root0.setRightPanel
 * @param root0.domain
 * @param root0.setInterval
 * @param root0.setEpochs
 * @param root0.activeEpoch
 * @param root0.viewerHeight
 * @param root0.physioFileID
 * @param root0.canEndorse
 * @param root0.pressedKey
 */
const HEDEndorsement = ({
  epochs,
  setCurrentAnnotation,
  setTimeSelection,
  updateActiveEpoch,
  setRightPanel,
  domain,
  setInterval,
  setEpochs,
  activeEpoch,
  viewerHeight,
  physioFileID,
  canEndorse,
  pressedKey,
}: CProps) => {

  const HEDFilter = {
    NO_FILTER: 'No Filter',
    ENDORSED: 'Endorsed',
    CAVEAT: 'Caveat',
    WITH_COMMENT: 'With Comment',
    TAGGED_BY: 'Tagged By',
    ENDORSED_BY: 'Endorsed By',
    CAVEAT_BY: 'Caveat By',
  }

  const Submenu = {
    NONE: 0,
    TAGGED_BY: 1,
    ENDORSED_BY: 2,
    CAVEAT_BY: 3,
  }
  const {t} = useTranslation();
  const [activeFilter, setActiveFilter] = useState(HEDFilter.NO_FILTER);
  const [filteredHEDEpochs, setFilteredHEDEpochs] = useState([]);
  const [numTags, setNumTags] = useState(0);
  const [totalHEDTags, setTotalHEDTags] = useState(0);
  const filterMenuRef = useRef(null);
  const [activeSubmenu, setActiveSubmenu] = useState(Submenu.NONE);
  const [activeSubmenuItem, setActiveSubmenuItem] = useState({
    id: 0,
    value: ''
  });

  const [showLongFormHED, setShowLongFormHED] = useState(false);
  const [searchText, setSearchText] = useState('');

  const [openCommentPanels, setOpenCommentPanels] = useState([]);

  const [sendingRequest, setSendingRequest] = useState(false);

  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [hoveredItem, setHoveredItem] = useState('');

  const hedListRef = useRef(null);

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

  const setFilter = (activeFilter) => {
    setActiveFilter(activeFilter);
    setActiveItemIndex(0);
  }

  useEffect(() => {
    const filteredEpochs = epochs.filter((epoch) => {
      return epoch.hed.length > 0;
    });

    setFilteredHEDEpochs(filteredEpochs.map((epoch) => {
      return {
        epoch: epoch,
        epochIndex: epochs.indexOf(epoch),
        tagGroups: getRootTags(epoch.hed)
          .filter((rootTag) => {
            switch (activeFilter) {
              case HEDFilter.NO_FILTER:
                return true;
              case HEDFilter.ENDORSED:
                return !tagInGroupIsEndorsed(rootTag, epoch.hed);
              case HEDFilter.CAVEAT:
                return tagInGroupHasCaveat(rootTag, epoch.hed);
              case HEDFilter.WITH_COMMENT:
                return tagInGroupHasComment(rootTag, epoch.hed);
              case HEDFilter.TAGGED_BY:
                return tagInGroupTaggedBy(rootTag, epoch.hed, activeSubmenuItem.id);
              case HEDFilter.ENDORSED_BY:
                return tagInGroupEndorsedBy(rootTag, epoch.hed, activeSubmenuItem.id);
              case HEDFilter.CAVEAT_BY:
                return tagInGroupIsCaveatBy(rootTag, epoch.hed, activeSubmenuItem.id);
            }
          })
          .filter((rootTag) => {
            if (searchText.length > 0) {
              return tagInGroupContainsSearchText(rootTag, epoch.hed, searchText)
            }
            return true;
          })
          .map(rootTag => buildTagGroup(rootTag, epoch.hed)),
      }
    }));
  }, [
    activeFilter, searchText, showLongFormHED,
    activeSubmenuItem.id, sendingRequest,
  ]);


  useEffect(() => {
    const totalHEDTags =  filteredHEDEpochs
      .map(epoch => epoch.tagGroups)
      .reduce((a, b) => a + b.length, 0);
    setTotalHEDTags(totalHEDTags);
    setActiveItemIndex(0);
  }, [filteredHEDEpochs]);

  const classChange = (mutationList) => {
    mutationList
      .filter(mutation => mutation.attributeName === 'class')
      .map((mutation) => {
        if (!mutation.target.classList.contains('open')) {
          setActiveSubmenu(Submenu.NONE);
        }
      });
  }

  useEffect(() => {
    const filterDropdown = document.querySelector('#filter-dropdown');
    const classObserver = new MutationObserver(classChange);
    classObserver.observe(filterDropdown, { attributes: true, });


    setNumTags(epochs.filter((epoch) => {
      return epoch.hed.length > 0;
    }).map((epoch) => {
      return {
        epoch: epoch,
        epochIndex: epochs.indexOf(epoch),
        tagGroups: getRootTags(epoch.hed)
          .map(rootTag => buildTagGroup(rootTag, epoch.hed))
      }})
        .map(epoch => epoch.tagGroups)
        .reduce((a, b) => a + b.length, 0));

    return () => {
      classObserver.disconnect(); // Necessary?
    };
  }, []);

  const jsModulo = (n, mod) => {
    return ((n % mod) + mod) % mod;
  }

  const checkItemAtIndexVisibility = (index) => {
    if (isNaN(index) || index >= totalHEDTags)
      return;

    const itemAtIndex =
      document.querySelector<HTMLElement>(`.list-group > div:nth-child(${index + 1})`);

    if (itemAtIndex) {
      const firstItem =
        document.querySelector<HTMLElement>('.list-group > div:nth-child(1)');

      const firstItemOffset = firstItem.offsetTop;

      if (activeItemIndex === 0) {
        hedListRef.current.scrollTop = 0;
      } else if (itemAtIndex.offsetTop > (hedListRef.current.scrollTop + hedListRef.current.clientHeight)) {
        hedListRef.current.scrollTop = itemAtIndex.offsetTop - firstItemOffset
      } else if (
        ((itemAtIndex.offsetTop - itemAtIndex.clientHeight) < hedListRef.current.scrollTop) ||
        ((itemAtIndex.offsetTop + itemAtIndex.clientHeight - hedListRef.current.scrollTop - firstItemOffset)
          > hedListRef.current.clientHeight)
      ) {
        hedListRef.current.scrollTop =
          (itemAtIndex.offsetTop - firstItemOffset) -
          hedListRef.current.clientHeight + itemAtIndex.clientHeight;
      }

      // Focus comment
      if (activeItemIndex === index) {
        const activeItem = getActiveItem();
        focusCommentWithID(activeItem?.ID);
      }
    }
  }

  useEffect(() => {
    checkItemAtIndexVisibility(activeItemIndex);
  }, [activeItemIndex]);

  const getItemAtIndex = (itemIndex) => {
    const tags = filteredHEDEpochs.map((event) => {
      return event.tagGroups.flat();
    }).flat();
    return tags[itemIndex];
  }

  const getActiveItem = () => {
    return getItemAtIndex(activeItemIndex);
  }

  const getItemEvent = (item) => {
    return item && epochs.find((epoch) => {
      const epochHED = epoch.hed;
      return (
        epochHED &&
        epochHED.find(hed => hed.ID === item.ID)
      );
    })
  }

  const getActiveEvent = () => {
    return getItemEvent(getActiveItem());
  }

  const getEpochIndex = (epoch) => {
    return epoch ? epochs.findIndex(e => e.physiologicalTaskEventID === epoch.physiologicalTaskEventID) : null;
  }

  useEffect(() => {
    const epochIndex = (getEpochIndex(getActiveEvent()));
    if (epochIndex) {
      if (activeEpoch === null) {
        updateActiveEpoch(epochIndex);
      } else if (epochIndex !== activeEpoch) {
        updateActiveEpoch(activeEpoch);
      }
    }
  }, [filteredHEDEpochs, activeEpoch]);

  useEffect(() => {
    const epochIndex = (getEpochIndex(getActiveEvent()));
    if (epochIndex) {
      if (epochIndex !== activeEpoch) {
        updateActiveEpoch(epochIndex);
      }
    }
  }, [activeItemIndex]);


  const focusCommentWithID = (itemID) => {
    document.getElementById(
      `hed-endorsement-comment-${itemID}`
    )?.focus();
  }

  const selectActiveItemTagAction = (tagAction) => {
    const activeItem = getActiveItem();

    if (activeItem) {
      const panelFound = openCommentPanels
        .find(panel => panel.ID === activeItem.ID);

      setOpenCommentPanels([
        ...openCommentPanels.filter(panel => panel.ID !== activeItem.ID),
        {
          ID: activeItem.ID,
          text: panelFound
            ? panelFound.text
            : '',
          tagAction: tagAction,
          activePanel: tagAction,
          isOpen: true,
        }
      ]);
      setTimeout(() => {
        focusCommentWithID(activeItem.ID);
        // Adjust to new height
        checkItemAtIndexVisibility(activeItemIndex);
      }, 0);
    }
  }

  const performActiveItemTagAction = () => {
    const activeItem = getActiveItem();
    const panelFound = openCommentPanels
      .find(panel => panel.ID === activeItem.ID);
    if (panelFound) {
      if (
        ['Endorsed', 'Caveat', 'Comment']
          .includes(panelFound.tagAction)
      ) {
        setSendingRequest(true);
        handleEndorseSubmit(panelFound);
        setOpenCommentPanels(
          openCommentPanels.filter(panel => panel.ID !== activeItem.ID)
        );
      }
    } else {
      console.error('Something went wrong when trying to endorse. Please report this incident.');
    }
  }

  useEffect(() => {
    if (
      !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
        'KeyC', 'KeyE', 'KeyM', 'Enter', 'KeyI', 'KeyJ', 'KeyK',
      ].includes(pressedKey)
    ) {
      return;
    }

    const currentEpoch = getActiveEvent();

    switch (pressedKey) {
      case 'ArrowUp':
        setActiveItemIndex(jsModulo(activeItemIndex - 1, totalHEDTags));
        break;
      case 'ArrowDown':
        setActiveItemIndex(jsModulo(activeItemIndex + 1, totalHEDTags));
        break;
      case 'ArrowLeft':
        const previousIndex = jsModulo(activeItemIndex - 1, totalHEDTags);
        setActiveItemIndex(previousIndex);
        jumpToEpoch(getItemEvent(getItemAtIndex(previousIndex)));
        break;
      case 'ArrowRight':
        const nextIndex = jsModulo(activeItemIndex + 1, totalHEDTags);
        setActiveItemIndex(nextIndex);
        jumpToEpoch(getItemEvent(getItemAtIndex(nextIndex)));
        break;
      case 'KeyC':
        selectActiveItemTagAction('Caveat');
        break;
      case 'KeyE':
        selectActiveItemTagAction('Endorsed');
        break;
      case 'KeyM':
        selectActiveItemTagAction('Comment');
        break;
      case 'Enter':
        performActiveItemTagAction();
        break;
      case 'KeyI':
        checkItemAtIndexVisibility(activeItemIndex);
        break;
      case 'KeyJ':
        if (currentEpoch) {
          jumpToEpoch(currentEpoch);
        }
        break;
      case 'KeyK':
        if (currentEpoch) {
          handleEditClick(currentEpoch);
        }
        break;
    }
  }, [pressedKey]);

  const tagInGroupHasComment = (tag: HEDTag, tagList: HEDTag[]) => {
    return tag.Endorsements.filter((endorsement) => {
      return endorsement.EndorsementComment !== null;
    }).length > 0 || (
      tag.PairRelID !== null &&
      tagInGroupHasComment(tagList.find(t => t.ID === tag.PairRelID), tagList)
    );
  }

  const tagInGroupHasCaveat = (tag: HEDTag, tagList: HEDTag[]) => {
    return tag.Endorsements.filter((endorsement) => {
      return endorsement.EndorsementStatus === 'Caveat';
    }).length > 0 || (
      tag.PairRelID !== null &&
      tagInGroupHasCaveat(tagList.find(t => t.ID === tag.PairRelID), tagList)
    );
  }

  const tagInGroupIsCaveatBy = (tag: HEDTag, tagList: HEDTag[], endorserID: number) => {
    return tag.Endorsements.filter((endorsement) => {
      return endorsement.EndorsedByID === endorserID &&
        endorsement.EndorsementStatus === 'Caveat';
    }).length > 0 || (
      tag.PairRelID !== null &&
      tagInGroupIsCaveatBy(tagList.find(t => t.ID === tag.PairRelID), tagList, endorserID)
    );
  }

  const tagInGroupContainsSearchText = (tag: HEDTag, tagList: HEDTag[], text: string) => {
    const searchText = text
      .toLowerCase()
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');  // Escape regex characters
    return (
      (
        !showLongFormHED &&
        tag.schemaElement.name.toLowerCase().search(searchText) > -1
      ) || (
        showLongFormHED &&
        tag.schemaElement.longName.toLowerCase().search(searchText) > -1
      )
    ) || (
      tag.PairRelID !== null &&
      tagInGroupContainsSearchText(tagList.find(t => t.ID === tag.PairRelID), tagList, text)
    );
  }

  const tagInGroupEndorsedBy = (tag: HEDTag, tagList: HEDTag[], endorserID: number) => {
    return tag.Endorsements.filter((endorsement) => {
      return endorsement.EndorsedByID === endorserID &&
        endorsement.EndorsementStatus === 'Endorsed';
    }).length > 0 || (
      tag.PairRelID !== null &&
      tagInGroupEndorsedBy(tagList.find(t => t.ID === tag.PairRelID), tagList, endorserID)
    );
  }

  const tagInGroupTaggedBy = (tag: HEDTag, tagList: HEDTag[], taggerID: number) => {
    return tag.TaggedBy === taggerID || (
      tag.PairRelID !== null &&
      tagInGroupTaggedBy(tagList.find(t => t.ID === tag.PairRelID), tagList, taggerID)
    );
  }

  const tagInGroupIsEndorsed = (tag: HEDTag, tagList: HEDTag[]) => {
    return tag.Endorsements.length === 0 ||
      tag.Endorsements.every((endorsement) => {
        return endorsement.EndorsementStatus !== 'Endorsed'
      }) || (
        tag.PairRelID !== null &&
        tagInGroupIsEndorsed(tagList.find(t => t.ID === tag.PairRelID), tagList)
      );
  }

  const buildTagGroup = (rootTag: HEDTag, hedTags: HEDTag[]) => {
    const tagGroup = [rootTag];
    let tag = rootTag;
    while (tag && tag.PairRelID !== null) {
      tag = hedTags.find(hedTag => hedTag.ID === tag.PairRelID);
      tagGroup.push(tag);
    }
    return tagGroup;
  }

  const jumpToEpoch = (epoch: EpochType) => {
    if (!epoch) { return; }

    const epochTimeRange = [
      epoch.onset,
      Math.max(
        epoch.onset + epoch.duration,
        epoch.onset + 0.1
      )
    ].sort();
    setInterval([
      Math.max(0, epochTimeRange[0] - 0.1),
      Math.min(epochTimeRange[1], domain[1])
    ]);
  };

  const handleEditClick = (epoch) => {
    setCurrentAnnotation(epoch);
    setRightPanel('annotationForm');
    const startTime = epoch.onset;
    const endTime = epoch.duration + startTime;
    setTimeSelection([startTime, endTime]);
  };

  const handleTextChange = (event) => {
    setSearchText(event.target.value)
  }

  const handleEndorseSubmit = (panel: any) => {
    // Currently grouping is not supported at instance level
    const rootTagID = panel.ID;
    const url = window.location.origin +
      '/electrophysiology_browser/events/';
    fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify({
        physioFileID: physioFileID,
        request_type: 'endorse_hed_instance',
        hed_rel_id: parseInt(rootTagID),
        endorsement_status: panel.tagAction,
        endorsement_comment: panel.tagAction === 'Comment'
          ? panel.text
          : null
      }),
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw (response);
    }).then((response) => {
      const endorsement = {
        EndorsedBy:  response.endorsedBy,
        EndorsedByID: response.endorsedByID,
        EndorsementComment: panel.text,
        EndorsementStatus:  panel.tagAction,
        EndorsementTime: response.endorsementTime,
      };
      const epochWithEndorsement = epochs.find((epoch) => {
        return epoch.hed.map(tag => tag.ID).includes(rootTagID);
      });
      if (!epochWithEndorsement)
        throw 'Epoch not found';

      epochs.splice(epochs.indexOf(epochWithEndorsement), 1);
      const hedWithEndorsement = epochWithEndorsement.hed.find(
        tag => tag.ID === rootTagID
      );
      epochWithEndorsement.hed.splice(epochWithEndorsement.hed.indexOf(hedWithEndorsement), 1);
      epochs.push({
        ...epochWithEndorsement,
        hed: [
          ...epochWithEndorsement.hed,
          {
            ...hedWithEndorsement,
            Endorsements: [
              ...hedWithEndorsement.Endorsements,
              endorsement
            ]
          }
        ]
      });
      setEpochs(
        epochs
          .sort(function(a, b) {
            return a.onset - b.onset;
          })
      );
      setSendingRequest(false);

      // TODO: Handle non-success
      const alertElement = document.getElementById(
        `hed-endorsement-alert-${rootTagID}`
      );
      alertElement.style.visibility = 'visible';
      setTimeout(() => {
        alertElement.style.visibility = 'hidden';
      }, 2000);
    });
  }

  const getFilterDecoration = (filterName) => {
    let filterNameDecoration = <></>;
    switch (filterName) {
      case HEDFilter['ENDORSED']:
      case HEDFilter['ENDORSED_BY']:
        filterNameDecoration = <i
          key={`filter-decoration-${filterName}`}
          className='glyphicon glyphicon-flag'
          style={{ color: 'green', }}
        />;
        break;
      case HEDFilter['CAVEAT']:
      case HEDFilter['CAVEAT_BY']:
        filterNameDecoration = <i
          key={`filter-decoration-${filterName}`}
          className='glyphicon glyphicon-flag'
          style={{ color: 'red', }}
        />
        break;
      case HEDFilter['WITH_COMMENT']:
        filterNameDecoration = <i
          key={`filter-decoration-${filterName}`}
          className='glyphicon glyphicon-comment'
          style={{ color: '#256eb6', }}
        />
        break;
      case HEDFilter['TAGGED_BY']:
        filterNameDecoration = <i
          key={`filter-decoration-${filterName}`}
          className='glyphicon glyphicon-tag'
          style={{ color: '#064785', }}
        />
        break;

    }
    return filterNameDecoration;
  }

  type TooltipLineProps = {
    isVertical: boolean,
    lineLength: string,
    lineTop: string,
    lineRight: string,
    lineBottom: string,
    lineLeft: string,
  };

  type TooltipProps = {
    itemRef: string,
    tooltipText: any,
    tooltipTop: string,
    tooltipRight: string,
    tooltipBottom: string,
    tooltipLeft: string,
    tooltipLines: TooltipLineProps[],
    extraClasses?: string,
    extraStyles?: React.CSSProperties,
  };

  const Tooltip = ({
    itemRef,
    tooltipText,
    tooltipTop,
    tooltipRight,
    tooltipBottom,
    tooltipLeft,
    tooltipLines,
    extraStyles,
    extraClasses = '',
  }: TooltipProps) => {
    return (
      <div
        key={`hed-endorsement-tooltip-${itemRef}`}
        className={['hed-endorsement-tooltip', extraClasses].join(' ')}
        style={{
          display: itemRef === hoveredItem ? 'inline-block' : 'none',
          top: tooltipTop,
          right: tooltipRight,
          bottom: tooltipBottom,
          left: tooltipLeft,
          ...extraStyles ?? {}
        }}>
        {tooltipText}
        {
          tooltipLines.map((line) => {
            return (
              <div
                key={`tooltip-line-${itemRef}`}
                className='hed-endorsement-tooltip-line'
                style={{
                  width: line.isVertical ? '1px' : line.lineLength,
                  height: line.isVertical ? line.lineLength : '1px',
                  top: line.lineTop,
                  right: line.lineRight,
                  bottom: line.lineBottom,
                  left: line.lineLeft,

                }}
              />
            )
          })
        }
      </div>
    );
  }

  return (
    <div className="panel panel-primary event-list" style={{borderTopLeftRadius: 0, borderTopRightRadius: 0,}}>
      <div
        className="panel-heading"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'column',
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <p style={{margin: '0px'}}>
            <span style={{fontSize: '14px', verticalAlign: 'middle',}}>
            {t(
              'showing {{numShowing}}/{{numTotal}}', {
                ns: 'electrophysiology_browser',
                numShowing: totalHEDTags,
                numTotal: numTags,
              }
            )}
            </span>
            <br/>
          </p>
          <div style={{display: 'flex', flexDirection: 'row'}}>
            <i
              className={
                'glyphicon glyphicon-tag'
                + (showLongFormHED ? 's' : '')}
              style={{padding: '0.5em'}}
              onClick={() => setShowLongFormHED(!showLongFormHED)}
            ></i>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}
        >
          <div
            id='filter-dropdown'
            ref={filterMenuRef}
            className='btn-group views'
            style={{ margin: 0, }}
          >
            <button
              type='button'
              className='btn btn-default btn-xs dropdown-toggle'
              data-toggle='dropdown'
              style={{
                borderRadius: [HEDFilter.TAGGED_BY, HEDFilter.ENDORSED_BY, HEDFilter.CAVEAT_BY].includes(activeFilter)
                  ? '3px 0 0 3px'
                  : '3px',
                height: '25px',
              }}
            >
              {getFilterDecoration(activeFilter)}&nbsp;
              {t(activeFilter, {
                ns: 'electrophysiology_browser'
              })}
              {
                [HEDFilter.TAGGED_BY, HEDFilter.ENDORSED_BY].includes(activeFilter)
                  ? ':'
                  : ''
              }
              &nbsp;<span className='glyphicon glyphicon-menu-down'/>
            </button>
            {
              [HEDFilter.TAGGED_BY, HEDFilter.ENDORSED_BY, HEDFilter.CAVEAT_BY].includes(activeFilter)
                ? <div
                  className='btn btn-default btn-xs'
                  style={{
                    borderRadius: '0 3px 3px 0',
                    padding: '2px 5px',
                    height: '25px',
                  }}
                >
                  {activeSubmenuItem.value}
                </div>
                : ''
            }

            <ul className='dropdown-menu pull-left'
                role='menu'
                style={{ height: `${Object.values(HEDFilter).length * 21.5}px` }}
            >
              {
                Object.values(HEDFilter).map((filterName, filterIndex, filters) => {
                  let filterItem = <React.Fragment key={`filter-item-${filterName}-${filterIndex}`}>
                    {getFilterDecoration(filterName)}&nbsp;
                    {t(filterName, {ns: 'electrophysiology_browser'})}
                  </React.Fragment>;
                  if ([HEDFilter.TAGGED_BY, HEDFilter.ENDORSED_BY, HEDFilter.CAVEAT_BY].includes(filterName)) {

                    let itemList = [];
                    let submenuIsActive = false;
                    switch (filterName) {
                      case HEDFilter.TAGGED_BY:
                        // Unique list of taggers
                        itemList = filteredHEDEpochs.reduce((taggers, hedEpoch) => {
                          hedEpoch.epoch.hed.forEach((hedTagger) => {
                            if (!taggers.map(
                              tagger => tagger.id
                            ).includes(hedTagger.TaggedBy))
                              taggers.push({
                                id: hedTagger.TaggedBy,
                                value: hedTagger.TaggerName,
                              });
                          });
                          return taggers;
                        }, []).sort((a, b) => {
                          return a.value - b.value;
                        });
                        submenuIsActive = activeSubmenu === Submenu.TAGGED_BY;
                        break;
                      case HEDFilter.ENDORSED_BY:
                        // Unique list of endorsers
                        itemList = filteredHEDEpochs.reduce((endorsements, hedEpoch) => {
                          const hedEndorsements = hedEpoch.epoch.hed
                            .map(tag => tag.Endorsements).flat()
                            .filter(endorsement => endorsement.EndorsementStatus === 'Endorsed')
                          hedEndorsements.forEach((endorsement) => {
                            if (!endorsements.map(
                              endorsement => endorsement.id
                            ).includes(endorsement.EndorsedByID)) {
                              endorsements.push({
                                id: endorsement.EndorsedByID,
                                value: endorsement.EndorsedBy,
                              });
                            }
                          });
                          return endorsements;
                        }, []).sort((a, b) => {
                          return a.value - b.value;
                        });
                        submenuIsActive = activeSubmenu === Submenu.ENDORSED_BY;
                        break;
                      case HEDFilter.CAVEAT_BY: // TODO: Consider merging with above
                        // Unique list of caveat authors
                        itemList = filteredHEDEpochs.reduce((endorsements, hedEpoch) => {
                          const hedEndorsements = hedEpoch.epoch.hed
                            .map(tag => tag.Endorsements).flat()
                            .filter(endorsement => endorsement.EndorsementStatus === 'Caveat');

                          hedEndorsements.forEach((endorsement) => {
                            if (!endorsements.map(
                              endorsement => endorsement.id
                            ).includes(endorsement.EndorsedByID)) {
                              endorsements.push({
                                id: endorsement.EndorsedByID,
                                value: endorsement.EndorsedBy,
                              });
                            }
                          });
                          return endorsements;
                        }, []).sort((a, b) => {
                          return a.value - b.value;
                        });
                        submenuIsActive = activeSubmenu === Submenu.CAVEAT_BY;
                        break;
                    }

                    filterItem = (
                      <>
                        {getFilterDecoration(filterName)}&nbsp;
                        {t(filterName, {ns: 'electrophysiology_browser'})}&nbsp;
                        <span
                          className="glyphicon glyphicon-menu-right"
                          style={{ float: 'right', }}
                        ></span>
                        <ul
                          className="dropdown-menu"
                          style={{
                            display: submenuIsActive ? 'block' : 'none',
                            position: 'absolute',
                            top: `calc(100% * ${filterIndex} / ${filters.length} - 7px)`,
                            left: '100%',
                          }}
                        >
                          {
                            // Get unique list of taggers
                            itemList.length > 0
                              ? itemList.map((item, i) => {
                                const activeItem =
                                  item.id === activeSubmenuItem.id &&
                                  activeFilter === filterName
                                return (
                                  <li
                                    key={`tagger_${item.id}_${i}`}
                                    className={activeItem ? 'active' : null}
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      setFilter(filterName);
                                      setActiveSubmenuItem(item)
                                      // Close parent menu
                                      filterMenuRef.current.classList.remove('open');
                                    }}
                                  >
                                    {item.value}
                                  </li>
                                );
                              })
                              : (
                                <li key={'empty_tagger_list'}>
                                  <span
                                    style={{
                                      color: 'lightgray',
                                      fontStyle: 'italic',
                                    }}>
                                    {t('Empty list', {ns: 'electrophysiology_browser'})}
                                  </span>
                                </li>
                              )
                          }
                        </ul>
                      </>
                    );
                  }

                  return (
                    <li
                      key={`'filter-${filterIndex}`}
                      className={filterName === activeFilter ? 'active' : null}
                      onClick={(event) => {
                        switch (filterName) {
                          case HEDFilter.TAGGED_BY:
                            event.stopPropagation();
                            setActiveSubmenu(
                              activeSubmenu === Submenu.TAGGED_BY
                                ? Submenu.NONE
                                : Submenu.TAGGED_BY
                            );
                            break;
                          case HEDFilter.ENDORSED_BY:
                            event.stopPropagation();
                            setActiveSubmenu(
                              activeSubmenu === Submenu.ENDORSED_BY
                                ? Submenu.NONE
                                : Submenu.ENDORSED_BY
                            );
                            break;
                          case HEDFilter.CAVEAT_BY:
                            event.stopPropagation();
                            setActiveSubmenu(
                              activeSubmenu === Submenu.CAVEAT_BY
                                ? Submenu.NONE
                                : Submenu.CAVEAT_BY
                            );
                            break;
                          default:
                            setFilter(filterName);
                            setActiveSubmenu(Submenu.NONE);
                        }
                      }}
                    >
                      {filterItem}
                    </li>
                  )
                })
              }
            </ul>
          </div>
          <div
            style={{
              padding: '5px 0',
              width: '45%',
              flexGrow: 1,
            }}
          >
            <input
              id='hed-search'
              type='search'
              placeholder={
                t('Tag search...', {ns: 'electrophysiology_browser'})
              }
              value={searchText}
              onChange={handleTextChange}
              style={{
                width: '100%',
                height: '25px',
                fontSize: '90%',
                paddingLeft: '5px',
              }}
            />
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <div
            style={{
              fontSize: '12px',
              display: 'flex',
            }}
          >
            <span style={{
              alignSelf: 'center',
            }}>
              {t('Selected', {ns: 'loris'})}
              {
                totalHEDTags > 0
                  ? `: [#${(activeItemIndex + 1)}]  `
                  : ':'
              }
            </span>
            <div
              className='btn-group'
              style={{
                marginRight: 0,
                maxWidth: 'fit-content',
                display: 'none',
              }}
            >
              <button
                className='btn btn-primary btn-xs'
                onClick={() => checkItemAtIndexVisibility(activeItemIndex)}
                onMouseEnter={() => setHoveredItem('jumpToSelected')}
                onMouseLeave={() => setHoveredItem('')}
              >
                <i className={'glyphicon glyphicon-map-marker'} />
              </button>
              <Tooltip
                key={`tooltip-scrollToSelected`}
                itemRef={'jumpToSelected'}
                tooltipText={
                  <>
                    {t(
                      'Scroll to Selected', {
                        ns: 'electrophysiology_browser'
                      }
                    )}&nbsp;
                    <span style={{ fontWeight: 'bold', }}>
                      (&#8679; +) I
                    </span>
                  </>
                }
                tooltipTop={'105%'}
                tooltipRight={'50%'}
                tooltipBottom={'unset'}
                tooltipLeft={'unset'}
                tooltipLines={[
                  {
                    isVertical: true,
                    lineLength: '10px',
                    lineTop: '-7px',
                    lineRight: '10px',
                    lineBottom: 'unset',
                    lineLeft: 'unset',
                  },
                ]}
              />
              <Tooltip
                key={`tooltip-jumpToSelected`}
                itemRef={'jumpToSelected'}
                tooltipText={
                  <>
                    {t(
                      'Jump to Selected', {
                        ns: 'electrophysiology_browser'
                      }
                    )}&nbsp;
                    <span style={{ fontWeight: 'bold', }}>
                      (&#8679; +) J
                    </span>
                  </>
                }
                tooltipTop={'208%'}
                tooltipRight={'0'}
                tooltipBottom={'unset'}
                tooltipLeft={'unset'}
                tooltipLines={[
                  {
                    isVertical: true,
                    lineLength: '34px',
                    lineTop: '-30px',
                    lineRight: '10px',
                    lineBottom: 'unset',
                    lineLeft: 'unset',
                  },
                ]}
              />
              <button
                className='btn btn-primary btn-xs'
                onClick={() => jumpToEpoch(getActiveEvent())}
                style={{ marginLeft: '-1px', }}
              >
                <i className={'glyphicon glyphicon-step-forward'} />
              </button>
            </div>
          </div>
          <div
            className='btn-group hed-navigation'
            style={{
              marginRight: 0,
              flexBasis: '62.5%',
              maxWidth: 'fit-content',
            }}
          >
            <button
              className='btn btn-primary btn-xs'
              onClick={() => {
                const previousIndex = jsModulo(activeItemIndex - 1, totalHEDTags)
                setActiveItemIndex(previousIndex);
                jumpToEpoch(getItemEvent(getItemAtIndex(previousIndex)));
              }}
              onMouseEnter={() => setHoveredItem('jumpSelectPrevious')}
              onMouseLeave={() => setHoveredItem('')}
            >
              <i
                className={'glyphicon glyphicon-step-forward'}
                style={{ transform: 'rotate(-90deg)', top: '2px', }}
              />
            </button>
            <Tooltip
              key={`tooltip-selectPrevious`}
              itemRef={'selectPrevious'}
              tooltipText={
                <>
                  {t(
                    'Select Previous', {
                      ns: 'electrophysiology_browser'
                    }
                  )}&nbsp;
                  <span style={{ fontWeight: 'bold', }}>
                    (&#8679; +) &uarr;
                  </span>
                </>
              }
              tooltipTop={'105%'}
              tooltipRight={'0'}
              tooltipBottom={'unset'}
              tooltipLeft={'unset'}
              tooltipLines={[
                {
                  isVertical: true,
                  lineLength: '8px',
                  lineTop: '-6px',
                  lineRight: '56px',
                  lineBottom: 'unset',
                  lineLeft: 'unset',
                },
              ]}
            />
            <Tooltip
              key={`tooltip-selectNext`}
              itemRef={'selectNext'}
              tooltipText={
                <>
                  {t(
                    'Select Next', {
                      ns: 'electrophysiology_browser'
                    }
                  )}&nbsp;
                  <span style={{ fontWeight: 'bold', }}>
                    (&#8679; +) &darr;
                  </span>
                </>
              }
              tooltipTop={'105%'}
              tooltipRight={'0'}
              tooltipBottom={'unset'}
              tooltipLeft={'unset'}
              tooltipLines={[
                {
                  isVertical: true,
                  lineLength: '8px',
                  lineTop: '-6px',
                  lineRight: '34px',
                  lineBottom: 'unset',
                  lineLeft: 'unset',
                },
              ]}
            />
            <button
              type='button'
              className='btn btn-primary btn-xs'
              onClick={() => setActiveItemIndex(jsModulo(activeItemIndex - 1, totalHEDTags))}
              style={{ marginLeft: '-1px', }}
              onMouseEnter={() => setHoveredItem('selectPrevious')}
              onMouseLeave={() => setHoveredItem('')}
            >
              <i className={'glyphicon glyphicon-triangle-top'} />
            </button>
            <button
              type='button'
              className='btn btn-primary btn-xs'
              onClick={() => setActiveItemIndex(jsModulo(activeItemIndex + 1, totalHEDTags))}
              onMouseEnter={() => setHoveredItem('selectNext')}
              onMouseLeave={() => setHoveredItem('')}
            >
              <i className={'glyphicon glyphicon-triangle-bottom'} />
            </button>
            <Tooltip
              key={`tooltip-jumpSelectPrevious`}
              itemRef={'jumpSelectPrevious'}
              tooltipText={
                <>
                  {t(
                    'Select and Jump to Previous', {
                      ns: 'electrophysiology_browser'
                    }
                  )}&nbsp;
                  <span style={{ fontWeight: 'bold', }}>
                    (&#8679; +) &larr;
                  </span>
                </>
              }
              tooltipTop={'105%'}
              tooltipRight={'0'}
              tooltipBottom={'unset'}
              tooltipLeft={'unset'}
              tooltipLines={[
                {
                  isVertical: true,
                  lineLength: '8px',
                  lineTop: '-6px',
                  lineRight: '80px',
                  lineBottom: 'unset',
                  lineLeft: 'unset',
                },
              ]}
            />
            <Tooltip
              key={`tooltip-jumpSelectNext`}
              itemRef={'jumpSelectNext'}
              tooltipText={
                <>
                  {t(
                    'Select and Jump to Next', {
                      ns: 'electrophysiology_browser'
                    }
                  )}&nbsp;
                  <span style={{ fontWeight: 'bold', }}>
                    (&#8679; +) &rarr;
                  </span>
                </>
              }
              tooltipTop={'105%'}
              tooltipRight={'0'}
              tooltipBottom={'unset'}
              tooltipLeft={'unset'}
              tooltipLines={[
                {
                  isVertical: true,
                  lineLength: '8px',
                  lineTop: '-6px',
                  lineRight: '11px',
                  lineBottom: 'unset',
                  lineLeft: 'unset',
                },
              ]}
            />
            <button
              className='btn btn-primary btn-xs'
              onClick={() => {
                const nextIndex = jsModulo(activeItemIndex + 1, totalHEDTags)
                setActiveItemIndex(nextIndex);
                jumpToEpoch(getItemEvent(getItemAtIndex(nextIndex)));
              }}
              style={{ marginLeft: '-1px', }}
              onMouseEnter={() => setHoveredItem('jumpSelectNext')}
              onMouseLeave={() => setHoveredItem('')}

            >
              <i
                className={'glyphicon glyphicon-step-forward'}
                style={{ transform: 'rotate(90deg)', top: '2px', }}
              />
            </button>
          </div>
        </div>
      </div>
      <div
        className="panel-body"
        style={{padding: 0}}
      >
        <div
          ref={hedListRef}
          className="list-group"
          style={{
            maxHeight: `${viewerHeight + 75}px`,
            overflowY: 'scroll',
            overscrollBehaviorY: 'contain',
            marginBottom: 0,
          }}
        >
          {filteredHEDEpochs.length === 0 &&
            <div className='event-panel-message'>
              {t(
                'There are no event-level HED tags to endorse.', {
                  ns: 'electrophysiology_browser'
                }
              )}
            </div>
          }
          {
            filteredHEDEpochs.map((epoch, index) => {
              return epoch.tagGroups.map((tagGroup) => {
                return {
                  epoch: epoch.epoch,
                  epochIndex: epoch.epochIndex,
                  tagGroup: tagGroup,
                };
              }).flat()
            }).flat().map((event, i) => {
              const epoch = event.epoch;
              return (
                <div
                  key={event.tagGroup[0].ID}
                  className={
                    'annotation list-group-item list-group-item-action container-fluid hed-endorsement-list'
                    + (activeItemIndex === i ? '-selected' : '')
                  }
                  style={{
                    position: 'relative',
                  }}
                  onMouseEnter={() => updateActiveEpoch(event.epochIndex)}
                  onMouseLeave={() => {
                    const epochIndex = getEpochIndex(getActiveEvent());
                    if (epochIndex && epochIndex !== activeEpoch) {
                      updateActiveEpoch(epochIndex);
                    } else {
                      updateActiveEpoch(null);
                    }
                  }}
                >
                  <div
                    className="row epoch-details"
                    style={{
                      flexDirection: 'column',
                      paddingLeft: '15px',
                      paddingRight: '5px',
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}>
                      <div key={`epoch-label-${epoch.physiologicalTaskEventID}`}>
                        [#{i + 1}] {epoch.label}
                      </div>
                      <button
                        type="button"
                        className={'btn btn-xs btn-primary'}
                        onClick={() => {
                          setActiveItemIndex(i);
                          jumpToEpoch(epoch);
                        }}
                        onMouseEnter={() => setHoveredItem(`jumpToSelected-${i}`)}
                        onMouseLeave={() => setHoveredItem('')}
                      >
                        <i
                          className='glyphicon glyphicon-map-marker'
                        />
                      </button>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}>
                      <div>
                        {Math.round(epoch.onset * 1000) / 1000}
                        {epoch.duration > 0
                          && ' - '
                          + (Math.round((epoch.onset + epoch.duration) * 1000) / 1000)
                        }
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <span style={{ fontWeight: 'bold', }}>
                        {buildHEDString(event.tagGroup, showLongFormHED)}
                      </span>
                      {
                        <>
                          <Tooltip
                            key={`tooltip-jumpToSelected-${i}`}
                            itemRef={`jumpToSelected-${i}`}
                            tooltipText={
                              <>
                                Jump to (Selected) Event&nbsp;
                                <span style={{ fontWeight: 'bold', }}>
                                  (&#8679; +) J
                                </span>
                              </>
                            }
                            tooltipTop={'33px'}
                            tooltipRight={'10px'}
                            tooltipBottom={'unset'}
                            tooltipLeft={'unset'}
                            tooltipLines={[
                              {
                                isVertical: true,
                                lineLength: '8px',
                                lineTop: '-6px',
                                lineRight: '10px',
                                lineBottom: 'unset',
                                lineLeft: 'unset',
                              },
                            ]}
                          />
                          <Tooltip
                            key={`tooltip-editSelected-${i}`}
                            itemRef={`editSelected-${i}`}
                            tooltipText={
                              <>
                                {t(
                                  'Edit (Selected) Event', {
                                    ns: 'electrophysiology_browser'
                                  }
                                )}&nbsp;
                                <span style={{ fontWeight: 'bold', }}>
                                  (&#8679; +) K
                                </span>
                              </>
                            }
                            tooltipTop={'unset'}
                            tooltipRight={'10px'}
                            tooltipBottom={'inherit'}
                            tooltipLeft={'unset'}
                            extraStyles={{ marginTop: '47px', }}
                            tooltipLines={[
                              {
                                isVertical: true,
                                lineLength: '8px',
                                lineTop: '-6px',
                                lineRight: '23px',
                                lineBottom: 'unset',
                                lineLeft: 'unset',
                              },
                            ]}
                          />
                        </>
                      }
                      <button
                        type='button'
                        className='btn btn-xs btn-primary'
                        style={{ maxHeight: '22px', }}
                        onClick={() => handleEditClick(epoch)}
                        onMouseEnter={() => setHoveredItem(`editSelected-${i}`)}
                        onMouseLeave={() => setHoveredItem('')}
                      >
                        <i
                          className='glyphicon glyphicon-edit'
                        />
                        &nbsp;{t(
                          'Edit', {
                            ns: 'electrophysiology_browser'
                          }
                        )}
                      </button>
                    </div>
                    <Panel
                      id={`tagged-by-panel-${event.tagGroup[0].ID}`}
                      key={event.tagGroup[0].ID}
                      class={'panel-primary tagged-by-panel' + (
                        event.epochIndex === activeEpoch
                          ? ' tagged-by-active'
                          : ''
                      )}
                      title={
                        <>
                          {t(
                            'Tagged By', {
                              ns: 'electrophysiology_browser'
                            }
                          )}:&nbsp;
                          {
                            event.tagGroup
                              .map(tag => tag.TaggerName)
                              .filter((tagger, index , taggers) => {
                                return taggers.indexOf(tagger) === index; // unique list
                              })
                              .join(', ')
                          }
                          &emsp;
                          {
                            event.tagGroup.find(
                              tag => tag.Endorsements.some(
                                endorsement => endorsement.EndorsementComment
                              )
                            ) && (
                              <i
                                className='glyphicon glyphicon-comment glyphicon-endorsement-panel'
                                style={{ color: '#256eb6', }}
                              />
                            )
                          }
                          {
                            event.tagGroup.find(
                              tag => tag.Endorsements.some(
                                endorsement => endorsement.EndorsementStatus === 'Endorsed'
                              )
                            ) && (
                              <i
                                className='glyphicon glyphicon-flag glyphicon-endorsement-panel'
                                style={{ color: 'green', }}
                              />
                            )
                          }
                          {
                            event.tagGroup.find(
                              tag => tag.Endorsements.some(
                                endorsement => endorsement.EndorsementStatus === 'Caveat'
                              )
                            ) && (
                              <i
                                className='glyphicon glyphicon-flag glyphicon-endorsement-panel'
                                style={{ color: 'red', }}
                              />
                            )
                          }
                        </>
                      }
                      initCollapsed={true}
                      collapsed={true}
                      style={{ width: '90%', }}
                    >
                      <div>
                        {
                          event.tagGroup.some((tag) => {
                            return tag.Endorsements.length > 0;
                          }) ? (
                            <ul style={{
                              margin: 0,
                              marginLeft: '-10px',
                            }}>
                              {
                                event.tagGroup
                                  .filter((tag) => {
                                    return tag.Endorsements.length > 0;
                                  })
                                  .map((tag) => {
                                    return tag.Endorsements.map((endorsement, i) => {
                                      return (
                                        <React.Fragment key={`hed-endorsement-status-${i}`}>
                                          {
                                            endorsement.EndorsementStatus !== 'Comment' && (
                                              <li
                                                className={'hed-endorsement hed-' +
                                                endorsement.EndorsementStatus.toLowerCase()
                                              }>
                                                <span key={`hed-endorsement-status-${i}`}>
                                                  {endorsement.EndorsedBy}
                                                </span>
                                              </li>
                                            )
                                          }
                                          {
                                            endorsement.EndorsementComment && (
                                              <li
                                                  className='hed-endorsement hed-comment'>
                                                <span>
                                                  {endorsement.EndorsedBy}:&nbsp;
                                                </span>
                                                <span style={{ fontStyle: 'italic', }}>
                                                  {endorsement.EndorsementComment}
                                                </span>
                                              </li>
                                            )
                                          }
                                        </React.Fragment>
                                      );
                                    });
                                  })
                              }
                            </ul>
                          )
                          : t(
                              'No comment', {
                                ns: 'electrophysiology_browser'
                              }
                            )
                        }
                      </div>
                    </Panel>
                    {
                      canEndorse && (
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            marginTop: '5px',
                            marginBottom: '5px',
                          }}
                        >
                          <div className={(i + 1) === totalHEDTags ? 'dropup' : ''}>
                            {
                              <Tooltip
                                key={`action-tooltip-${i}`}
                                itemRef={`endorseActions-${i}`}
                                tooltipText={
                                  <>
                                    {t(
                                      'For selected tag:', {
                                        ns: 'electrophysiology_browser'
                                      }
                                    )}
                                    <div
                                      style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        width: '120px',
                                      }}
                                    >
                                      <div>
                                        {t(
                                          'Endorse', {
                                            ns: 'electrophysiology_browser'
                                          }
                                        )}
                                        <br/>
                                        {t(
                                          'Caveat', {
                                            ns: 'electrophysiology_browser'
                                          }
                                        )}
                                        <br/>
                                        {t(
                                          'Comment', {
                                            ns: 'electrophysiology_browser'
                                          }
                                        )}
                                        <br/>
                                        {t('Submit', {ns: 'loris'})}
                                      </div>
                                      <div>
                                      <span style={{ fontWeight: 'bold', }}>
                                        (^ +) E
                                      </span>
                                        <br/>
                                        <span style={{ fontWeight: 'bold', }}>
                                        (^ +) C
                                      </span>
                                        <br/>
                                        <span style={{ fontWeight: 'bold', }}>
                                        (^ +) M
                                      </span>
                                        <br/>
                                        <span style={{ fontWeight: 'bold', }}>
                                        (^ +) Enter
                                      </span>
                                      </div>
                                    </div>
                                  </>
                                }
                                tooltipTop={'unset'}
                                tooltipRight={'unset'}
                                tooltipBottom={'unset'}
                                tooltipLeft={'113px'}
                                tooltipLines={[
                                  {
                                    isVertical: false,
                                    lineLength: '14px',
                                    lineTop: '10px',
                                    lineRight: 'unset',
                                    lineBottom: 'unset',
                                    lineLeft: '-9px',
                                  },
                                ]}
                              />
                            }

                            <button
                              type='button'
                              className='btn btn-xs btn-default dropdown-toggle'
                              data-toggle='dropdown'
                              data-bs-display="static"
                              style={{
                                borderRadius: '3px',
                                marginRight: '0',
                                maxHeight: '22px',
                                width: '100px',
                                display: 'flex',
                                justifyContent: 'space-between'
                              }}
                              onMouseEnter={() => setHoveredItem(`endorseActions-${i}`)}
                              onMouseLeave={() => setHoveredItem('')}
                            >
                              <div>
                              {
                                openCommentPanels
                                  .find(panel => panel.ID === event.tagGroup[0].ID)
                                  ? (
                                    <>
                                      {
                                        TagAction[
                                          openCommentPanels.find(
                                            panel => panel.ID === event.tagGroup[0].ID
                                          ).tagAction
                                          ].icon && (
                                          <>
                                            <i
                                              className={'glyphicon glyphicon-' +
                                                TagAction[openCommentPanels
                                                  .find(panel => panel.ID === event.tagGroup[0].ID).tagAction
                                                  ].icon}
                                              style={{ color: TagAction[
                                                  openCommentPanels
                                                    .find(panel => panel.ID === event.tagGroup[0].ID).tagAction
                                                  ].color,
                                              }}
                                            />
                                            &nbsp;
                                          </>
                                        )
                                      }
                                      {
                                        t(TagAction[
                                          openCommentPanels
                                            .find(panel => panel.ID === event.tagGroup[0].ID).tagAction
                                          ].text, {
                                          ns: 'electrophysiology_browser'
                                        })
                                      }
                                    </>
                                  )
                                  : (
                                    <>
                                      {t(
                                        TagAction['Select'].text, {
                                          ns: 'electrophysiology_browser'
                                        }
                                      )}
                                    </>
                                  )
                              }
                              </div>
                              <span className="glyphicon glyphicon-menu-down"></span>
                            </button>
                            <ul className='dropdown-menu pull-left'
                                role='menu'
                                style={{
                                  minWidth: 'max-content',
                                  width: 'fit-content',
                                  top: 'unset',
                                  left: 'unset',
                                }}
                            >
                              {
                                Object.keys(TagAction).map((tagAction, i) => {
                                  return (
                                    <li
                                      key={`tag-action-${i}`}
                                      onClick={() => {
                                        const panelFound = openCommentPanels
                                          .find(panel => panel.ID === event.tagGroup[0].ID);

                                        setOpenCommentPanels([
                                          ...openCommentPanels.filter(panel => panel.ID !== event.tagGroup[0].ID),
                                          {
                                            ID: event.tagGroup[0].ID,
                                            text: panelFound
                                              ? panelFound.text
                                              : '',
                                            tagAction: tagAction,
                                            activePanel: tagAction,
                                            isOpen: tagAction !== 'Select',
                                          }
                                        ]);
                                        setTimeout(() => {
                                          focusCommentWithID(event.tagGroup[0].ID);
                                        }, 0);
                                      }}>
                                      {
                                        TagAction[tagAction].icon && (
                                          <i
                                            className={'glyphicon glyphicon-' + TagAction[tagAction].icon}
                                            style={{ color: TagAction[tagAction].color, }}
                                          />
                                        )
                                      }
                                      &nbsp;{t(
                                        TagAction[tagAction].text, {
                                        ns: 'electrophysiology_browser'
                                      })}
                                    </li>
                                  );
                                })
                              }
                            </ul>
                          </div>
                          <div>
                            <div
                              id={`hed-endorsement-alert-${event.tagGroup[0].ID}`}
                              className="alert alert-success text-center"
                              role="alert"
                              style={{
                                margin: '0 5px',
                                padding: '0 5px',
                                visibility: 'hidden',
                              }}
                            >
                              {t(
                                'Updated!', {ns: 'electrophysiology_browser'}
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    }
                    {
                      canEndorse && openCommentPanels.find(panel => panel.ID === event.tagGroup[0].ID) &&
                      openCommentPanels
                        .find(panel => panel.ID === event.tagGroup[0].ID)
                        .isOpen && (
                          <div
                            style={{ marginBottom: '5px', }}
                          >
                            {
                              openCommentPanels.find(
                                panel => panel.ID === event.tagGroup[0].ID
                              ).activePanel === 'Comment' && (
                                <textarea
                                  id={`hed-endorsement-comment-${event.tagGroup[0].ID}`}
                                  value={openCommentPanels.find(panel => panel.ID === event.tagGroup[0].ID).text}
                                  onChange={(e) => {
                                    setOpenCommentPanels([
                                      ...openCommentPanels.filter(panel => panel.ID !== event.tagGroup[0].ID),
                                      {
                                        ...openCommentPanels.find(panel => panel.ID === event.tagGroup[0].ID),
                                        text: e.target.value
                                      }
                                    ]);
                                  }}
                                  style={{
                                    width: 'calc(100% - 10px)',
                                    height: '28px',
                                    minHeight: '28px',
                                    marginTop: '5px',
                                    resize: 'vertical',
                                  }}
                                />
                              )
                            }
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                                marginTop: '5px',
                              }}
                            >
                              <button
                                disabled={
                                  openCommentPanels
                                    .find(panel => panel.ID === event.tagGroup[0].ID)
                                    .text.length === 0 &&
                                  openCommentPanels
                                    .find(panel => panel.ID === event.tagGroup[0].ID)
                                    .activePanel === 'Comment'
                                }
                                onClick={() => {
                                  const panel = openCommentPanels.find(
                                    panel => panel.ID === event.tagGroup[0].ID
                                  );
                                  setSendingRequest(true);
                                  handleEndorseSubmit(panel);
                                  setOpenCommentPanels(
                                    openCommentPanels.filter(panel => panel.ID !== event.tagGroup[0].ID)
                                  );
                                }}
                                className="btn btn-xs btn-primary"
                                // style={{
                                //   fontSize: '8px',
                                //   textWrap: 'wrap',
                                //   maxWidth: '33%',
                                // }}
                              >
                                {t('Submit', {ns: 'loris'})}
                              </button>
                              {
                                openCommentPanels
                                  .find(panel => panel.ID === event.tagGroup[0].ID)
                                  .activePanel === 'Comment' && (
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setOpenCommentPanels([
                                        ...openCommentPanels.filter(panel => panel.ID !== event.tagGroup[0].ID),
                                        {
                                          ...openCommentPanels.find(panel => panel.ID === event.tagGroup[0].ID),
                                          text: '',
                                        },
                                      ]);
                                    }}
                                    className="btn btn-xs btn-primary"
                                  >
                                    {t('Clear', {ns: 'loris'})}
                                  </button>
                                )
                              }
                              <button
                                onClick={() => {
                                  setOpenCommentPanels(
                                    openCommentPanels.filter(panel => panel.ID !== event.tagGroup[0].ID)
                                  );
                                }}
                                className="btn btn-xs btn-primary"
                              >
                                {t('Cancel', {ns: 'loris'})}
                              </button>
                            </div>
                          </div>
                      )
                    }
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    </div>
  );
};

HEDEndorsement.defaultProps = {};

export default connect(
  (state: RootState)=> ({
    epochs: state.dataset.epochs,
    domain: state.bounds.domain,
    rightPanel: state.rightPanel,
    interval: state.bounds.interval,
    viewerHeight: state.bounds.viewerHeight,
    hedSchema: state.dataset.hedSchema,
    datasetTags: state.dataset.datasetTags,
    physioFileID: state.dataset.physioFileID,
    activeEpoch: state.dataset.activeEpoch,
  }),
  (dispatch: (_: any) => void) => ({
    setCurrentAnnotation: R.compose(
      dispatch,
      setCurrentAnnotation
    ),
    updateActiveEpoch: R.compose(
      dispatch,
      updateActiveEpoch
    ),
    setTimeSelection: R.compose(
      dispatch,
      setTimeSelection
    ),
    setRightPanel: R.compose(
      dispatch,
      setRightPanel
    ),
    setInterval: R.compose(
      dispatch,
      setInterval
    ),
    setEpochs: R.compose(
      dispatch,
      setEpochs
    ),
  })
)(HEDEndorsement);
