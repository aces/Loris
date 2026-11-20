import {FullDictionary} from './types';

/**
 * Parses string to remove HTML tags and return raw text
 *
 * @param {string} html - input string
 * @returns {string} - parsed string
 */
function stripHTML(html: string): string {
  if (!html) return '';

  if (!/<[^>]+>/.test(html)) {
    return html;
  }

  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || html.replace(/<\/?[a-zA-Z][^>]*>?/gm, '');
}

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

  const desc = dict[module][category][fieldname].description;
  return stripHTML(desc);
}

export default getDictionaryDescription;
