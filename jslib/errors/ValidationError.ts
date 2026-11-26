import {BaseError} from './BaseError';

/**
 * Error thrown when data validation fails.
 */
export class ValidationError extends BaseError {
  /**
   *
   * @param message The error message.
   */
  constructor(message?: string) {
    super(message);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
