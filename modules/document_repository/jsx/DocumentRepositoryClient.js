import {Client, Query} from 'jslib';

/**
 * Document repository JSON client.
 */
class DocumentRepositoryClient extends Client {
  /**
   * @constructor
   */
  constructor() {
    super('/document_repository');
  }

  /**
   * Retrieve file metadata by ID.
   *
   * @param {string} id
   * @return {Promise<any>}
   */
  getFileData(id) {
    const query = new Query().addParam({field: 'id', value: id});
    return this
      .setSubEndpoint('ajax/getFileData.php')
      .get(query);
  }
}

export default DocumentRepositoryClient;
