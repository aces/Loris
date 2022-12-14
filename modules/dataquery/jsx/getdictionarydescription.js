/**
 * Get the dictionary for a given term
 *
 * @param {string} module - the module
 * @param {string} category - the category
 * @param {fieldname} fieldname - the field
 * @param {object} dict - all loaded dictionaries
 *
 * @return {object}
 */
function getDictionaryDescription(module, category, fieldname, dict) {
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
