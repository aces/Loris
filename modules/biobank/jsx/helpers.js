import Swal from 'sweetalert2';

/**
 * Clone an object
 *
 * @param {object} object - the object to clone
 * @return {object}
 */
export function clone(object) {
  return JSON.parse(JSON.stringify(object));
}

/**
 * Maps an object values
 *
 * @param {object} object - the object to map
 * @param {any} attribute - the mapping
 * @return {object}
 */
export function mapFormOptions(object, attribute) {
  return Object.keys(object).reduce(
    (result, id) => {
      result[id] = object[id][attribute];
      return result;
    }, {}
  );
}

/**
 * Check if an object is either null or an empty object
 *
 * @param {object} object - the variable to check
 * @return {boolean}
 */
export function isEmpty(object) {
  if (object == null) {
    return true;
  }

  for (let prop in object) {
    if (object.hasOwnProperty(prop)) {
      return false;
    }
  }

  return JSON.stringify(object) === JSON.stringify({});
}

/**
 * Pad a barcode
 *
 * @param {string} pscid - a pscid
 * @param {string} increment - the amount of padding
 * @return {string}
 */
export function padBarcode(pscid, increment) {
  return pscid+padLeft(increment, 3);
}

/**
 * Left pad. Without a library.
 *
 * @param {number} nr - the existing string
 * @param {number} n  - the number to pad to
 * @param {string} str - the string for padding
 * @return {string}
 */
function padLeft(nr, n, str) {
  return Array(n-String(nr).length+1).join(str||'0')+nr;
}

/**
 * Get data from a stream
 *
 * @param {string} url - the url
 * @param {function} setProgress - a callback for each chunk
 */
export async function getStream(url, setProgress) {
  const response = await fetch(url, {credentials: 'same-origin', method: 'GET'})
    .catch(
      (error, errorCode, errorMsg) =>
        console.error(error, errorCode, errorMsg)
    );
  const reader = response.body.getReader();
  const contentLength = response.headers.get('Content-Length');

  // Step 3: read the data
  let receivedLength = 0; // received that many bytes at the moment
  let chunks = ''; // array of received binary chunks (comprises the body)
  let count = 0;
  let done = false;
  while (!done) {
    const {done, value} = await reader.read();

    if (done) {
      break;
    }

    let result = new TextDecoder('utf-8').decode(value);
    chunks += result;
    receivedLength += value.length;
    count++;

    // Subtract 1 from the loading calculation to make sure the loading bar
    // only disappears when the data is completely loaded (not only specimens)
    if (setProgress instanceof Function
            && (count % 25 == 0 || receivedLength == contentLength)
    ) {
      setProgress(Math.round((receivedLength/contentLength) * 100)-1);
    }
  }

  return JSON.parse(chunks);
}

/**
 * Post a GET request to a URL and call a callback on success
 *
 * @param {string} url - the url
 * @param {function} callBack - the success callback
 */
export async function get(url, callBack) {
  const response = await fetch(
    url,
    {credientials: 'same-origin', method: 'GET'}
  ).catch(
    (error, errorCode, errorMsg) =>
      console.error(error, errorCode, errorMsg)
  );

  const values = response.json();
  if (callBack) {
    callBack(values);
  }

  return values;
}

// function parsePartialJson(str) {
//   let parsed = '';
//   try {
//       parsed = JSON.parse(str+'}}');
//   } catch (e) {
//     str = str.slice(0, -1);
//     parsed = parsePartialJson(str);
//   }
//
//   return parsed;
// }

/**
 * Post a request to a URL, and call a callback on success or
 * raise a swal on error.
 *
 * @param {object} data - the data to post
 * @param {string} url - the url
 * @param {string} method - the method to use
 * @param {function} onSuccess - the success callback
 * @return {Promise}
 */
export async function post(data, url, method, onSuccess) {
  const response = await fetch(
    url, {
      credentials: 'same-origin',
      method: method,
      body: JSON.stringify(clone(data)),
    }
  )
    .catch((error) => console.error(error));

  if (response.ok) {
    onSuccess instanceof Function && onSuccess();
    // both then and catch resolve in case the returned data is not in
    // json format.
    return response.json()
      .catch((data) => data);
  } else {
    const data = await response.json();

    if (response.status == 403) {
      Swal.fire('Action is forbidden or session has timed out.', '', 'error');
    } else if (response.status === 422) {
      return Promise.reject(data);
    } else {
      Swal.fire(data.error, '', 'error');
      return Promise.reject(data.error);
    }
  }
}
