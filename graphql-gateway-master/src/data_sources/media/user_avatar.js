import {User} from '../user_center/user';
import {logger} from '../../utils/logger';

/**
 * API representing UserAvatar from media
 */
export class UserAvatar extends User {
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
    return 'UserAvatar';
  }

  /**
   * Map API response to UserAvatar schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    return {
      ...super.reducer(obj),
      __s3Path: obj.__avatarS3Path,
      version: obj.__avatarVersion,
    };
  }

  /**
   * Delete Avatar resource
   */
  async destroy() {
    // eslint-disable-next-line max-len
    await this.delete(`v3/users/avatar`);
  }
}
