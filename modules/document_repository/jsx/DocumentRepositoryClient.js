import {Client} from 'jslib/http';

/**
 * Document repository JSON client.
 */
class DocumentRepositoryClient extends Client {
  /**
   * @constructor
   */
  constructor() {
    super('document_repository');
  }

  /**
   * Retrieve file metadata by ID.
   *
   * @param {string} id
   * @return {Promise<any>}
   */
  getFileData(id) {
    return this
      .setSubEndpoint('Files/meta')
      .getById(id);
  }
}

export default DocumentRepositoryClient;
