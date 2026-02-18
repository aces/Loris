import {HttpError} from './HttpError';

/**
 * Error thrown for non-2xx HTTP responses from the API.
 * It includes the raw Response object for additional context.
 */
export class ApiResponseError extends HttpError {
  /**
   *
   * @param request  The Request object that generated the error.
   * @param response The raw HTTP Response object.
   * @param message  The error message.
   */
  constructor(request: Request, response: Response, message?: string) {
    super(
      request,
      response,
      message ||
      `Request to ${request.url} failed with status code ${response.status}.`,
    );
    this.name = 'ApiResponseError';
  }
}
