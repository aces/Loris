import { BaseError } from './BaseError';

export class ValidationError extends BaseError {
  constructor(message?: string) {
    super(message);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
