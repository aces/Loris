export const fetchBlob = (url: string, params?: {}) =>
  fetch(url, params).then((response) => {
    if (!response.ok) {
      return Promise.resolve(null) as Promise<Blob>;
    }
    return response.blob().then((data) => data);
  });

export const fetchJSON = (url: string, params?: {}) =>
  fetch(url, params).then((response) => {
    if (!response.ok) {
      return Promise.resolve(null) as Promise<any>;
    }
    return response.json().then((data) => data);
  });

export const fetchText = (url: string, params?: {}) =>
  fetch(url, params).then((response) => {
    if (!response.ok) {
      return Promise.resolve(null) as Promise<string>;
    }
    return response.text().then((data) => data);
  });
