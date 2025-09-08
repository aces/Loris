import { HttpError } from './HttpError';

/**
 * Error thrown for non-2xx HTTP responses from the API.
 * It includes the raw Response object for additional context.
 */
export class ApiResponseError extends HttpError {
  public readonly response: Response;

  constructor(response: Response, request: Request, message?: string) {
    // The message can now be constructed dynamically
    super(message || `Request to ${request.url} failed with status code ${response.status}.`);
    this.name = 'ApiResponseError';
    this.response = response;
  }
}
