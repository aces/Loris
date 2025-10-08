import {BaseError} from './BaseError';

/**
 * Error thrown when a JSON response from the server cannot be parsed.
 */
export class JsonParseError extends BaseError {
  /**
   *
   * @param message The error message.
   */
  constructor(message?: string) {
    super(message || 'The server returned an invalid JSON response.');
    this.name = 'JsonParseError';
  }
}
