import {Node} from '../base/node';

/**
 * API representing SocialMedia from user_profile
 */
export class SocialMedia extends Node {
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
    return 'SocialMedia';
  }

  /**
   * Map API response to SocialMedia schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    return {
      ...super.reducer(obj),
      // from JSON fields to GraphQL schema fields
      facebook: obj.facebookpage,
      website: obj.website,
      twitter: obj.twitter,
      instagram: obj.instagram,
    };
  }

  /**
   * Get the sociamedia info within the given id
   * @param {int} __internalId
   * @return {SocialMedia}
   */
  async loadData(__internalId) {
    const response = await this.get(`internal/graphql/userProfile/socialMedia`, {userid: __internalId});
    return this.reducer({
      ...response,
      id: __internalId,
    });
  }

  /**
   * update user social media
   * @param {SocialMedia} socialMedia
   */
  async update(socialMedia) {
    if (!socialMedia) {
      return;
    }
    socialMedia.facebookpage = socialMedia.facebook;
    const body = this.inputToBody(socialMedia, {
      camelToSnakeMapping: [
        'id',
        'facebookpage',
        'website',
        'twitter',
        'instagram',
      ],
    });
    return await this.patch(`internal/graphql/userProfile/socialMedia`, body);
  }
}
