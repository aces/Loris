/**
 * fetchBlob
 *
 * @param {string} url - The url to fetch
 * @param {object} params - The request params
 * @returns {Promise} - The blob data
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
 * @param {string} url - The url to fetch
 * @param {object} params - The request params
 * @returns {Promise} - The json data
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
 * @param {string} url - The url to fetch
 * @param {object} params - The request params
 * @returns {Promise} - The text data
 */
export const fetchText = (url: string, params?: RequestInit) =>
  fetch(url, params).then((response) => {
    if (!response.ok) {
      return Promise.resolve(null) as Promise<string>;
    }
    return response.text().then((data) => data);
  });
