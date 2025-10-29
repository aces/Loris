import {HttpError} from './HttpError';

/**
 * Error thrown for network-level issues (e.g., no internet connection, DNS failure).
 */
export class ApiNetworkError extends HttpError {
  /**
   *
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
