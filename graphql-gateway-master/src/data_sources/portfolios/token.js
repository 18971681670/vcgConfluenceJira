import {API} from '../base/api';

/**
 * @typedef {{token: string}} TokenResponse
 * @typedef {{id: string, token: string}} Token
 */
export class Token extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'portfolios';
  }

  /**
   * Token type
   */
  get resourceType() {
    return 'PortfolioTemporaryToken';
  }

  /**
   * Map API response
   * @param {TokenResponse} obj An item from API response
   * @return {Token} An object under GraphQL schema
   */
  reducer(obj) {
    return {
      value: obj.token,
      __resolveType: this.resourceType,
    };
  }

  /**
   * Create a new token for the current user.
   *
   * @return {Token} the created token
   */
  async createTokenForUser() {
    const resp = await this.post('internal/tokens');
    return this.reducer(resp);
  }
}
