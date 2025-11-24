declare const loris: any;
import {Query, QueryParam} from './Query';
import {Errors} from '../';

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
   * @param baseURL The base URL for the API requests.
   */
  constructor(baseURL: string) {
    const origin = window.location.origin; // always https://...
    const full = `${origin}/${baseURL}/`;
    this.baseURL = new URL(full);
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
    // 1. Determine the path to resolve
    const relativePath = this.subEndpoint ? this.subEndpoint : '';

    // 2. Create the full URL object by resolving the path against this.baseURL.
    const url = new URL(relativePath, this.baseURL);

    // 3. Add Query Parameters using the URL object's searchParams
    if (query) {
      const params = new URLSearchParams(query.build());
      params.forEach((value, key) => {
        url.searchParams.append(key, value);
      });
    }

    // 4. Use the final URL object for the fetch request.
    return this.fetchJSON<U[]>(url, {
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
    // 1. Resolve the ID as a path segment against the this.baseURL object.
    const url = new URL(id, this.baseURL);

    // 2. Pass the final URL string to fetchJSON
    return this.fetchJSON<T>(url, {
      method: 'GET',
      headers: {'Accept': 'application/json'},
    });
  }

  /**
   * Creates a new resource on the server.
   *
   * @param data   The resource data to be created.
   * @param mapper An optional function to map the input data before sending.
   */
  async create<U = T>(data: T, mapper?: (data: T) => U): Promise<T> {
    const payload = mapper ? mapper(data) : data;
    return this.fetchJSON<T>(this.baseURL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload),
    });
  }

  /**
   * Updates an existing resource on the server.
   *
   * @param id The unique identifier of the resource to update.
   * @param data The new resource data.
   */
  async update(id: string, data: T): Promise<T> {
    // 1. Resolve the ID as a path segment against the this.baseURL object.
    const url = new URL(id, this.baseURL);

    // 2. Pass the final URL string to fetchJSON
    return this.fetchJSON<T>(url, {
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
      const response = await fetch(request);

      // 1. Handle HTTP status errors (e.g., 404, 500)
      if (!response.ok) {
        throw new Errors.ApiResponse(
          request,
          response,
          this.getErrorMessage('ApiResponseError', request, response)
        );
      }

      // Handle responses with no content or non-JSON content
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Errors.NoContent(
          request,
          response,
          this.getErrorMessage('NoContentError', request, response)
        );
      }

      // 2. Handle JSON parsing errors
      try {
        const data = await response.json();
        return data as U;
      } catch (e) {
        const message = this.getErrorMessage('JsonParseError', request);
        throw new Errors.JsonParse(request, message);
      }
    } catch (error) {
      // 3. Handle network errors (e.g., no internet)
      if (error instanceof Errors.Http) {
        throw error; // Re-throw our custom errors
      }
      const message = this.getErrorMessage('ApiNetworkError', request);
      throw new Errors.ApiNetwork(request, message);
    }
  }
}
