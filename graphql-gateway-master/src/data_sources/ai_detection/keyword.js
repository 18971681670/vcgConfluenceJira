import {API} from '../base/api';
import {logger} from '../../utils/logger';

/**
 * Paginated API representing one-to-many association from Gallery to Photo in gallery
 */
export class Keyword extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'ai-service';
  }

  /**
   * Get suggest keywords of a uploaed photo.
   * @param {ID} photoId the id of uploaded photo.
   * @param {ID} userId  the id of user who uploaded photo.
   * @param {String} photoUrl the url of photo
   * @param {String} photoBase64Content the photo conent with base64 encoded.
   * @param {Int} quantity the number of keyword want to return.
   * @return {array} list of keywords.
   */
  async getPhotoKeywords(photoId, userId, photoUrl, photoBase64Content, quantity) {
    photoUrl = photoUrl || '';
    const response = await this.post(`keywords?photo_id=${photoId}&user_id=${userId}&photo_url=${photoUrl}&quantity=${quantity}`, photoBase64Content);
    if (response && response.status == 'success' && response.data && response.data.keywords && response.data.keywords.en) {
      return response.data.keywords.en;
    }
    return [];
  }

  /**
   * Get suggest keywords of a uploaed photo.
   * @param {array} photoIds the ids of uploaded photo.
   * @return {obj} KeywordAiData.
   */
  async getPhotoKeywordsByIds(photoIds) {
    const response = await this.post(`/api/internal/keyword/ai`, photoIds);
    const result = response.map((item) => {
      return {
        ...item,
        photoId: item.photo_id,
      };
    });
    return result;
  }

  /**
   * Bulk get intersection and union collection of keyword for multiple photos.
   * @param {array} photos The list of photo information payload, include id and url.
   * @param {ID} userId The id of user who own those photo.
   * @param {Int} intersectionQuantity The size of keyword intersection colletion to return.
   * @param {Int} unionQuantity The size of keyword union collection to return.
   * @return {Object} the object contain intersection and union collection of keyword data.
   */
  async batchGetPhotoKeywords(photos, userId, intersectionQuantity, unionQuantity) {
    const body = {
      photos,
      user_id: userId,
      intersection_quantity: intersectionQuantity,
      union_quantity: unionQuantity,
    };
    const response = await this.post(`/keywords/batch`, body);
    return response;
  }
}
