import {
  Node,
} from '../base/node';

/**
 * API representing UserContact from user-center
 */
export class UserCenter extends Node {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'usercenter';
  }
  /**
   * Get the unique resource type, which will be used for generate global
   * resource ID
   * @return {string} The name of microservice in K8
   */
  get resourceType() {
    return 'UserCenter';
  }


  /**
   *  发送验证邮件
   * @param {*} internalId Internal user id
   * @param {*} input  unverifiedEmail
   */
  async emailVerification(internalId, input) {
    const response = await this.patch(`internal/graphql/email_verification/email_me`, input);
    if (response.status == 200) {
      const obj = {};
      obj.id = internalId;
      return {
        ...super.reducer(obj),

        input,
      };
    } else {
      return null;
    }
  }

  /**
   * user register
   * @param {Object} input user register payload
   */
  async userRegister(input) {
    const response = await this.post(`internal/graphql/register`, input);
    return {
      ...this.reducer(response),
      username: response.username,
      email: response.email,
      newUser: response.new_user,
      csrfToken: response.csrf_token,
      jwtToken: response.jwt_token,
    };
  }

  /**
   * get if a user account can be delete by the user himself.
   * the user id will passed by the login token in the header.
   */
  async getAccountDeletable() {
    const response = await this.get(`internal/graphql/account/deletable`);
    return response;
  }

  /**
   * delete a user its own account.
   * @param {Object} input The feedback information submit by user when a user delete its account.
   */
  async deleteUserAccount(input) {
    await this.patch(`internal/graphql/account/delete`, input);
  }

  /**
   * verify the password or TFA-code of a user.
   * @param {Object} input the verify data.
   * @return {Boolean} true if verify is passed.
   */
  async verifySecurityToken(input) {
    const {
      legacyUserId,
      securityToken,
      securityTokenType,
    } = input;
    return await this.post(`internal/graphql/security/verify/${securityTokenType}`, {
      user_id: legacyUserId,
      verification_value: securityToken,
    });
  }

  /**
   * deactivate a user account, the deactivated account can be restore at anytime.
   * @param {ID} legacyUserId the id of user who's account will be deactivated.
   */
  async deactivateUserAccount(legacyUserId) {
    return await this.delete(`internal/graphql/account/deactivate/${legacyUserId}`);
  }

  /**
   * request to do the password reset and send a confirm email.
   * @param {Object} request the password reset request.
   */
  async requestPasswordRerset(request) {
    await this.post(`/internal/graphql/password/reset/request`, request);
  }

  /**
   * verity the code in the password reset email.
   * @param {String} verifyCode the verify code in the password reset email.
   * @return {Object} contain the user id, tfa enabled and the valid verifyCode.
   */
  async verifyPasswordReset(verifyCode) {
    const res = await this.post(`/internal/graphql/password/reset/verify/${verifyCode}`);
    return res;
  }

  /**
   * Reset the passwrod.
   * @param {String} verifyCode the password reset verify code.
   * @param {String} password  the new password need to change.
   */
  async doPasswordReset(verifyCode, password) {
    await this.post(`/internal/graphql/password/reset/done`, {
      code: verifyCode,
      password,
    });
  }

  /**
   * For a login user to change its password.
   * @param {Object} payload The request body to change password.
   * @param {String!} payload.currentPassword The old password of user.
   * @param {String!} payload.password The new password of user.
   */
  async changePassword(payload) {
    await this.post(`/internal/graphql/password/change`, payload);
  }

  /**
   * To request to activate a user's account.
   * Send a account activate email to user.
   * @param {String} redirect Optional, a relative URI to add as a query param to the activation link.
   * @param {String} origin Optional, represents the original location where activation was triggered.
   * @param {String} newEmail Optional, the new email if user want change the email address to receive the activation email.
   */
  async requestActivateAccount(redirect, origin, newEmail) {
    const queryParam = [];
    if (redirect) {
      queryParam.push(`redirect=${redirect}`);
    }
    if (origin) {
      queryParam.push(`origin=${origin}`);
    }
    if (newEmail) {
      queryParam.push(`newEmail=${newEmail}`);
    }

    const queryParamString = queryParam.length == 0 ? '' : `?${queryParam.join('&')}`;

    await this.post(`/internal/graphql/account/activation/request${queryParamString}`);
  }

  /**
   * To complete the user account activation after a user click the activation email.
   * @param {String} userId legacyUserId,
   * @param {String} code The verify code in the link of  activation email.
   */
  async completeActivateAccount(userId, code) {
    await this.post(`/internal/graphql/account/activation/complete`, {user_id: userId, code});
  }

  /**
   * To request a change a user's email.
   * @param {String!} newEmail
   */
  async requestChangeEmail(newEmail) {
    await this.put(`/internal/graphql/email/change/request?email=${newEmail}`);
  }

  /**
   * To complete the email changing request.
   * @param {String} userId legacyUserId,
   * @param {String} code The verify code in the link of  activation email.
   */
  async completeChangeEmail(userId, code) {
    await this.post(`/internal/graphql/email/change/complete`, {user_id: userId, code});
  }

  /**
   * To complete email confirmation by click the link in the confirm email with path 'account/confirm'
   * @param {String} userId legacyUserId.
   * @param {String} code The verify code inthe link of confirm email with path 'account/confirm'.
   */
  async completeEmailConfirmation(userId, code) {
    await this.post(`/internal/graphql/email_verification/confirmation_complete`, {user_id: userId, code});
  }

  /**
   * This is sends a reactivation email to a user with a deactivated account
   * @param {String} email
   * @param {String} username
   * @return {Object} response
   */
  async sendReactivation({email, username}) {
    if (!email && !username) return false;
    const data = email ? {email} : {username};
    await this.post('/v3/users/me/reactivation/request', data);
    return true;
  }

  /**
   * Get access/csrf token for web
   * @param {String} captchaVersion
   * @param {String} captchaResponse
   * @param {String} username
   * @param {String} password
   * @return {Object} response
   */
  async getWebAccessToken({captchaVersion, captchaResponse, username, password}) {
    try {
      let response;
      if (['from_google', 'from_facebook', 'from_apple'].includes(username)) {
        response = await this.oauthSignIn(username, password);
      } else {
        response = await this.usernameAndPasswordSignIn(captchaVersion, captchaResponse, username, password);
      }
      return {
        __resolveType: 'WebAccessToken',
        accessToken: response.access_token,
        accessTokenExpiresIn: response.access_token_expires_in,
        csrfToken: response.csrf_token,
        csrfTokenExpiresIn: response.csrf_token_expires_in,
      };
    } catch (e) {
      return {
        __resolveType: 'WebAccessTokenError',
        errorCode: e.extensions.response.body.error_code,
        errorMessage: e.extensions.response.body.error,
        status: e.extensions.response.body.status,
      };
    }
  }

  /**
   * Get access/csrf token from username/email and password login
   * @param {String} captchaVersion
   * @param {String} captchaResponse
   * @param {String} username
   * @param {String} password
   * @return {Object} response
   */
  usernameAndPasswordSignIn(captchaVersion, captchaResponse, username, password) {
    return this.post('/internal/graphql/session', {
      session: {email: username, password},
      captchaResponse,
      captchaVersion,
    });
  }

  /**
   * Get access/csrf token from google/facebook/apple oauth login
   * @param {String} provider
   * @param {String} accessToken
   * @return {Object} response
   */
  async oauthSignIn(provider, accessToken) {
    const authMode = {
      from_google: 'google_oauth2',
      from_facebook: 'facebook',
      from_apple: 'apple',
    };
    return this.post('/internal/graphql/signUp', {auth_mode: authMode[provider], auth_token: accessToken});
  }
}
