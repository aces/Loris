import { BaseError } from './BaseError';

export class HttpError extends BaseError {
  constructor(message: string) {
    super(message);
    this.name = 'HttpError';
  }
}
