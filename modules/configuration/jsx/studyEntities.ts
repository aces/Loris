import {client} from 'jslib/http';

type SaveResponse = {
  error?: string,
  ok?: string,
};

/**
 * Submit form values to the existing guarded endpoint.
 *
 * @param url Save endpoint, relative to the LORIS base URL
 * @param body Form values
 * @return Parsed save response
 */
export async function save(
  url: string,
  body: URLSearchParams
): Promise<SaveResponse> {
  return client.request<SaveResponse>(url, {
    body,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    method: 'POST',
  });
}
