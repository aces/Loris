import {Query, QueryParam} from './Query';
import {Errors} from '../';
import lorisFetch from '../lorisFetch';

declare const loris: {BaseURL: string};

export interface ErrorContext {
  key: string | number; // The key that triggered the custom message (e.g., 'ApiNetworkError' or 404)
  request: Request,
  response?: Response,
}

/**
 * A basic client for making HTTP requests to a REST API endpoint.
 */
export class Client<T> {
  protected baseURL: URL;
  protected subEndpoint?: string;
  /**
   * Function to retrieve a custom error message for a given error context.
   */
  public getErrorMessage: (
    key: string | number,
    request: Request,
    response?: Response
  ) => string | undefined = () => undefined;

  /**
   * Creates a new API client instance.
   *
   * @param baseURL The API path, relative to LORIS's base URL.
   */
  constructor(baseURL: string) {
    this.baseURL = new URL(`${loris.BaseURL}/${baseURL}/`);
  }

  /**
   * Sets an optional sub-endpoint path.
   *
   * @param subEndpoint An optional endpoint segment to append to the baseURL.
   */
  setSubEndpoint(subEndpoint: string): this {
    this.subEndpoint = subEndpoint;
    return this;
  }


  /**
   * Fetches a collection of resources.
   *
   * @param query A Query object to build the URL query string.
   */
  async get<U = T>(query?: Query): Promise<U[]> {
    return this.fetchJSON<U[]>(this.buildURL('', query), {
      method: 'GET',
      headers: {'Accept': 'application/json'},
    });
  }

  /**
   * Fetches a list of unique labels for the resource type based on query parameters.
   *
   * @param {...QueryParam} params One or more QueryParam objects to filter the labels.
   */
  async getLabels(...params: QueryParam[]): Promise<string[]> {
    const query = new Query();
    params.forEach((param) => query.addParam(param));
    return this.get<string>(query.addField('label'));
  }

  /**
   * Fetches a single resource by its ID.
   *
   * @param id The unique identifier of the resource to fetch.
   */
  async getById(id: string): Promise<T> {
    return this.fetchJSON<T>(this.buildURL(id), {
      method: 'GET',
      headers: {'Accept': 'application/json'},
    });
  }

  /**
   * Creates a new resource on the server.
   *
   * @param data The request body to send.
   */
  async create<Res = T, Req = T>(data: Req): Promise<Res> {
    return this.fetchJSON<Res>(this.buildURL(), {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    });
  }

  /**
   * Updates an existing resource on the server.
   *
   * @param id The unique identifier of the resource to update.
   * @param data The new resource data.
   */
  async update(id: string, data: T): Promise<T> {
    return this.fetchJSON<T>(this.buildURL(id), {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    });
  }

  /**
   * Handles the actual fetching and JSON parsing, including error handling.
   *
   * @param url     The URL to which the request will be made.
   * @param options The Fetch API request initialization options.
   */
  protected async fetchJSON<U>(
    url: URL,
    options: RequestInit
  ): Promise<U> {
    const request = new Request(url, options);

    try {
      const response = await lorisFetch(request);

      // 1. Handle HTTP status errors (e.g., 404, 500), using the server's
      // own message when the body carries one
      if (!response.ok) {
        throw new Errors.ApiResponse(
          request,
          response,
          this.getErrorMessage('ApiResponseError', request, response)
            ?? await this.readErrorMessage(response)
        );
      }

      // 2. Handle a success with no body (e.g., 204, or an empty 201)
      const body = await response.text();
      if (body === '') {
        return undefined as U;
      }

      // 3. Parse JSON
      try {
        return JSON.parse(body) as U;
      } catch (e) {
        const message = this.getErrorMessage('JsonParseError', request);
        throw new Errors.JsonParse(request, message);
      }
    } catch (error) {
      // 4. Re-throw custom errors; wrap native network errors
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

  /**
   * Constructs a full URL by combining the base URL, sub-endpoint,
   * and an optional path or resource ID, then appends query parameters.
   *
   * @param path  - An optional sub-path or resource ID (e.g., '123' or 'details').
   * Defaults to an empty string.
   * @param query - An optional Query object used to build the URL's search parameters.
   * @returns A fully constructed URL object.
   */
  private buildURL(path = '', query?: Query): URL {
    // 1. Resolve segments (this.baseURL + subEndpoint + id/path)
    const segments = [this.subEndpoint, path].filter(Boolean).join('/');
    const url = new URL(segments, this.baseURL);

    // 2. Append the pre-built query string
    if (query) {
      url.search = query.build();
    }

    return url;
  }
}
