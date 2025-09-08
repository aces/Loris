import { BaseError } from './BaseError';

/**
 * Error thrown when a JSON response cannot be parsed.
 */
export class JsonParseError extends BaseError {
  constructor(message?: string) {
    super(message || 'The server returned an invalid JSON response.');
    this.name = 'JsonParseError';
  }
}
