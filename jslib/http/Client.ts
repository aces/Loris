import {Query} from './Query';
import {Errors} from '../';
import lorisFetch from '../lorisFetch';

declare const loris: {BaseURL: string};

export interface ErrorContext {
  key: string | number; // The key that triggered the custom message (e.g., 'ApiNetworkError' or 404)
  request: Request,
  response?: Response,
}

/**
 * A client for making HTTP requests to LORIS. It handles what every LORIS
 * request shares (the base URL, the session, error messages) and knows
 * nothing about any one endpoint. Endpoints are functions that call it with
 * their own request and response types.
 */
export class Client {
  /**
   * Function to retrieve a custom error message for a given error context.
   */
  public getErrorMessage: (
    key: string | number,
    request: Request,
    response?: Response
  ) => string | undefined = () => undefined;

  /**
   * Fetches a resource.
   *
   * @param path  The resource's path, relative to LORIS's base URL.
   * @param query A Query object to build the URL query string.
   */
  async get<Res>(path: string, query?: Query): Promise<Res> {
    return this.request<Res>(path, {
      method: 'GET',
      headers: {'Accept': 'application/json'},
    }, query);
  }

  /**
   * Creates a resource on the server.
   *
   * @param path The path to post to, relative to LORIS's base URL.
   * @param data The request body to send.
   */
  async post<Res, Req>(path: string, data: Req): Promise<Res> {
    return this.request<Res>(path, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    });
  }

  /**
   * Updates a resource on the server.
   *
   * @param path The resource's path, relative to LORIS's base URL.
   * @param data The request body to send.
   */
  async put<Res, Req>(path: string, data: Req): Promise<Res> {
    return this.request<Res>(path, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    });
  }

  /**
   * Handles the actual fetching and JSON parsing, including error handling.
   *
   * @param path    The path to request, relative to LORIS's base URL.
   * @param options The Fetch API request initialization options.
   * @param query   A Query object to build the URL query string.
   */
  async request<Res>(
    path: string,
    options: RequestInit,
    query?: Query
  ): Promise<Res> {
    const url = new URL(path, `${loris.BaseURL}/`);
    if (query) {
      url.search = query.build();
    }
    const request = new Request(url, options);

    try {
      const response = await lorisFetch(request);

      // Handle HTTP status errors (e.g., 404, 500), using the server's
      // own message when the body carries one
      if (!response.ok) {
        throw new Errors.ApiResponse(
          request,
          response,
          this.getErrorMessage('ApiResponseError', request, response)
            ?? await this.readErrorMessage(response)
        );
      }

      // Handle a success with no body (e.g., 204, or an empty 201)
      const body = await response.text();
      if (body === '') {
        return undefined as Res;
      }

      // Parse JSON
      try {
        return JSON.parse(body) as Res;
      } catch (e) {
        const message = this.getErrorMessage('JsonParseError', request);
        throw new Errors.JsonParse(request, message);
      }
    } catch (error) {
      // Re-throw custom errors; wrap native network errors
      if (error instanceof Errors.Http || error instanceof Errors.ApiResponse) {
        throw error; // Re-throw our custom errors
      }
      const message = this.getErrorMessage('ApiNetworkError', request);
      throw new Errors.ApiNetwork(request, message);
    }
  }

  /**
   * Reads the `error` field from a JSON error response, leaving the
   * response's own body unread for the caller.
   *
   * @param response The non-OK HTTP Response.
   * @returns The server's error message, if it sent one.
   */
  private async readErrorMessage(
    response: Response
  ): Promise<string | undefined> {
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return undefined;
    }
    try {
      const data = await response.clone().json();
      return typeof data?.error === 'string' ? data.error : undefined;
    } catch (e) {
      return undefined;
    }
  }
}

/**
 * The client that endpoint functions share.
 */
export const client = new Client();
