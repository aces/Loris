export const fetchBlob = (...args) =>
  fetch(...args).then((response) =>
    response.blob().then((data) => data)
  );

export const fetchJSON = (...args) =>
  fetch(...args).then((response) => {
    if (!response.ok) {
      return new Promise(() => {});
    }
    return response.json().then((data) => data);
  });

export const fetchText = (...args) =>
  fetch(...args).then((response) =>
    response.text().then((data) => data)
  );
