import {Http} from 'jslib';

/**
 * Candidate parameters JSON client.
 */
class CandidateParametersClient extends Http.Client {
  /**
   * @constructor
   */
  constructor() {
    super('/candidate_parameters');
  }

  /**
   * Fetch candidate tab JSON data.
   *
   * @param {string} candID
   * @param {string} tabName
   * @return {Promise<any>}
   */
  getData(candID, tabName) {
    const query = new Http.Query()
      .addParam({field: 'candID', value: candID})
      .addParam({field: 'data', value: tabName});
    return this
      .setSubEndpoint('ajax/getData.php')
      .get(query);
  }
}

export default CandidateParametersClient;
