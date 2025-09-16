/**
 * Base class for all custom API-related errors.
 */
export class BaseError extends Error {
  public name: string;

  constructor(message?: string) {
    super(message);
    this.name = 'BaseError'; 
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
