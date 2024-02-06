import {FullDictionary} from './types';

/**
 * Get the dictionary for a given term
 *
 * @param {string} module - the module
 * @param {string} category - the category
 * @param {string} fieldname - the field
 * @param {FullDictionary} dict - all loaded dictionaries
 * @returns {string} - the description if available, otherwise the fieldname
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
