import {client, Query} from 'jslib/http';

const ajaxHelper = 'AjaxHelper.php';

/**
 * Get DQT setup payload.
 *
 * @return {Promise<any>}
 */
export function getSetup() {
  const query = new Query().addParam({field: 'format', value: 'json'});
  return client.get('dqt/dqt_setup/', query);
}

/**
 * Get DQT sessions payload.
 *
 * @return {Promise<any>}
 */
export function getSessions() {
  const query = new Query().addParam({field: 'format', value: 'json'});
  return client.get('dqt/sessions/', query);
}

/**
 * Get a saved query document by id.
 *
 * @param {string} docID
 * @return {Promise<any>}
 */
export function getDoc(docID) {
  const query = new Query()
    .addParam({field: 'Module', value: 'dqt'})
    .addParam({field: 'script', value: 'GetDoc.php'})
    .addParam({field: 'DocID', value: docID});
  return client.get(ajaxHelper, query);
}

/**
 * Get data dictionary for an instrument category.
 *
 * @param {string} category
 * @return {Promise<any>}
 */
export function getDataDictionaryByCategory(category) {
  const query = new Query()
    .addParam({field: 'Module', value: 'dqt'})
    .addParam({field: 'script', value: 'datadictionary.php'})
    .addParam({field: 'category', value: category});
  return client.get(ajaxHelper, query);
}

/**
 * Get query matches for a condition operator script.
 *
 * @param {string} script
 * @param {string} category
 * @param {string} field
 * @param {string} value
 * @return {Promise<any>}
 */
export function getMatches(script, category, field, value) {
  const query = new Query()
    .addParam({field: 'Module', value: 'dqt'})
    .addParam({field: 'script', value: script})
    .addParam({field: 'category', value: category})
    .addParam({field: 'field', value: field})
    .addParam({field: 'value', value: value});
  return client.get(ajaxHelper, query);
}

/**
 * Get datadictionary entries by key list.
 *
 * @param {string[]} keys
 * @return {Promise<any>}
 */
export function getDataDictionaryByKeys(keys) {
  const query = new Query()
    .addParam({field: 'keys', value: JSON.stringify(keys)});
  return client.get('dqt/ajax/datadictionary.php', query);
}
