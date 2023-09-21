import {
  RESTDataSource,
} from 'apollo-datasource-rest';

import {
  logger,
} from '../../utils/logger';
/**
 * API handle oauth2 authorization from oauth2-server.
 */
export class Oauth2 extends RESTDataSource {
  /**
   * constructor
   */
  constructor() {
    super();
    this.baseURL = 'http://oauth2-server/';
  }

  /**
   * convert access Token info into schema
   * @param {Object} response access Token info from rest API
   * @return {Object} An object under GraphQL schema
   */
  convertAccessToken(response) {
    return {
      accessToken: response.access_token,
      tokenType: response.token_type,
      refreshToken: response.refresh_token,
      expiresIn: response.expires_in,
      scope: response.scope,
    };
  }
  /**
   * get access token.
   * @param {Object} params oauth2 params
   * @return {Object} An object under GraphQL schema
   */
  async getAccessToken(params) {
    const {
      clientCert,
      grantType,
      scope,
      username,
      password,
    } = params;
    const response = await this.post(`oauth/token`, null, {
      headers: {
        'Authorization': clientCert,
      },
      cache: 'no-cache',
      params: `grant_type=${grantType}&scope=${scope}&username=${username}&password=${password}`,
    });
    return this.convertAccessToken(response);
  }

  /**
   * refresh access token
   * @param {Object} params oauth2 params
   * @return {Object} An object under GraphQL schema
   */
  async freshAccessToken(params) {
    const {
      clientCert,
      grantType,
      refreshToken,
    } = params;
    const response = await this.get(`oauth/token`, `grant_type=${grantType}&refresh_token=${refreshToken}`, {
      headers: {
        'Authorization': clientCert,
      },
      cache: 'no-cache',
      cacheOptions: {
        ttl: 0,
      },
    });

    return this.convertAccessToken(response); ;
  }

  /**
   * refresh access token
   * @param {String} accessToken access token
   * @return {String} just return OK
   */
  async revoke(accessToken) {
    await this.delete(`oauth/revoke`, `token=${accessToken}`, {
      cache: 'no-cache',
    });
  }

  /**
   * get client info
   * @param {String} clientId
   * @return {Object} client_details info
   */
  async getClientInfo(clientId) {
    const response = await this.get(`/internal/oauth2Server/code/get_client_details`, `clientId=${clientId}`, {
      cache: 'no-cache',
    });
    return response;
  }

  /**
   * get call back url
   * @param {String} clientId
   * @param {String} userId
   * @param {String} resourceAuth
   * @param {String} redirectUri
   * @param {String} state
   * @return {String} response
   */
  async getCallBackUrl(clientId, userId, resourceAuth, redirectUri, state) {
    const response = await this.get(`/internal/oauth2Server/code/get`,
        `clientId=${clientId}&userId=${userId}&resourceAuth=${resourceAuth}${redirectUri == null ? '' : ('&redirectUri=' + redirectUri)}${state == null ? '' : ('&state=' + state)}`, {
          cache: 'no-cache',
        });
    return response;
  }

  /**
   * oauth2 authorization_code get token
   * @param {String} clientCert
   * @param {String} code
   * @return {String} response
   */
  async getAccessTokenByCode(clientCert, code) {
    const response = await this.get(`/internal/oauth2Server/token/get_by_code`,
        `code=${code}`, {
          headers: {
            'Authorization': clientCert,
          },
          cache: 'no-cache',
        });
    return response;
  }


  /**
   * getCodeTokenInfo
   * @param {String} clientId
   * @param {Long} userId
   * @return {*} response
   */
  async getCodeTokenInfo(clientId, userId) {
    const response = await this.get(`/internal/oauth2Server/token/get_code_token_info`,
        `clientId=${clientId}&userId=${userId}`, {
          cache: 'no-cache',
        });
    return response;
  }

  /**
   * chechAccessToken
   * @param {String} clientCert
   * @param {String} accessToken
   * @param {String} resourceType
   */
  async chechAccessToken(clientCert, accessToken, resourceType) {
    const response = await this.get(`/internal/oauth2Server/token/check`,
        `resourceType=${resourceType}`, {
          headers: {
            'Authorization': clientCert,
            accessToken,
          },
          cache: 'no-cache',
        });
    return response;
  }
}
