import {FullDictionary} from './types';

/**
 * Parses string to remove HTML tags and return raw text
 *
 * @param {string} html - input string
 * @returns {string} - parsed string
 */
function stripHTML(html: string): string {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || html.replace(/<\/?[a-zA-Z][^>]*>?/gm, '');
}

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

  const desc = dict[module][category][fieldname].description;
  return stripHTML(desc);
}

export default getDictionaryDescription;
