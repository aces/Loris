import lorisFetch from 'jslib/lorisFetch';

/**
 * Candidate parameters JSON client.
 */
class CandidateParametersClient {
  /**
   * @constructor
   */
  constructor() {
    this.baseURL = new URL(
      `${loris.BaseURL}/candidate_parameters/ajax/getData.php`,
      window.location.origin
    );
  }

  /**
   * Fetch candidate tab JSON data.
   *
   * @param {string} candID
   * @param {string} tabName
   * @return {Promise<any>}
   */
  getData(candID, tabName) {
    const url = new URL(this.baseURL);
    url.searchParams.set('candID', candID);
    url.searchParams.set('data', tabName);

    return lorisFetch(url.toString(), {
      method: 'GET',
      headers: {'Accept': 'application/json'},
    }).then((response) => {
      if (!response.ok) {
        throw new Error('request_failed');
      }
      return response.json();
    });
  }
}

export default CandidateParametersClient;
