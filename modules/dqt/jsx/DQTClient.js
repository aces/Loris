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
   * Fetch JSON from an absolute or relative URL.
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
   * POST URL-encoded form data and parse JSON response.
   *
   * @param {string} url
   * @param {URLSearchParams} body
   * @return {Promise<any>}
   */
  postURLEncodedJSON(url, body) {
    return this.fetchJSON(new URL(url, window.location.origin), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: body,
    });
  }

  /**
   * POST URL-encoded form data and return text response.
   *
   * @param {string} url
   * @param {URLSearchParams} body
   * @return {Promise<string>}
   */
  async postURLEncodedText(url, body) {
    const response = await fetch(new URL(url, window.location.origin), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: body,
      credentials: 'same-origin',
    });
    if (!response.ok) {
      const error = new Error('request_failed');
      error.status = response.status;
      error.response = response;
      throw error;
    }
    return response.text();
  }
}

export default DQTClient;
