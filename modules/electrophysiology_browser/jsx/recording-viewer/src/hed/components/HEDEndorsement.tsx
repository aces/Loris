import React, {useEffect, useRef, useState} from 'react';
import {
  buildHEDString,
  getRootTags,
  getSchemaElementName,
} from '../../events/eventLogic';
import {RecordingEvent, HEDTag} from '../../domain/types';
import Panel from '../../ui/Panel';
import {useTranslation} from 'react-i18next';
import {useTimeWindow} from '../../timeline/TimeWindowContext';
import {useTimeSelection} from '../../timeline/TimeSelectionContext';
import {useRightPanel} from '../../viewer/RightPanelContext';
import {useCurrentAnnotation}
  from '../../annotations/state/CurrentAnnotationContext';
import {useEvents} from '../../events/state/EventContext';
import {useRecording} from '../../recording/RecordingContext';
import {useHED} from '../state/HEDContext';
import Tooltip from './HEDTooltip';

type HEDEndorsementProps = {
  viewerHeight: number,
  canEndorse: boolean,
  pressedKey: string,
};

type FilteredHEDEvent = {
  event: RecordingEvent,
  eventIndex: number,
  tagGroups: HEDTag[][],
};

type SubmenuItem = {
  id: number | null,
  value: string | null,
};

type CommentPanel = {
  ID: HEDTag['ID'],
  text: string,
  tagAction: string,
  activePanel: string,
  isOpen: boolean,
};

/** HED endorsement component. */
function HEDEndorsement({
  viewerHeight,
  canEndorse,
  pressedKey,
}: HEDEndorsementProps) {
  const {physioFileID} = useRecording();
  const {hedSchema, datasetTags} = useHED();
  const {setCurrentAnnotation} = useCurrentAnnotation();
  const {
    events,
    setEvents,
    activeEvent,
    setActiveEvent: updateActiveEvent,
  } = useEvents();
  const {setRightPanel} = useRightPanel();
  const {
    recordingTimeRange,
    setTimeWindow,
  } = useTimeWindow();
  const {setTimeSelection} = useTimeSelection();

  const HEDFilter = {
    NO_FILTER: 'No Filter',
    ENDORSED: 'Endorsed',
    CAVEAT: 'Caveat',
    WITH_COMMENT: 'With Comment',
    TAGGED_BY: 'Tagged By',
    ENDORSED_BY: 'Endorsed By',
    CAVEAT_BY: 'Caveat By',
  };

  const Submenu = {
    NONE: 0,
    TAGGED_BY: 1,
    ENDORSED_BY: 2,
    CAVEAT_BY: 3,
  };
  const {t} = useTranslation();
  const [activeFilter, setActiveFilter] = useState(HEDFilter.NO_FILTER);
  const [filteredHEDEvents, setFilteredHEDEvents]
    = useState<FilteredHEDEvent[]>([]);
  const [numTags, setNumTags] = useState(0);
  const [totalHEDTags, setTotalHEDTags] = useState(0);
  const filterMenuRef = useRef<HTMLDivElement>(null);
  const [activeSubmenu, setActiveSubmenu] = useState(Submenu.NONE);
  const [activeSubmenuItem, setActiveSubmenuItem] = useState<SubmenuItem>({
    id: 0,
    value: '',
  });

  const [showLongFormHED, setShowLongFormHED] = useState(false);
  const [searchText, setSearchText] = useState('');

  const [openCommentPanels, setOpenCommentPanels] = useState<CommentPanel[]>([]);

  const [sendingRequest, setSendingRequest] = useState(false);

  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [hoveredItem, setHoveredItem] = useState('');

  const hedListRef = useRef<HTMLDivElement>(null);

  const TagAction: Record<string, {
    text: string,
    icon: string | undefined,
    color: string,
  }> = {
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
  };

  /** Set filter. */
  const setFilter = (activeFilter: string) => {
    setActiveFilter(activeFilter);
    setActiveItemIndex(0);
  };

  useEffect(() => {
    const filteredEvents = events.filter((event) => {
      return event.hed.length > 0;
    });

    setFilteredHEDEvents(filteredEvents.map((event) => {
      return {
        event: event,
        eventIndex: events.indexOf(event),
        tagGroups: getRootTags(event.hed)
          .filter((rootTag) => {
            switch (activeFilter) {
            case HEDFilter.NO_FILTER:
              return true;
            case HEDFilter.ENDORSED:
              return !tagInGroupIsEndorsed(rootTag, event.hed);
            case HEDFilter.CAVEAT:
              return tagInGroupHasCaveat(rootTag, event.hed);
            case HEDFilter.WITH_COMMENT:
              return tagInGroupHasComment(rootTag, event.hed);
            case HEDFilter.TAGGED_BY:
              return tagInGroupTaggedBy(rootTag, event.hed, activeSubmenuItem.id);
            case HEDFilter.ENDORSED_BY:
              return tagInGroupEndorsedBy(rootTag, event.hed, activeSubmenuItem.id);
            case HEDFilter.CAVEAT_BY:
              return tagInGroupIsCaveatBy(rootTag, event.hed, activeSubmenuItem.id);
            }
          })
          .filter((rootTag) => {
            if (searchText.length > 0) {
              return tagInGroupContainsSearchText(rootTag, event.hed, searchText);
            }
            return true;
          })
          .map((rootTag) => buildTagGroup(rootTag, event.hed)),
      };
    }));
  }, [
    activeFilter, searchText, showLongFormHED,
    activeSubmenuItem.id, sendingRequest,
  ]);


  useEffect(() => {
    const totalHEDTags = filteredHEDEvents
      .map((event) => event.tagGroups)
      .reduce((a, b) => a + b.length, 0);
    setTotalHEDTags(totalHEDTags);
    setActiveItemIndex(0);
  }, [filteredHEDEvents]);

  /** Class change. */
  const classChange = (mutationList: MutationRecord[]) => {
    mutationList
      .filter((mutation) => mutation.attributeName === 'class')
      .map((mutation) => {
        if (!(mutation.target as Element).classList.contains('open')) {
          setActiveSubmenu(Submenu.NONE);
        }
      });
  };

  useEffect(() => {
    const filterDropdown = document.querySelector('#filter-dropdown');
    const classObserver = new MutationObserver(classChange);
    if (filterDropdown) {
      classObserver.observe(filterDropdown, {attributes: true});
    }


    setNumTags(events.filter((event) => {
      return event.hed.length > 0;
    }).map((event) => {
      return {
        event: event,
        eventIndex: events.indexOf(event),
        tagGroups: getRootTags(event.hed)
          .map((rootTag) => buildTagGroup(rootTag, event.hed)),
      };
    })
      .map((event) => event.tagGroups)
      .reduce((a, b) => a + b.length, 0));

    return () => {
      classObserver.disconnect(); // Necessary?
    };
  }, []);

  /** Js modulo. */
  const jsModulo = (n: number, mod: number) => {
    return ((n % mod) + mod) % mod;
  };

  /** Check item at index visibility. */
  const checkItemAtIndexVisibility = (index: number) => {
    if (isNaN(index) || index >= totalHEDTags) {
      return;
    }

    const itemAtIndex =
      document.querySelector<HTMLElement>(`.list-group > div:nth-child(${index + 1})`);

    if (itemAtIndex && hedListRef.current) {
      const firstItem =
        document.querySelector<HTMLElement>('.list-group > div:nth-child(1)');

      const firstItemOffset = firstItem?.offsetTop ?? 0;

      if (activeItemIndex === 0) {
        hedListRef.current.scrollTop = 0;
      } else if (
        itemAtIndex.offsetTop
          > (hedListRef.current.scrollTop + hedListRef.current.clientHeight)
      ) {
        hedListRef.current.scrollTop = itemAtIndex.offsetTop - firstItemOffset;
      } else if (
        ((itemAtIndex.offsetTop - itemAtIndex.clientHeight)
          < hedListRef.current.scrollTop) ||
        ((itemAtIndex.offsetTop + itemAtIndex.clientHeight
          - hedListRef.current.scrollTop - firstItemOffset)
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
  };

  useEffect(() => {
    checkItemAtIndexVisibility(activeItemIndex);
  }, [activeItemIndex]);

  /** Get item at index. */
  const getItemAtIndex = (itemIndex: number): HEDTag | undefined => {
    const tags = filteredHEDEvents.reduce<HEDTag[]>((allTags, event) => {
      return allTags.concat(...event.tagGroups);
    }, []);
    return tags[itemIndex];
  };

  /** Get active item. */
  const getActiveItem = () => {
    return getItemAtIndex(activeItemIndex);
  };

  /** Get item event. */
  const getItemEvent = (item?: HEDTag): RecordingEvent | undefined => {
    return item && events.find((event) => {
      const eventHED = event.hed;
      return (
        eventHED &&
        eventHED.find((hed) => hed.ID === item.ID)
      );
    });
  };

  /** Get active event. */
  const getActiveEvent = () => {
    return getItemEvent(getActiveItem());
  };

  /** Get event index. */
  const getEventIndex = (event?: RecordingEvent): number | null => {
    return event
      ? events.findIndex(
        (e) => e.physiologicalTaskEventID === event.physiologicalTaskEventID
      )
      : null;
  };

  useEffect(() => {
    const eventIndex = (getEventIndex(getActiveEvent()));
    if (eventIndex) {
      if (activeEvent === null) {
        updateActiveEvent(eventIndex);
      } else if (eventIndex !== activeEvent) {
        updateActiveEvent(activeEvent);
      }
    }
  }, [filteredHEDEvents, activeEvent]);

  useEffect(() => {
    const eventIndex = (getEventIndex(getActiveEvent()));
    if (eventIndex) {
      if (eventIndex !== activeEvent) {
        updateActiveEvent(eventIndex);
      }
    }
  }, [activeItemIndex]);


  /** Focus comment with ID. */
  const focusCommentWithID = (itemID: HEDTag['ID']) => {
    document.getElementById(
      `hed-endorsement-comment-${itemID}`
    )?.focus();
  };

  /** Select active item tag action. */
  const selectActiveItemTagAction = (tagAction: string) => {
    const activeItem = getActiveItem();

    if (activeItem) {
      const panelFound = openCommentPanels
        .find((panel) => panel.ID === activeItem.ID);

      setOpenCommentPanels([
        ...openCommentPanels.filter((panel) => panel.ID !== activeItem.ID),
        {
          ID: activeItem.ID,
          text: panelFound
            ? panelFound.text
            : '',
          tagAction: tagAction,
          activePanel: tagAction,
          isOpen: true,
        },
      ]);
      setTimeout(() => {
        focusCommentWithID(activeItem?.ID);
        // Adjust to new height
        checkItemAtIndexVisibility(activeItemIndex);
      }, 0);
    }
  };

  /** Perform active item tag action. */
  const performActiveItemTagAction = () => {
    const activeItem = getActiveItem();
    if (!activeItem) {
      return;
    }
    const panelFound = openCommentPanels
      .find((panel) => panel.ID === activeItem.ID);
    if (panelFound) {
      if (
        ['Endorsed', 'Caveat', 'Comment']
          .includes(panelFound.tagAction)
      ) {
        setSendingRequest(true);
        handleEndorseSubmit(panelFound);
        setOpenCommentPanels(
          openCommentPanels.filter((panel) => panel.ID !== activeItem.ID)
        );
      }
    } else {
      console.error('Something went wrong when trying to endorse. Please report this incident.');
    }
  };

  useEffect(() => {
    if (
      !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
        'KeyC', 'KeyE', 'KeyM', 'Enter', 'KeyI', 'KeyJ', 'KeyK',
      ].includes(pressedKey)
    ) {
      return;
    }

    const currentEvent = getActiveEvent();

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
      jumpToEvent(getItemEvent(getItemAtIndex(previousIndex)));
      break;
    case 'ArrowRight':
      const nextIndex = jsModulo(activeItemIndex + 1, totalHEDTags);
      setActiveItemIndex(nextIndex);
      jumpToEvent(getItemEvent(getItemAtIndex(nextIndex)));
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
      if (currentEvent) {
        jumpToEvent(currentEvent);
      }
      break;
    case 'KeyK':
      if (currentEvent) {
        handleEditClick(currentEvent);
      }
      break;
    }
  }, [pressedKey]);

  /** Tag in group has comment. */
  const tagInGroupHasComment = (
    tag: HEDTag | undefined,
    tagList: HEDTag[]
  ): boolean => {
    if (!tag) return false;
    return tag.Endorsements.filter((endorsement) => {
      return endorsement.EndorsementComment !== null;
    }).length > 0 || (
      tag.PairRelID !== null &&
      tagInGroupHasComment(tagList.find((t) => t.ID === tag.PairRelID), tagList)
    );
  };

  /** Tag in group has caveat. */
  const tagInGroupHasCaveat = (
    tag: HEDTag | undefined,
    tagList: HEDTag[]
  ): boolean => {
    if (!tag) return false;
    return tag.Endorsements.filter((endorsement) => {
      return endorsement.EndorsementStatus === 'Caveat';
    }).length > 0 || (
      tag.PairRelID !== null &&
      tagInGroupHasCaveat(tagList.find((t) => t.ID === tag.PairRelID), tagList)
    );
  };

  /** Tag in group is caveat by. */
  const tagInGroupIsCaveatBy = (
    tag: HEDTag | undefined,
    tagList: HEDTag[],
    endorserID: number | null
  ): boolean => {
    if (!tag) return false;
    return tag.Endorsements.filter((endorsement) => {
      return endorsement.EndorsedByID === endorserID &&
        endorsement.EndorsementStatus === 'Caveat';
    }).length > 0 || (
      tag.PairRelID !== null &&
      tagInGroupIsCaveatBy(tagList.find((t) => t.ID === tag.PairRelID), tagList, endorserID)
    );
  };

  /** Tag in group contains search text. */
  const tagInGroupContainsSearchText = (
    tag: HEDTag | undefined,
    tagList: HEDTag[],
    text: string
  ): boolean => {
    if (!tag) return false;
    const searchText = text
      .toLowerCase()
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape regex characters
    return (
      (
        !showLongFormHED &&
        getSchemaElementName(tag, false)
          .toLowerCase().search(searchText) > -1
      ) || (
        showLongFormHED &&
        getSchemaElementName(tag, true)
          .toLowerCase().search(searchText) > -1
      )
    ) || (
      tag.PairRelID !== null &&
      tagInGroupContainsSearchText(tagList.find((t) => t.ID === tag.PairRelID), tagList, text)
    );
  };

  /** Tag in group endorsed by. */
  const tagInGroupEndorsedBy = (
    tag: HEDTag | undefined,
    tagList: HEDTag[],
    endorserID: number | null
  ): boolean => {
    if (!tag) return false;
    return tag.Endorsements.filter((endorsement) => {
      return endorsement.EndorsedByID === endorserID &&
        endorsement.EndorsementStatus === 'Endorsed';
    }).length > 0 || (
      tag.PairRelID !== null &&
      tagInGroupEndorsedBy(tagList.find((t) => t.ID === tag.PairRelID), tagList, endorserID)
    );
  };

  /** Tag in group tagged by. */
  const tagInGroupTaggedBy = (
    tag: HEDTag | undefined,
    tagList: HEDTag[],
    taggerID: number | null
  ): boolean => {
    if (!tag) return false;
    return tag.TaggedBy === taggerID || (
      tag.PairRelID !== null &&
      tagInGroupTaggedBy(tagList.find((t) => t.ID === tag.PairRelID), tagList, taggerID)
    );
  };

  /** Tag in group is endorsed. */
  const tagInGroupIsEndorsed = (
    tag: HEDTag | undefined,
    tagList: HEDTag[]
  ): boolean => {
    if (!tag) return false;
    return tag.Endorsements.length === 0 ||
      tag.Endorsements.every((endorsement) => {
        return endorsement.EndorsementStatus !== 'Endorsed';
      }) || (
      tag.PairRelID !== null &&
        tagInGroupIsEndorsed(tagList.find((t) => t.ID === tag.PairRelID), tagList)
    );
  };

  /** Build tag group. */
  const buildTagGroup = (rootTag: HEDTag, hedTags: HEDTag[]) => {
    const tagGroup = [rootTag];
    let tag: HEDTag | undefined = rootTag;
    while (tag && tag.PairRelID !== null) {
      const currentTag: HEDTag = tag;
      tag = hedTags.find((hedTag) => hedTag.ID === currentTag.PairRelID);
      if (tag) tagGroup.push(tag);
    }
    return tagGroup;
  };

  /** Jump to event. */
  const jumpToEvent = (event?: RecordingEvent) => {
    if (!event) {
      return;
    }

    const eventTimeRange = [
      event.onset,
      Math.max(
        event.onset + event.duration,
        event.onset + 0.1
      ),
    ].sort();
    setTimeWindow([
      Math.max(0, eventTimeRange[0] - 0.1),
      Math.min(eventTimeRange[1], recordingTimeRange[1]),
    ]);
  };

  /** Handle edit click. */
  const handleEditClick = (event: RecordingEvent) => {
    setCurrentAnnotation(event);
    setRightPanel('annotationForm');
    const startTime = event.onset;
    const endTime = event.duration + startTime;
    setTimeSelection([startTime, endTime]);
  };

  /** Handle text change. */
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  /** Handle endorse submit. */
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
          : null,
      }),
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw (response);
    }).then((response) => {
      const endorsement = {
        EndorsedBy: response.endorsedBy,
        EndorsedByID: response.endorsedByID,
        EndorsementComment: panel.text,
        EndorsementStatus: panel.tagAction,
        EndorsementTime: response.endorsementTime,
      };
      const eventWithEndorsement = events.find((event) => {
        return event.hed.map((tag) => tag.ID).includes(rootTagID);
      });
      if (!eventWithEndorsement) {
        throw new Error('Event not found');
      }

      const hedWithEndorsement = eventWithEndorsement.hed.find(
        (tag) => tag.ID === rootTagID
      );
      if (!hedWithEndorsement) throw new Error('HED tag not found');
      const updatedEvent = {
        ...eventWithEndorsement,
        hed: [
          ...eventWithEndorsement.hed.filter((tag) => tag !== hedWithEndorsement),
          {
            ...hedWithEndorsement,
            Endorsements: [
              ...hedWithEndorsement.Endorsements,
              endorsement,
            ],
          },
        ],
      };
      setEvents(events.map((event) => (
        event === eventWithEndorsement ? updatedEvent : event
      )));
      setSendingRequest(false);

      // TODO: Handle non-success
      const alertElement = document.getElementById(
        `hed-endorsement-alert-${rootTagID}`
      );
      if (!alertElement) return;
      alertElement.style.visibility = 'visible';
      setTimeout(() => {
        alertElement.style.visibility = 'hidden';
      }, 2000);
    });
  };

  /** Get filter decoration. */
  const getFilterDecoration = (filterName: string) => {
    let filterNameDecoration = <></>;
    switch (filterName) {
    case HEDFilter['ENDORSED']:
    case HEDFilter['ENDORSED_BY']:
      filterNameDecoration = <i
        key={`filter-decoration-${filterName}`}
        className='glyphicon glyphicon-flag'
        style={{color: 'green'}}
      />;
      break;
    case HEDFilter['CAVEAT']:
    case HEDFilter['CAVEAT_BY']:
      filterNameDecoration = <i
        key={`filter-decoration-${filterName}`}
        className='glyphicon glyphicon-flag'
        style={{color: 'red'}}
      />;
      break;
    case HEDFilter['WITH_COMMENT']:
      filterNameDecoration = <i
        key={`filter-decoration-${filterName}`}
        className='glyphicon glyphicon-comment'
        style={{color: '#256eb6'}}
      />;
      break;
    case HEDFilter['TAGGED_BY']:
      filterNameDecoration = <i
        key={`filter-decoration-${filterName}`}
        className='glyphicon glyphicon-tag'
        style={{color: '#064785'}}
      />;
      break;
    }
    return filterNameDecoration;
  };

  return (
    <div
      className="panel panel-primary event-list"
      style={{borderTopLeftRadius: 0, borderTopRightRadius: 0}}
    >
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
            <span style={{fontSize: '14px', verticalAlign: 'middle'}}>
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
            style={{margin: 0}}
          >
            <button
              type='button'
              className='btn btn-default btn-xs dropdown-toggle'
              data-toggle='dropdown'
              style={{
                borderRadius: [
                  HEDFilter.TAGGED_BY,
                  HEDFilter.ENDORSED_BY,
                  HEDFilter.CAVEAT_BY,
                ].includes(activeFilter)
                  ? '3px 0 0 3px'
                  : '3px',
                height: '25px',
              }}
            >
              {getFilterDecoration(activeFilter)}&nbsp;
              {t(activeFilter, {
                ns: 'electrophysiology_browser',
              })}
              {
                [HEDFilter.TAGGED_BY, HEDFilter.ENDORSED_BY].includes(activeFilter)
                  ? ':'
                  : ''
              }
              &nbsp;<span className='glyphicon glyphicon-menu-down'/>
            </button>
            {
              [
                HEDFilter.TAGGED_BY,
                HEDFilter.ENDORSED_BY,
                HEDFilter.CAVEAT_BY,
              ].includes(activeFilter)
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

            <ul className='dropdown-menu'
              role='menu'
              style={{height: `${Object.values(HEDFilter).length * 21.5}px`}}
            >
              {
                Object.values(HEDFilter).map((filterName, filterIndex, filters) => {
                  let filterItem = <React.Fragment key={`filter-item-${filterName}-${filterIndex}`}>
                    {getFilterDecoration(filterName)}&nbsp;
                    {t(filterName, {ns: 'electrophysiology_browser'})}
                  </React.Fragment>;
                  if ([
                    HEDFilter.TAGGED_BY,
                    HEDFilter.ENDORSED_BY,
                    HEDFilter.CAVEAT_BY,
                  ].includes(filterName)) {
                    let itemList: SubmenuItem[] = [];
                    let submenuIsActive = false;
                    switch (filterName) {
                    case HEDFilter.TAGGED_BY:
                      // Unique list of taggers
                      itemList = filteredHEDEvents.reduce<SubmenuItem[]>((taggers, hedEvent) => {
                        hedEvent.event.hed.forEach((hedTagger) => {
                          if (!taggers.map(
                            (tagger) => tagger.id
                          ).includes(hedTagger.TaggedBy)) {
                            taggers.push({
                              id: hedTagger.TaggedBy,
                              value: hedTagger.TaggerName,
                            });
                          }
                        });
                        return taggers;
                      }, []).sort((a, b) => {
                        return (a.value ?? '').localeCompare(b.value ?? '');
                      });
                      submenuIsActive = activeSubmenu === Submenu.TAGGED_BY;
                      break;
                    case HEDFilter.ENDORSED_BY:
                      // Unique list of endorsers
                      itemList = filteredHEDEvents.reduce<SubmenuItem[]>(
                        (endorsements, hedEvent) => {
                          const hedEndorsements = hedEvent.event.hed
                            .map((tag) => tag.Endorsements).flat()
                            .filter((endorsement) => endorsement.EndorsementStatus === 'Endorsed');
                          hedEndorsements.forEach((endorsement) => {
                            if (!endorsements.map(
                              (endorsement) => endorsement.id
                            ).includes(endorsement.EndorsedByID)) {
                              endorsements.push({
                                id: endorsement.EndorsedByID,
                                value: endorsement.EndorsedBy,
                              });
                            }
                          });
                          return endorsements;
                        }, [])
                        .sort((a, b) => {
                          return (a.value ?? '').localeCompare(b.value ?? '');
                        });
                      submenuIsActive = activeSubmenu === Submenu.ENDORSED_BY;
                      break;
                    case HEDFilter.CAVEAT_BY: // TODO: Consider merging with above
                      // Unique list of caveat authors
                      itemList = filteredHEDEvents.reduce<SubmenuItem[]>(
                        (endorsements, hedEvent) => {
                          const hedEndorsements = hedEvent.event.hed
                            .map((tag) => tag.Endorsements).flat()
                            .filter((endorsement) => endorsement.EndorsementStatus === 'Caveat');

                          hedEndorsements.forEach((endorsement) => {
                            if (!endorsements.map(
                              (endorsement) => endorsement.id
                            ).includes(endorsement.EndorsedByID)) {
                              endorsements.push({
                                id: endorsement.EndorsedByID,
                                value: endorsement.EndorsedBy,
                              });
                            }
                          });
                          return endorsements;
                        }, [])
                        .sort((a, b) => {
                          return (a.value ?? '').localeCompare(b.value ?? '');
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
                          style={{float: 'right'}}
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
                                  activeFilter === filterName;
                                return (
                                  <li
                                    key={`tagger_${item.id}_${i}`}
                                    className={activeItem ? 'active' : undefined}
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      setFilter(filterName);
                                      setActiveSubmenuItem(item);
                                      // Close parent menu
                                      filterMenuRef.current?.classList
                                        .remove('open');
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
                      className={
                        filterName === activeFilter ? 'active' : undefined
                      }
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
                  );
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
                hoveredItem={hoveredItem}
                tooltipText={
                  <>
                    {t(
                      'Scroll to Selected', {
                        ns: 'electrophysiology_browser',
                      }
                    )}&nbsp;
                    <span style={{fontWeight: 'bold'}}>
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
                hoveredItem={hoveredItem}
                tooltipText={
                  <>
                    {t(
                      'Jump to Selected', {
                        ns: 'electrophysiology_browser',
                      }
                    )}&nbsp;
                    <span style={{fontWeight: 'bold'}}>
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
                onClick={() => jumpToEvent(getActiveEvent())}
                style={{marginLeft: '-1px'}}
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
                const previousIndex = jsModulo(activeItemIndex - 1, totalHEDTags);
                setActiveItemIndex(previousIndex);
                jumpToEvent(getItemEvent(getItemAtIndex(previousIndex)));
              }}
              onMouseEnter={() => setHoveredItem('jumpSelectPrevious')}
              onMouseLeave={() => setHoveredItem('')}
            >
              <i
                className={'glyphicon glyphicon-step-forward'}
                style={{transform: 'rotate(-90deg)', top: '2px'}}
              />
            </button>
            <Tooltip
              key={`tooltip-selectPrevious`}
              itemRef={'selectPrevious'}
              hoveredItem={hoveredItem}
              tooltipText={
                <>
                  {t(
                    'Select Previous', {
                      ns: 'electrophysiology_browser',
                    }
                  )}&nbsp;
                  <span style={{fontWeight: 'bold'}}>
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
              hoveredItem={hoveredItem}
              tooltipText={
                <>
                  {t(
                    'Select Next', {
                      ns: 'electrophysiology_browser',
                    }
                  )}&nbsp;
                  <span style={{fontWeight: 'bold'}}>
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
              style={{marginLeft: '-1px'}}
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
              hoveredItem={hoveredItem}
              tooltipText={
                <>
                  {t(
                    'Select and Jump to Previous', {
                      ns: 'electrophysiology_browser',
                    }
                  )}&nbsp;
                  <span style={{fontWeight: 'bold'}}>
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
              hoveredItem={hoveredItem}
              tooltipText={
                <>
                  {t(
                    'Select and Jump to Next', {
                      ns: 'electrophysiology_browser',
                    }
                  )}&nbsp;
                  <span style={{fontWeight: 'bold'}}>
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
                const nextIndex = jsModulo(activeItemIndex + 1, totalHEDTags);
                setActiveItemIndex(nextIndex);
                jumpToEvent(getItemEvent(getItemAtIndex(nextIndex)));
              }}
              style={{marginLeft: '-1px'}}
              onMouseEnter={() => setHoveredItem('jumpSelectNext')}
              onMouseLeave={() => setHoveredItem('')}

            >
              <i
                className={'glyphicon glyphicon-step-forward'}
                style={{transform: 'rotate(90deg)', top: '2px'}}
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
          {filteredHEDEvents.length === 0 &&
            <div className='event-panel-message'>
              {t(
                'There are no event-level HED tags to endorse.', {
                  ns: 'electrophysiology_browser',
                }
              )}
            </div>
          }
          {
            filteredHEDEvents.map((hedEvent) => {
              return hedEvent.tagGroups.map((tagGroup) => {
                return {
                  event: hedEvent.event,
                  eventIndex: hedEvent.eventIndex,
                  tagGroup: tagGroup,
                };
              }).flat();
            }).flat().map((eventEntry, i) => {
              const event = eventEntry.event;
              const commentPanel = openCommentPanels.find(
                (panel) => panel.ID === eventEntry.tagGroup[0].ID
              );
              return (
                <div
                  key={eventEntry.tagGroup[0].ID}
                  className={
                    'annotation list-group-item list-group-item-action hed-endorsement-list'
                    + (activeItemIndex === i ? '-selected' : '')
                  }
                  style={{
                    position: 'relative',
                  }}
                  onMouseEnter={() => updateActiveEvent(eventEntry.eventIndex)}
                  onMouseLeave={() => {
                    const eventIndex = getEventIndex(getActiveEvent());
                    if (eventIndex && eventIndex !== activeEvent) {
                      updateActiveEvent(eventIndex);
                    } else {
                      updateActiveEvent(null);
                    }
                  }}
                >
                  <div
                    className="event-details"
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
                      <div key={`event-label-${event.physiologicalTaskEventID}`}>
                        [#{i + 1}] {event.label}
                      </div>
                      <button
                        type="button"
                        className={'btn btn-xs btn-primary'}
                        onClick={() => {
                          setActiveItemIndex(i);
                          jumpToEvent(event);
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
                        {Math.round(event.onset * 1000) / 1000}
                        {event.duration > 0
                          && ' - '
                          + (Math.round((event.onset + event.duration) * 1000) / 1000)
                        }
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <span style={{fontWeight: 'bold'}}>
                        {buildHEDString(eventEntry.tagGroup, showLongFormHED)}
                      </span>
                      {
                        <>
                          <Tooltip
                            key={`tooltip-jumpToSelected-${i}`}
                            itemRef={`jumpToSelected-${i}`}
                            hoveredItem={hoveredItem}
                            tooltipText={
                              <>
                                {t(
                                  'Jump to (Selected) Event', {
                                    ns: 'electrophysiology_browser',
                                  }
                                )}&nbsp;
                                <span style={{fontWeight: 'bold'}}>
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
                            hoveredItem={hoveredItem}
                            tooltipText={
                              <>
                                {t(
                                  'Edit (Selected) Event', {
                                    ns: 'electrophysiology_browser',
                                  }
                                )}&nbsp;
                                <span style={{fontWeight: 'bold'}}>
                                  (&#8679; +) K
                                </span>
                              </>
                            }
                            tooltipTop={'unset'}
                            tooltipRight={'10px'}
                            tooltipBottom={'inherit'}
                            tooltipLeft={'unset'}
                            extraStyles={{marginTop: '47px'}}
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
                        style={{maxHeight: '22px'}}
                        onClick={() => handleEditClick(event)}
                        onMouseEnter={() => setHoveredItem(`editSelected-${i}`)}
                        onMouseLeave={() => setHoveredItem('')}
                      >
                        <i
                          className='glyphicon glyphicon-edit'
                        />
                        &nbsp;{t(
                          'Edit', {
                            ns: 'electrophysiology_browser',
                          }
                        )}
                      </button>
                    </div>
                    <Panel
                      initCollapsed={true}
                      id={`tagged-by-panel-${eventEntry.tagGroup[0].ID}`}
                      key={eventEntry.tagGroup[0].ID}
                      class={'panel-primary tagged-by-panel' + (
                        eventEntry.eventIndex === activeEvent
                          ? ' tagged-by-active'
                          : ''
                      )}
                      title={
                        <>
                          {t(
                            'Tagged By', {
                              ns: 'electrophysiology_browser',
                            }
                          )}:&nbsp;
                          {
                            eventEntry.tagGroup
                              .map((tag) => tag.TaggerName)
                              .filter((tagger, index, taggers) => {
                                return taggers.indexOf(tagger) === index; // unique list
                              })
                              .join(', ')
                          }
                          &emsp;
                          {
                            eventEntry.tagGroup.find(
                              (tag) => tag.Endorsements.some(
                                (endorsement) => endorsement.EndorsementComment
                              )
                            ) && (
                              <i
                                className='glyphicon glyphicon-comment glyphicon-endorsement-panel'
                                style={{color: '#256eb6'}}
                              />
                            )
                          }
                          {
                            eventEntry.tagGroup.find(
                              (tag) => tag.Endorsements.some(
                                (endorsement) => endorsement.EndorsementStatus === 'Endorsed'
                              )
                            ) && (
                              <i
                                className='glyphicon glyphicon-flag glyphicon-endorsement-panel'
                                style={{color: 'green'}}
                              />
                            )
                          }
                          {
                            eventEntry.tagGroup.find(
                              (tag) => tag.Endorsements.some(
                                (endorsement) => endorsement.EndorsementStatus === 'Caveat'
                              )
                            ) && (
                              <i
                                className='glyphicon glyphicon-flag glyphicon-endorsement-panel'
                                style={{color: 'red'}}
                              />
                            )
                          }
                        </>
                      }
                      style={{width: '90%'}}
                    >
                      <div>
                        {
                          eventEntry.tagGroup.some((tag) => {
                            return tag.Endorsements.length > 0;
                          }) ? (
                              <ul style={{
                                margin: 0,
                                marginLeft: '-10px',
                              }}>
                                {
                                  eventEntry.tagGroup
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
                                                  <span style={{fontStyle: 'italic'}}>
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
                                ns: 'electrophysiology_browser',
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
                                hoveredItem={hoveredItem}
                                tooltipText={
                                  <>
                                    {t(
                                      'For selected tag:', {
                                        ns: 'electrophysiology_browser',
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
                                            ns: 'electrophysiology_browser',
                                          }
                                        )}
                                        <br/>
                                        {t(
                                          'Caveat', {
                                            ns: 'electrophysiology_browser',
                                          }
                                        )}
                                        <br/>
                                        {t(
                                          'Comment', {
                                            ns: 'electrophysiology_browser',
                                          }
                                        )}
                                        <br/>
                                        {t('Submit', {ns: 'loris'})}
                                      </div>
                                      <div>
                                        <span style={{fontWeight: 'bold'}}>
                                        (^ +) E
                                        </span>
                                        <br/>
                                        <span style={{fontWeight: 'bold'}}>
                                        (^ +) C
                                        </span>
                                        <br/>
                                        <span style={{fontWeight: 'bold'}}>
                                        (^ +) M
                                        </span>
                                        <br/>
                                        <span style={{fontWeight: 'bold'}}>
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
                                justifyContent: 'space-between',
                              }}
                              onMouseEnter={() => setHoveredItem(`endorseActions-${i}`)}
                              onMouseLeave={() => setHoveredItem('')}
                            >
                              <div>
                                {
                                  commentPanel
                                    ? (
                                      <>
                                        {
                                          TagAction[
                                            commentPanel.tagAction
                                          ].icon && (
                                            <>
                                              <i
                                                className={'glyphicon glyphicon-' +
                                                TagAction[commentPanel.tagAction
                                                ].icon}
                                                style={{color: TagAction[
                                                  commentPanel.tagAction
                                                ].color,
                                                }}
                                              />
                                            &nbsp;
                                            </>
                                          )
                                        }
                                        {
                                          t(TagAction[
                                            commentPanel.tagAction
                                          ].text, {
                                            ns: 'electrophysiology_browser',
                                          })
                                        }
                                      </>
                                    )
                                    : (
                                      <>
                                        {t(
                                          TagAction['Select'].text, {
                                            ns: 'electrophysiology_browser',
                                          }
                                        )}
                                      </>
                                    )
                                }
                              </div>
                              <span className="glyphicon glyphicon-menu-down"></span>
                            </button>
                            <ul className='dropdown-menu'
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
                                        const panelFound = commentPanel;

                                        setOpenCommentPanels([
                                          ...openCommentPanels.filter(
                                            (panel) => panel.ID
                                              !== eventEntry.tagGroup[0].ID
                                          ),
                                          {
                                            ID: eventEntry.tagGroup[0].ID,
                                            text: panelFound
                                              ? panelFound.text
                                              : '',
                                            tagAction: tagAction,
                                            activePanel: tagAction,
                                            isOpen: tagAction !== 'Select',
                                          },
                                        ]);
                                        setTimeout(() => {
                                          focusCommentWithID(eventEntry.tagGroup[0].ID);
                                        }, 0);
                                      }}>
                                      {
                                        TagAction[tagAction].icon && (
                                          <i
                                            className={
                                              'glyphicon glyphicon-'
                                              + TagAction[tagAction].icon
                                            }
                                            style={{color: TagAction[tagAction].color}}
                                          />
                                        )
                                      }
                                      &nbsp;{t(
                                        TagAction[tagAction].text, {
                                          ns: 'electrophysiology_browser',
                                        })}
                                    </li>
                                  );
                                })
                              }
                            </ul>
                          </div>
                          <div>
                            <div
                              id={`hed-endorsement-alert-${eventEntry.tagGroup[0].ID}`}
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
                      canEndorse && commentPanel &&
                      commentPanel
                        .isOpen && (
                        <div
                          style={{marginBottom: '5px'}}
                        >
                          {
                            commentPanel.activePanel === 'Comment' && (
                              <textarea
                                id={`hed-endorsement-comment-${eventEntry.tagGroup[0].ID}`}
                                value={commentPanel.text}
                                onChange={(e) => {
                                  setOpenCommentPanels([
                                    ...openCommentPanels.filter(
                                      (panel) => panel.ID
                                        !== eventEntry.tagGroup[0].ID
                                    ),
                                    {
                                      ...commentPanel,
                                      text: e.target.value,
                                    },
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
                                commentPanel
                                  .text.length === 0 &&
                                  commentPanel
                                    .activePanel === 'Comment'
                              }
                              onClick={() => {
                                const panel = commentPanel;
                                setSendingRequest(true);
                                handleEndorseSubmit(panel);
                                setOpenCommentPanels(
                                  openCommentPanels.filter(
                                    (panel) => panel.ID
                                      !== eventEntry.tagGroup[0].ID
                                  )
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
                              commentPanel
                                .activePanel === 'Comment' && (
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setOpenCommentPanels([
                                      ...openCommentPanels.filter(
                                        (panel) => panel.ID
                                          !== eventEntry.tagGroup[0].ID
                                      ),
                                      {
                                        ...commentPanel,
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
                                  openCommentPanels.filter(
                                    (panel) => panel.ID
                                      !== eventEntry.tagGroup[0].ID
                                  )
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
}

HEDEndorsement.defaultProps = {};

export default HEDEndorsement;
