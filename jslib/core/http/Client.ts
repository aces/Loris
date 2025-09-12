declare const loris: any;
import { Query, QueryParam } from './Query';
import { Errors } from '../';

export interface ErrorContext {
  key: string | number; // The key that triggered the custom message (e.g., 'ApiNetworkError' or 404)
  request: Request,
  response?: Response,
}

export class Client<T> {
  protected baseUrl: string;
  protected subEndpoint?: string;
  public getCustomMessage: (
    key: string | number,
    request: Request,
    response?: Response
  ) => string | undefined = () => undefined;

  constructor(baseUrl: string) {
    this.baseUrl = loris.BaseURL+'/'+baseUrl;
  }

  setSubEndpoint(subEndpoint: string): this {
    this.subEndpoint = subEndpoint;
    return this;
  }


  async get<U = T>(query?: Query): Promise<U[]> {
    const path = this.subEndpoint ? `${this.baseUrl}/${this.subEndpoint}` : this.baseUrl;
    const queryString = query ? query.build() : '';
    const url = queryString ? `${path}?${queryString}` : path;
    return this.fetchJSON<U[]>(url, {
      method: "GET",
      headers: {"Accept": "application/json"}
    });
  }

  async getLabels(...params: QueryParam[]): Promise<string[]> {
    const query = new Query();
    params.forEach(param => query.addParam(param));
    return this.get<string>(query.addField('label'));
  }

  async getById(id: string): Promise<T> {
    return this.fetchJSON<T>(`${this.baseUrl}/${id}`, {
      method: "GET",
      headers: {"Accept": "application/json"}
    });
  }

  async create<U = T>(data: T, mapper?: (data: T) => U): Promise<T> {
    const payload = mapper ? mapper(data) : data;
    return this.fetchJSON<T>(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  }

  async update(id: string, data: T): Promise<T> {
    return this.fetchJSON<T>(`${this.baseUrl}/${id}`, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data),
    });
  }

  protected async fetchJSON<U>(url: string, options: RequestInit): Promise<U> {
  const request = new Request(url, options);
    try {
      const response = await fetch(url, options);

      // 1. Handle HTTP status errors (e.g., 404, 500)
      if (!response.ok) {
        const customMessage = this.getCustomMessage(response.status, request, response);
        throw new Errors.ApiResponse(response, request, customMessage);
      }

      // Handle responses with no content
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        return null as U;
      }

      // 2. Handle JSON parsing errors
      try {
        const data = await response.json();
        return data as U;
      } catch (e) {
        const customMessage = this.getCustomMessage('JsonParseError', request);
        throw new Errors.JsonParse(customMessage);     
      }

    } catch (error) {
      // 3. Handle network errors (e.g., no internet)
      if (error instanceof Errors.Http) {
        throw error; // Re-throw our custom errors
      }
      const customMessage = this.getCustomMessage('ApiNetworkError', request);
      throw new Errors.ApiNetwork(customMessage);
    }
  }
}
