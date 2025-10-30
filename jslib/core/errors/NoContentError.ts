import {HttpError} from './HttpError';

/**
 * Error thrown when a request succeeds (i.e., status 2xx)
 * but the response body contains no content or is not the expected JSON format.
 * This typically corresponds to a 204 No Content status when content was expected.
 */
export class NoContentError extends HttpError {
  /**
   * @param request The Request object that was sent.
   * @param response The Response object from the fetch call.
   * @param message The error message.
   */
  constructor(request: Request, response: Response, message?: string) {
    super(
      request,
      response,
      message || 'Operation succeeded but server returned no content.'
    );
    this.name = 'NoContentError';
  }
}
