import { HttpError } from './HttpError';

/**
 * Error thrown for network-level issues (e.g., no internet connection, DNS failure).
 */
export class ApiNetworkError extends HttpError {
  constructor(message?: string) {
    super(message || 'Network error occurred during API call.');
    this.name = 'APINetworkError';
  }
}
