import {Node} from '../base/node';

/**
 * API representing UserContact from user-center
 */
export class UserContact extends Node {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'userprofile';
  }
  /**
   * Get the unique resource type, which will be used for generate global
   * resource ID
   * @return {string} The name of microservice in K8
   */
  get resourceType() {
    return 'UserContact';
  }

  /**
   * Map User API response to UserContact schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducerFromUser(obj) {
    const email = (obj.can_email == 1 ? obj.email : null);
    const unverifiedEmail = (obj.can_email != 1 ? obj.email : (
      obj.shadow_email && obj.email.toLowerCase() != obj.shadow_email.toLowerCase() ? obj.shadow_email : null
    ));

    return {
      ...super.reducer(obj),

      email,
      unverifiedEmail,
    };
  }

  /**
   * Map ExtendedUser API response to UserContact schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducerFromExtendedUser(obj) {
    return {
      ...super.reducer({
        ...obj,
        id: obj.user_id,
      }),

      phone: obj.verified_phone_number,
      phoneCountry: obj.country_code,
    };
  }
  /**
   * Update user contact
   * @param {UserContact} userContact
   */
  async update(userContact) {
    const body = this.inputToBody(userContact, {
      camelToSnakeMapping: [
        'userId',
        'countryCode',
        'verifiedPhoneNumber',
      ],
    });

    // eslint-disable-next-line max-len
    const response = await this.patch(`internal/graphql/userProfile/userContact`, body);
    return {
      ...super.reducer({
        ...response,
        id: response.user_id,
      }),

      phone: response.verified_phone_number,
      phoneCountry: response.country_code,
    };
  }
}
