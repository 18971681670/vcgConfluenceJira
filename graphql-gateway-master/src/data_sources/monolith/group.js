import {Node} from '../base/node';

/**
 * API representing Group from group
 */
export class Group extends Node {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return process.env.MONOLITH_URL || '500px.com';
  }

  /**
   * Get the unique resource type, which will be used for generate global
   * resource ID
   * @return {string} The name of microservice in K8
   */
  get resourceType() {
    return 'ProfileGroups';
  }

  /**
   * Map API response to Group schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    return {
      ...super.reducer(obj),
      legacyId: obj.id,
      name: obj.name,
      description: obj.description,
      membersCount: obj.members_count,
      coverPhotoUrl: obj.cover_photo && obj.cover_photo['2048b'].url,
      canonicalPath: `/groups/${obj.slug}`,
      __avatars: obj.avatars,
      __creatorUserId: obj.user_id.toString(),
    };
  }
}
