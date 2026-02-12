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
   * Fetch JSON data from a module URL using Client#get.
   *
   * @param {string} url
   * @return {Promise<any>}
   */
  getJSON(url) {
    const parsedURL = new URL(url, window.location.origin);
    const prefix = '/candidate_parameters/';
    const subEndpoint = parsedURL.pathname.startsWith(prefix)
      ? parsedURL.pathname.slice(prefix.length)
      : parsedURL.pathname.replace(/^\/+/, '');
    const query = new Http.Query();
    parsedURL.searchParams.forEach((value, key) => {
      query.addParam({field: key, value: value});
    });
    return this.setSubEndpoint(subEndpoint).get(query);
  }
}

export default CandidateParametersClient;
