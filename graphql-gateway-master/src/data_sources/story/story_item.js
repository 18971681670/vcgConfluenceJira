import {Node} from '../base/node';


/**
 * API representing Gallery from gallery
 */
export class StoryItem extends Node {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'gallery';
  }

  /**
   * Get the unique resource type, which will be used for generate global
   * resource ID
   * @return {string} The name of microservice in K8
   */
  get resourceType() {
    return 'PhotoInStory';
  }

  /**
   * Whether a resource is queryable through the `node` or `nodeByLegacyId` queries.
   * @return {Boolean} Whether the resource is queryable. `false` by default.
   */
  get queryable() {
    return true;
  }

  /**
   * Map API response to MoodGallery schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    return {
      ...super.reducer(obj),
      storyId: obj.story_id,
      photoId: obj.photo_id,
      sort: obj.sort,
      createdAt: obj.created_at,
    };
  }


  /**
   * getPhotoListByStoryId.
   * @param {ID} legacyId legacyId
   * @return {Object} An object under GraphQL schema
   */
  async getPhotoListByStoryId(legacyId) {
    const response = await this.get(`/v1/user/story/items/`+ legacyId);

    const items = [];
    if (response.content) {
      response.content.forEach((item) => {
        items.push(this.reducer({id: item.story_id + '-' + item.photo_id, ...item}));
      });
    }
    return {
      items,
    };
  }
}
