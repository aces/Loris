// todo move to jslib
// after params have been adjusted
// for get or post requests.

/**
 * fetchData - retrieve data from the provided URL.
 *
 * @param {string} url for the request
 * @return {object} json retrieved from the server.
 */
const fetchData = async (url) => {
  let response;
  try {
    response = await fetch(url,
      {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (response.ok) {
      // Success
      return await response.json();
    }
  } catch (e) {
    let errorMessage;
    if (response.status) {
      // Error from the response.
      errorMessage = `An error occurred: ${response.status}`;
    } else {
      // All other possible errors.
      errorMessage = `An error occurred: ${e.message}`;
    }
    throw new Error(errorMessage);
  }
};
export {
  fetchData,
};
