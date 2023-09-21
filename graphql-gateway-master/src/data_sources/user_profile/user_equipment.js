import {Node} from '../base/node';

/**
 * API representing UserEquipment from user_profile
 */
export class UserEquipment extends Node {
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
    return 'UserEquipment';
  }
  /**
   * Map API response to UserEquipment schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    return {
      ...super.reducer(obj),
      // from JSON fields to GraphQL schema fields
      camera: obj.camera,
      lens: obj.lens,
      misc: obj.misc,
    };
  }
  /**
   * Update UserEquipment resource
   * @param {UserEquipment} input
   */
  async update(input) {
    if (!input) {
      return;
    }
    const body = this.inputToBody(input, {
      camelToSnakeMapping: [
        'id',
        'camera',
        'lens',
        'misc',
      ],
    });
    return await this.patch(`internal/graphql/userProfile/equipment`, body);
  }

  /**
   * Get the user equipment within the given id
   * @param {int} __internalId
   * @return {UserEquipment}
   */
  async loadData(__internalId) {
    const response = await this.get(`internal/graphql/userProfile/equipment`);
    return this.reducer({
      ...response,
      id: __internalId,
    });
  }
}
