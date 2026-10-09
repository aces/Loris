import {Errors} from 'jslib';
import {Client} from 'jslib/http';

type SaveResponse = {
  error?: string,
  ok?: string,
};

/**
 * HTTP client for the cohort and project forms.
 */
export default class StudyEntitiesClient<T> extends Client<T> {
  /**
   * Submit form values to the existing guarded endpoint.
   *
   * @param url Save endpoint
   * @param body Form values
   * @return Parsed save response
   */
  async save(url: string, body: URLSearchParams): Promise<SaveResponse> {
    try {
      return await this.fetchJSON<SaveResponse>(
        new URL(url, window.location.origin),
        {
          body,
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
          method: 'POST',
        }
      );
    } catch (error) {
      if (error instanceof Errors.ApiResponse
        && error.response?.headers.get('Content-Type')
          ?.includes('application/json')
      ) {
        const responseData = await error.response.json() as SaveResponse;
        if (responseData.error) {
          error.message = responseData.error;
        }
      }
      throw error;
    }
  }
}
