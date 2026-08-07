import {HttpError} from './HttpError';

/**
 * Error thrown when a JSON response from the server cannot be parsed.
 */
export class JsonParseError extends HttpError {
  /**
   * @param request The Request object that generated the error.
   * @param message The error message.
   */
  constructor(request: Request, message?: string) {
    super(
      request,
      undefined,
      message || 'The server returned an invalid JSON response.'
    );
    this.name = 'JsonParseError';
  }
}
