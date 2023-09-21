import {API} from '../base/api';

/**
 * Paginated API for Quest Feed for everyone
 */
export class QuestFeed extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'contest';
  }

  /**
   * Get a paginated list of Quest resources for everyone
   * @param {Object} pagination The legacy page-base pagination
   * @param {number} pagination.pageNum The page number, starting from 1.
   * @param {number} pagination.pageSize The number of items in a page.
   * @param {string} filter ENDED, ONGOING, COMMUNITY, LICENSING or null
   * @param {boolean} geofenced is this gonna return geofenced quests
   */
  async paginatedQuestList({pageNum, pageSize, photoId, userId}, filter, geofenced) {
    filter = filter && filter.toLowerCase();

    const qs = {
      page: pageNum,
      size: pageSize,
      photoId: photoId,
      userId: userId,
      filter,
      markdown: true,
      userlocale: this.context.viewerLanguage,
      geofenced,
    };

    const response = await this.get(`internal/graphql/quests`, this.tidyQuery(qs));
    const __quests = response.quests.map((obj) => {
      return this.siblingDataSources.quest.reducer(obj);
    });

    return {
      __quests,
      totalCount: response.total_items,
    };
  }
}
