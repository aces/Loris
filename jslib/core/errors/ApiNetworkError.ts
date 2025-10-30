import {HttpError} from './HttpError';

/**
 * Error thrown for network-level issues (e.g., no internet connection, DNS failure).
 */
export class ApiNetworkError extends HttpError {
  /**
   * @param request The Request object that generated the error.
   * @param message The error message.
   */
  constructor(request: Request, message?: string) {
    super(
      request,
      undefined,
      message || 'Network error occurred during API call.'
    );
    this.name = 'APINetworkError';
  }
}
