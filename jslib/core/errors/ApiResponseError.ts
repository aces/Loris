import {HttpError} from './HttpError';

/**
 * Error thrown for non-2xx HTTP responses from the API.
 * It includes the raw Response object for additional context.
 */
export class ApiResponseError extends HttpError {
  public readonly response: Response;

  /**
   *
   * @param response The raw HTTP Response object.
   * @param request  The Request object that generated the error.
   * @param message  The error message.
   */
  constructor(response: Response, request: Request, message?: string) {
    super(
      message ||
      `Request to ${request.url} failed with status code ${response.status}.`
    );
    this.name = 'ApiResponseError';
    this.response = response;
  }
}
