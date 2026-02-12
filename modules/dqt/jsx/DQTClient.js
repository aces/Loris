import {Http} from 'jslib';

/**
 * DQT JSON client.
 */
class DQTClient extends Http.Client {
  /**
   * @constructor
   */
  constructor() {
    super('/dqt');
  }

  /**
   * Get DQT setup payload.
   *
   * @return {Promise<any>}
   */
  getSetup() {
    const query = new Http.Query().addParam({field: 'format', value: 'json'});
    return this.setSubEndpoint('dqt_setup/').get(query);
  }

  /**
   * Get DQT sessions payload.
   *
   * @return {Promise<any>}
   */
  getSessions() {
    const query = new Http.Query().addParam({field: 'format', value: 'json'});
    return this.setSubEndpoint('sessions/').get(query);
  }

  /**
   * Get a saved query document by id.
   *
   * @param {string} docID
   * @return {Promise<any>}
   */
  getDoc(docID) {
    const query = new Http.Query()
      .addParam({field: 'Module', value: 'dqt'})
      .addParam({field: 'script', value: 'GetDoc.php'})
      .addParam({field: 'DocID', value: docID});
    return this.setSubEndpoint('../AjaxHelper.php').get(query);
  }

  /**
   * Get data dictionary for an instrument category.
   *
   * @param {string} category
   * @return {Promise<any>}
   */
  getDataDictionaryByCategory(category) {
    const query = new Http.Query()
      .addParam({field: 'Module', value: 'dqt'})
      .addParam({field: 'script', value: 'datadictionary.php'})
      .addParam({field: 'category', value: category});
    return this.setSubEndpoint('../AjaxHelper.php').get(query);
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
  getMatches(script, category, field, value) {
    const query = new Http.Query()
      .addParam({field: 'Module', value: 'dqt'})
      .addParam({field: 'script', value: script})
      .addParam({field: 'category', value: category})
      .addParam({field: 'field', value: field})
      .addParam({field: 'value', value: value});
    return this.setSubEndpoint('../AjaxHelper.php').get(query);
  }

  /**
   * Get datadictionary entries by key list.
   *
   * @param {string[]} keys
   * @return {Promise<any>}
   */
  getDataDictionaryByKeys(keys) {
    const query = new Http.Query()
      .addParam({field: 'keys', value: JSON.stringify(keys)});
    return this.setSubEndpoint('ajax/datadictionary.php').get(query);
  }
}

export default DQTClient;
