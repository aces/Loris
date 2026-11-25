/**
 * fetchBlob
 *
 * @param url - The url to fetch
 * @param params - The request params
 * @returns - The blob data
 */
export const fetchBlob = (url: string, params?: RequestInit) : Promise<Blob> =>
  fetch(url, params).then((response) => {
    if (!response.ok) {
      return Promise.resolve(null) as Promise<Blob>;
    }
    return response.blob().then((data) => data);
  });

/**
 * fetchJSON
 *
 * @param url - The url to fetch
 * @param params - The request params
 * @returns - The json data
 */
export const fetchJSON = (url: string, params?: RequestInit) =>
  fetch(url, params).then((response) => {
    if (!response.ok) {
      return Promise.resolve(null) as Promise<any>;
    }
    return response.json().then((data) => data);
  });

/**
 * fetchText
 *
 * @param url - The url to fetch
 * @param params - The request params
 * @returns - The text data
 */
export const fetchText = (url: string, params?: RequestInit) =>
  fetch(url, params).then((response) => {
    if (!response.ok) {
      return Promise.resolve(null) as Promise<string>;
    }
    return response.text().then((data) => data);
  });
