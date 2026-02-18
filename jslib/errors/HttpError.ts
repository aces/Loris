import {BaseError} from './BaseError';

/**
 * Base class for HTTP-related errors.
 */
export class HttpError extends BaseError {
  /**
   * @param request The Request object that generated the error.
   * @param response The raw HTTP Response object (guaranteed to be 2xx, e.g., 204).
   * @param message The error message.
   */
  constructor(
    public readonly request: Request,
    public readonly response?: Response,
    message?: string
  ) {
    super(message);
    this.name = 'HttpError';
  }
}
