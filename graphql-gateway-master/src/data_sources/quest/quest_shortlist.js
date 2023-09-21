import {BatchableAPI} from '../base/batchable_api';

/**
 * Photos in a Quest Shortlist
 */
export class QuestShortlist extends BatchableAPI {
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
   * @param {Number} questLegacyId Id of Quest
   * @param {Number} questTopicId Quest Topic id
   */
  async paginatedPhotoIdList({pageNum, pageSize}, questLegacyId, questTopicId) {
    const qs = {
      page: pageNum,
      rpp: pageSize,
    };

    let response = null;
    if (questTopicId!=null) {
      response= await this.get(
          `internal/graphql/quests/topic/${questTopicId}/shortlist`,
          this.tidyQuery(qs),
      );
    } else {
      response=await this.get(
          `internal/graphql/quests/${questLegacyId}/shortlist`,
          this.tidyQuery(qs),
      );
    }


    return {
      __photoIds: response.shortlist_entries.map((shortlistEntry) => shortlistEntry.photo_id),
      totalCount: response.total_items,
    };
  }

  /**
   * Add a photo to a quest shortlist
   * @param {Object} input Input
   * @param {Number} input.photoLegacyId Photo ID
   * @param {Number} input.questLegacyId Quest ID
   */
  async add({questLegacyId, photoLegacyId}) {
    await this.put(`/internal/graphql/quests/${questLegacyId}/shortlist/${photoLegacyId}`);
  }

  /**
   * Remove a photo from a quest shortlist
   * @param {Object} input Input
   * @param {Number} input.photoLegacyId Photo ID
   * @param {Number} input.questLegacyId Quest ID
   */
  async remove({questLegacyId, photoLegacyId}) {
    await this.delete(`/internal/graphql/quests/${questLegacyId}/shortlist/${photoLegacyId}`);
  }

  /**
   * Aysnc bulk fetch information from a given microservice
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadData(keys) {
    const url = `internal/graphql/quests/doInshortList`;
    const response = await this.post(url, keys);
    return keys.map((key) => {
      const {photoId, questId} = key;
      return !!response[photoId+'-'+questId];
    });
  }
}
