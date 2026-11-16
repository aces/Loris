import {client} from 'jslib/http';

/**
 * Retrieve file metadata by ID.
 *
 * @param {string} id
 * @return {Promise<any>}
 */
export function getMeta(id) {
  return client.get(`document_repository/Files/meta/${id}`);
}
