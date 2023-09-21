import {btoa} from '../../utils/base64';
import {API} from '../base/api';
import moment from 'moment';

/**
 * Photos in a Quest
 */
export class QuestPhotos extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'contest';
  }

  /**
   * Get a paginated list of photo ids
   * @param {Object} pagination The legacy page-base pagination
   * @param {number} pagination.pageNum The page number, starting from 1.
   * @param {number} pagination.pageSize The number of items in a page.
   * @param {Number} questId Id of Quest
   * @param {String} filter Filter: null/winner/licensing
   * @param {String} licensingFilter Filter:  NOT_SUBMITTED UNDER_REVIEW CHANGE_REQUIRED ACCEPTED DECLINED REMOVED RELEASE_REQUIRED DELETED
   * @param {Number} questTopicId Quest Topic id
   * @param {String} uploadFromFilter NULL/CN/COM
   */
  async paginatedPhotoIdList({size, previous = false, cursor = false, page}, questId, filter, licensingFilter, questTopicId, uploadFromFilter) {
    if (!cursor) cursor = btoa(`${moment.utc('1900-01-01').format('YYYY-MM-DDTHH:mm:ss').toString()},0`);

    let uploadSourceFrom = '0,1';
    if ('COM'==uploadFromFilter) {
      uploadSourceFrom = '0';
    }
    if ('CN'==uploadFromFilter) {
      uploadSourceFrom = '1';
    }
    const qs = {
      page,
      previous,
      size,
      filter,
      licensingfilter: licensingFilter,
      cursor,
      uploadSourceFrom: uploadSourceFrom,
    };
    let response = null;
    if (questTopicId != null) {
      response = await this.get(`internal/graphql/quests/topic/${questTopicId}/photos`, this.tidyQuery(qs));
    } else {
      response = await this.get(`internal/graphql/quests/${questId}/photos`, this.tidyQuery(qs));
    }

    if (page !== 0) {
      const total = Math.ceil(response.total_items / size );
      return {
        currentPageLegacy: response.current_page,
        legacyTotalPages: total,
        questEntries: response.photos,
        totalCount: response.total_items,
        hasNextPage: response.current_page < total,
        hasPreviousPage: response.current_page > 1,
      };
    }

    return {
      questEntries: response.photos,
      totalCount: response.total_items,
      hasNextPage: previous ? response.total_items !== response.count : response.count - size > 0,
      hasPreviousPage: previous ? response.count - size > 0 : response.total_items !== response.count,
    };
  }

  /**
   * get my photos of quests
   * @param {Number} questId questId
   * @param {Number} topicId  questTopicId
   * @param {Number} size page-size
   * @param {Number} page page-index
   * @return {*} photos & pageInfo
   */
  async mySubmittedPhotos(questId, topicId = -1, size, page) {
    const qs = {
      topicId, size, page,
    };
    const response = await this.get(`internal/graphql/quests/${questId}/me/photos`, this.tidyQuery(qs));

    return {
      currentPageLegacy: response.current_page,
      legacyTotalPages: response.total_pages,
      photos: response.photos,
      totalCount: response.total_items,
      hasNextPage: response.current_page < response.total_pages,
      hasPreviousPage: response.current_page > 1,
    };
  }


  /**
   * get all winners of quests
   * @param {Number} questId 大赛id
   */
  async winners(questId) {
    const qs = {};
    const response = await this.get(`internal/graphql/quests/${questId}/winners`, this.tidyQuery(qs));
    return response.map( (val) =>{
      return {
        _photo_id: val.photo_id,
        topic: val.quests_topic!=null?{
          questTopicId: val.quests_topic.id,
          questId: val.quests_topic.quest_id,
          inspirationGalleryId: val.quests_topic.inspiration_gallery_id,
          topicName: val.quests_topic.name,
        }:null,
      };
    });
  }

  /**
   * Add a photo to a quest
   * @param {Object} input Input
   * @param {Number} input.photoLegacyId Photo ID
   * @param {Number} input.questLegacyId Quest ID
   * @param {Number} input.questTopicLegacyId Quest Topic ID
   */
  async add({questLegacyId, photoLegacyId, questTopicLegacyId}) {
    if (!!questTopicLegacyId) {
      await this.post(`/internal/graphql/quests/${questLegacyId}/photos/${photoLegacyId}?questTopicId=${questTopicLegacyId}`);
    } else {
      await this.post(`/internal/graphql/quests/${questLegacyId}/photos/${photoLegacyId}`);
    }
  }
  /**
   * Add a photo to a quest
   * @param {Number} questLegacyId Quest ID
   * @param {Number} photoLegacyId Photo ID
   */
  async deleteFromQuests(questLegacyId, photoLegacyId) {
    await this.delete(`/internal/graphql/quests/${questLegacyId}/photos/${photoLegacyId}`);
  }

  /**
   * Delete a photo from a quest
   * @param {Number} questLegacyId Quest ID
   * @param {Number} photoLegacyId Photo ID
   */
  async deleteFromQuests4Admin(questLegacyId, photoLegacyId) {
    await this.delete(`/internal/graphql/admin/quests/${questLegacyId}/photos/${photoLegacyId}`);
  }
}
