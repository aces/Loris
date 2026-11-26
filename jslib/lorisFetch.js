/**
 * Wrapper around fetch that keeps credentials on same-origin requests.
 *
 * The global helper in loris-scripts.js owns login modal handling for 401s.
 * Bundled modules import this file to use that shared helper when it exists.
 *
 * @param {*} input
 * @param {object=} init
 * @return {Promise<Response>}
 */
function fallbackFetch(input, init) {
  const options = Object.assign(
    {
      credentials: 'same-origin',
    },
    init || {}
  );

  return fetch(input, options);
}

const lorisFetch = typeof window !== 'undefined' && window.lorisFetch
  ? window.lorisFetch
  : fallbackFetch;

if (typeof window !== 'undefined' && !window.lorisFetch) {
  window.lorisFetch = lorisFetch;
}

export default lorisFetch;
