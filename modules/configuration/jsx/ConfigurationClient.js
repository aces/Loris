import {Client, Errors} from 'jslib';

/**
 * Configuration module HTTP client.
 */
class ConfigurationClient extends Client {
  /**
   * @constructor
   */
  constructor() {
    super('/configuration/ajax');
  }

  /**
   * Submit URL-encoded form data and return response text.
   *
   * @param {string} subEndpoint
   * @param {string|URLSearchParams} body
   * @return {Promise<string>}
   */
  async postForm(subEndpoint, body) {
    const url = new URL(subEndpoint, this.baseURL);
    const request = new Request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: body,
    });
    try {
      const response = await fetch(request);
      if (!response.ok) {
        throw new Errors.ApiResponse(request, response);
      }
      return response.text();
    } catch (error) {
      if (error instanceof Errors.Http) {
        throw error;
      }
      throw new Errors.ApiNetwork(request);
    }
  }
}

export default ConfigurationClient;
