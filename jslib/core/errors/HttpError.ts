import {BaseError} from './BaseError';

/**
 * Base class for HTTP-related errors.
 */
export class HttpError extends BaseError {
  /**
   *
   * @param message The error message.
   */
  constructor(message: string) {
    super(message);
    this.name = 'HttpError';
  }
}
