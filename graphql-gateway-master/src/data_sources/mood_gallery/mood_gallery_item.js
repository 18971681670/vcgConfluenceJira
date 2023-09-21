import {Node} from '../base/node';
import {getNowFormatDate} from '../../resolvers/helpers';

/**
 * API representing MoodGalleryItem from gallery
 */
export class MoodGalleryItem extends Node {
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
    return 'MoodGalleryItem';
  }

  /**
   * Whether a resource is queryable through the `node` or `nodeByLegacyId` queries.
   * @return {Boolean} Whether the resource is queryable. `false` by default.
   */
  get queryable() {
    return true;
  }

  /**
   * Map API response to MoodGalleryItem schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    return {
      ...super.reducer(obj),
      moodId: obj.mood_id,
      photoId: obj.photo_id,
      createdAt: obj.created_at,
      photoPulse: obj.photo_pulse,
      photoImpression: obj.photo_impression,
    };
  }

  /**
   * getItemsPageByMoodId.
   * @param {ID} legacyId moodId
   * @param {Boolean} isAdmin isAdmin
   * @param {Object} pagination The legacy page-base pagination
   * @param {number} pagination.pageNum The page number, starting from 1.
   * @param {number} pegination.pageSize The number of items in a page.
   * @return {Object} An object under GraphQL schema
   */
  async getItemsPageByMoodId(legacyId, isAdmin, {pageNum, pageSize}) {
    const qs = {
      page: pageNum,
      size: pageSize,
    };
    let response = {};
    if (isAdmin) {
      response = await this.get(`/v1/admin/moodGallery/getItemsByMoodId/`+ legacyId, this.tidyQuery(qs));
    } else {
      response = await this.get(`/v1/user/moodGallery/getItemsByMoodId/`+ legacyId, this.tidyQuery(qs));
    }

    const items = [];
    if (response.content) {
      response.content.forEach((item) => {
        items.push(this.reducer({id: item.mood_id + '_' + item.photo_id, ...item}));
      });
    }
    return {
      items,
      totalCount: response.total_items,
      totalPages: response.total_pages,
    };
  }

  /**
   * getItemsPageByMoodId.
   * @param {ID} moodId moodId
   * @param {Array} photoIdsArr photoIdsArr
   * @param {Object} pulse pulse
   * @param {number} impression impression
   * @return {Object} An object under GraphQL schema
   */
  async addSpecificPhotosToMoodGallery(moodId, photoIdsArr, pulse, impression) {
    let i = -1;
    const nowDateStr = getNowFormatDate();
    return photoIdsArr.map((photoId) => {
      ++i;
      return this.reducer({
        id: moodId + '_' + photoId,
        mood_id: moodId,
        photo_id: photoId,
        photo_pulse: pulse[i].current,
        photo_impression: impression[i],
        created_at: nowDateStr,
      });
    });
  }

  /**
   * aiGeneratePhoto.
   * @param {String} uuid
   * @param {String} keyWords keyWords
   * @param {photoNumber} photoNumber photoNumber
   * @return {Object} An object under GraphQL schema
   */
  async aiGeneratePhoto(uuid, keyWords, photoNumber) {
    const qs = {
      uuid: uuid,
      photoNumber: photoNumber,
      keyWords: keyWords,
    };
    const response = await this.get(`/v1/admin/moodGallery/generatePhoto`, this.tidyQuery(qs));
    const items = [];
    response.forEach((item) => {
      items.push(this.reducer({id: item.mood_id + '_' + item.photo_id, ...item}));
    });
    return items;
  }

  /**
   * getNewPublishedNumByMoodId.
   * @param {ID} moodId moodId
   * @return {number} NewPublishedPhotoNum
   */
  async getNewPublishedNumByMoodId(moodId) {
    const response = await this.get(`/v1/user/moodGallery/getNewPublishedNumByMoodId/` + moodId);
    return response || 0;
  }
}
