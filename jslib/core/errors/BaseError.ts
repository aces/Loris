/**
 * Base class for all custom API-related errors.
 */
export class BaseError extends Error {
  /**
   *
   * @param message The error message.
   */
  constructor(message?: string) {
    super(message);
    this.name = 'BaseError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
