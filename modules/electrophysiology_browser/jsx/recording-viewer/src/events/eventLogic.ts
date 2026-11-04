import {RecordingEvent, HEDSchemaElement, HEDTag} from '../domain/types';

/**
 * getEventsInRange
 *
 * @param {RecordingEvent[]} events - Array of events
 * @param {[number, number]} timeRange - Time range to search
 * @returns {number[]} Indices of events in the range
 */
export const getEventsInRange = (
  events: RecordingEvent[], timeRange: [number, number]
) => {
  return [...Array(events.length).keys()].filter((index) =>
    (
      (isNaN(events[index].onset) && timeRange[0] === 0)
      ||
      (
        events[index].onset + events[index].duration > timeRange[0] &&
        events[index].onset < timeRange[1]
      )
    )
  );
};

/**
 * getTagsForEvent
 *
 * @param {RecordingEvent} event - An event
 * @param {any[]} datasetTags - HED tags in the dataset
 * @param {HEDSchemaElement[]} hedSchema - HED schema to search
 * @returns {HEDTag[]} Dataset HED tags associated with the event
 */
export const getTagsForEvent = (
  event: RecordingEvent,
  datasetTags: Record<string, Record<string, HEDTag[]>>,
  hedSchema: HEDSchemaElement[]
) => {
  const hedTags: HEDTag[] = [];

  // if (datasetTags['EventValue'].hasOwnProperty(event.label)) {
  //   hedTags.push(...datasetTags['EventValue'][event.label])
  // }

  if (datasetTags['trial_type'].hasOwnProperty(event.trialType)) {
    hedTags.push(...datasetTags['trial_type'][event.trialType]);
  }

  event.properties.forEach((prop) => {
    if (datasetTags[prop.PropertyName].hasOwnProperty(prop.PropertyValue)) {
      hedTags.push(...datasetTags[prop.PropertyName][prop.PropertyValue]);
    }
  });

  return hedTags.map((tag) => {
    const schemaTag = hedSchema.find((t) => {
      return t.id === tag.HEDTagID;
    });
    return {
      schemaElement: schemaTag ?? null,
      HEDTagID: schemaTag ? schemaTag.id : null,
      ID: tag.ID,
      TagValue: tag.TagValue,
      Description: tag.Description,
      HasPairing: tag.HasPairing,
      PairRelID: tag.PairRelID,
      PropertyName: tag.PropertyName,
      PropertyValue: tag.PropertyValue,
      AdditionalMembers: tag.AdditionalMembers,
      TaggedBy: tag.TaggedBy,
      TaggerName: tag.TaggerName,
      Endorsements: [],
    };
  }).filter((tag) => {
    return tag.HEDTagID !== null || tag.PairRelID !== null;
  });
};

/**
 * getNthMemberTrailingCommaIndex
 *
 * @param {string} tagString - HED string
 * @param {number} n - Nth member to encapsulate. Members, (can), (be, groups)
 * @returns {number} - Returns index of comma expected after nth member
 */
const getNthMemberTrailingCommaIndex = (tagString: string, n: number) => {
  if (n < 1) {
    return tagString.length;
  }

  let membersToFind = n;
  let openParenthesesCount = 0;
  let commaIndex = 0;
  for (let i = 0; i < tagString.length; i++) {
    if (tagString[i] === '(') {
      openParenthesesCount++;
    } else if (tagString[i] === ')') {
      openParenthesesCount--;
    }
    if (openParenthesesCount === 0 && tagString[i] === ',') {
      if (--membersToFind === 0) {
        break;
      }
    }
    commaIndex = i;
  }
  return commaIndex + 1;
};

/**
 * getSchemaElementName
 *
 * Tags that are not backed by a HED schema element, such as the tags used to
 * group other tags together, have no name and yield an empty string.
 *
 * @param {HEDTag} tag - A HED tag
 * @param {boolean} longFormHED - Uses the long form of the name if true
 * @returns {string} - The name of the schema element of the tag
 */
export const getSchemaElementName = (
  tag: HEDTag, longFormHED: boolean
): string =>
  longFormHED
    ? tag.schemaElement?.longName ?? ''
    : tag.schemaElement?.name ?? '';

/**
 * buildHEDString
 *
 * @param {HEDTag[]} hedTags - List of HED tags
 * @param {boolean} longFormHED - Shows long form of HED tag if true
 * @returns {string[]} - String array representing the assembled HED tags
 */
export const buildHEDString = (hedTags: HEDTag[], longFormHED = false) => {
  const rootTags = hedTags.filter((tag) => {
    return !hedTags.some((t) => {
      return tag.ID === t.PairRelID;
    });
  });

  const tagNames: string[] = [];
  let tagString = '';
  rootTags.forEach((tag: HEDTag) => {
    const tagGroup: HEDTag[] = [];
    let groupMember: HEDTag | undefined = tag;
    while (groupMember) {
      const currentMember: HEDTag = groupMember;
      tagGroup.push(currentMember);
      groupMember = hedTags.find((hedTag: HEDTag) => {
        return hedTag.ID === currentMember.PairRelID;
      });
    }

    let subGroupString = '';
    tagGroup.reverse().forEach((groupTag: HEDTag) => {
      const tagName = getSchemaElementName(groupTag, longFormHED);
      if (groupTag.PairRelID === null) {
        tagString = tagName;
      } else {
        if (groupTag.HasPairing == '1') {
          if (groupTag.AdditionalMembers > 0 || subGroupString.length === 0) {
            const commaIndex = getNthMemberTrailingCommaIndex(
              tagString,
              groupTag.AdditionalMembers + (
                subGroupString.length > 0 ? 0 : 1
              )
            );
            tagString = '(' +
              (
                groupTag.HEDTagID !== null
                  ? `${tagName}, `
                  : ''
              ) +
              (subGroupString.length > 0 ? `${subGroupString}, ` : '') +
              tagString.substring(0, commaIndex) + ')' +
              tagString.substring(commaIndex);

            subGroupString = '';
          } else {
            if (groupTag.HEDTagID === null) {
              if (subGroupString.length > 0) {
                subGroupString = `(${subGroupString})`;
              } else {
                console.error('"UNEXPECTED" STATE');
              }
            } else {
              if (subGroupString.length > 0) {
                subGroupString = `(${tagName}, ${subGroupString})`;
              } else {
                tagString = `(${tagName}, ${tagString})`;
              }
            }
          }
        } else {
          if (subGroupString.length > 0) {
            tagString = `${subGroupString}, ${tagString}`;
          }
          subGroupString = tagName;
        }
      }
    });
    tagNames.push(tagString);
  });

  return tagNames;
};

/**
 * getNthMemberTrailingCommaIndex
 *
 * @param {any[]} tagBadgeGroup - HED badge list
 * @param {number} n - Nth member to encapsulate. Members, (can), (be, groups)
 * @returns {number} - Returns index of comma expected after nth member
 */
export const getNthMemberTrailingBadgeIndex = (
  tagBadgeGroup: any[], n: number
) => {
  if (n === 0) {
    return tagBadgeGroup.length;
  }

  let membersToFind = n;
  let openParenthesesCount = 0;
  let commaIndex = 0;

  for (let i = 0; i < tagBadgeGroup.length; i++) {
    if (tagBadgeGroup[i].type === 'span') {
      if (tagBadgeGroup[i].props.children === '(') {
        openParenthesesCount++;
      } else if (tagBadgeGroup[i].props.children === ')') {
        openParenthesesCount--;
        if (openParenthesesCount === 0) {
          membersToFind--;
        }
      }
    }
    if (tagBadgeGroup[i].type === 'div' && openParenthesesCount === 0) {
      membersToFind--;
    }

    commaIndex = i;
    if (membersToFind === 0) {
      break;
    }
  }
  return commaIndex + 1;
};

/**
 * getRootTags
 *
 * @param {HEDTag[]} tags - HEDTag list
 * @returns {HEDTag[]} - Returns the root tags
 */
export const getRootTags = (tags: HEDTag[]) => {
  return tags.filter((tag) => {
    return tag.ID &&
      !tags.some((t) => {
        return tag.ID === t.PairRelID;
      });
  });
};
