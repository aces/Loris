import {FullDictionary} from './types';

/**
 * Get the dictionary for a given term
 *
 * @param module - the module
 * @param category - the category
 * @param fieldname - the field
 * @param dict - all loaded dictionaries
 * @returns - the description if available, otherwise the fieldname
 */
function getDictionaryDescription(
  module: string,
  category: string,
  fieldname: string,
  dict: FullDictionary,
): string {
  if (!dict
        || !dict[module]
        || !dict[module][category]
        || !dict[module][category][fieldname]
  ) {
    return fieldname;
  }

  return dict[module][category][fieldname].description;
}

export default getDictionaryDescription;
