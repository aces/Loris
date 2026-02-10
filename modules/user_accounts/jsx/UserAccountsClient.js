import {Client, Errors} from 'jslib';

/**
 * User accounts HTTP client.
 */
class UserAccountsClient extends Client {
  /**
   * @constructor
   */
  constructor() {
    super('/user_accounts/ajax');
  }

  /**
   * Reject a user account request by identifier.
   *
   * @param {string} userID
   * @return {Promise<void>}
   */
  async rejectUser(userID) {
    const request = new Request(new URL('rejectUser.php', this.baseURL), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: new URLSearchParams({identifier: userID}),
    });

    try {
      const response = await fetch(request);
      if (!response.ok) {
        throw new Errors.ApiResponse(request, response);
      }
    } catch (error) {
      if (error instanceof Errors.Http) {
        throw error;
      }
      throw new Errors.ApiNetwork(request);
    }
  }
}

export default UserAccountsClient;
