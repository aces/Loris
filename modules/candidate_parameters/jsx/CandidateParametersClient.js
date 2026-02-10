import {Http} from 'jslib';

/**
 * Candidate parameters JSON client.
 */
class CandidateParametersClient extends Http.Client {
  /**
   * @constructor
   */
  constructor() {
    // Base path is required by the shared Client, but this module uses full URLs.
    super('/candidate_parameters');
  }

  /**
   * Fetch JSON data from a module URL.
   *
   * @param {string} url
   * @return {Promise<any>}
   */
  getJSON(url) {
    return this.fetchJSON(new URL(url, window.location.origin), {
      method: 'GET',
      headers: {'Accept': 'application/json'},
    });
  }

  /**
   * Submit form data and parse JSON response.
   *
   * @param {string} url
   * @param {FormData} formData
   * @return {Promise<any>}
   */
  postForm(url, formData) {
    return this.fetchJSON(new URL(url, window.location.origin), {
      method: 'POST',
      body: formData,
    });
  }
}

export default CandidateParametersClient;
