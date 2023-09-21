import {BatchableAPI} from '../base/batchable_api';
import {reverseLookupTable} from '../../utils/misc';
import {logger} from '../../utils/logger';

export const RESOLVE_TYPE_MAPPING = {
  0: 'ContentStreamFresh',
  1: 'ContentStreamUpcoming',
  2: 'ContentStreamPopular',
  3: 'ContentStreamEditorsChoice',
};

export const FEATURE_MAPPING = {
  'popular': 'POPULAR_SECTION',
  'upcoming': 'UPCOMING_SECTION',
  'fresh': 'FRESH_SECTION',
  'editors': 'EDITORS_CHOICE_SECTION',
};

const CATEGORIES = {
  ABSTRACT: 'abstract',
  AERIAL: 'aerial',
  ANIMALS: 'animals',
  BLACK_AND_WHITE: 'black and white',
  BOUDOIR: 'boudoir',
  CELEBRITIES: 'celebrities',
  CITY_AND_ARCHITECTURE: 'city and architecture',
  COMMERCIAL: 'commercial',
  CONCERT: 'concert',
  FAMILY: 'family',
  FASHION: 'fashion',
  FILM: 'film',
  FINE_ART: 'fine art',
  FOOD: 'food',
  JOURNALISM: 'journalism',
  LANDSCAPES: 'landscapes',
  MACRO: 'macro',
  NATURE: 'nature',
  NIGHT: 'night',
  NUDE: 'nude',
  PEOPLE: 'people',
  PERFORMING_ARTS: 'performing arts',
  SPORT: 'sport',
  STILL_LIFE: 'still life',
  STREET: 'street',
  TRANSPORTATION: 'transportation',
  TRAVEL: 'travel',
  UNDERWATER: 'underwater',
  URBAN_EXPLORATION: 'urban exploration',
  WEDDING: 'wedding',
  UNCATEGORIZED: 'uncategorized',
};

export const FEATURE_REVERSE_MAPPING = reverseLookupTable(FEATURE_MAPPING);

/**
 * API representing ContentStream from content-stream
 */
export class ContentStream extends BatchableAPI {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'content-stream';
  }

  /**
   * Get workshop ids for discover section.
   * @param {*} LegecyPagiationInfo
   * @param {*} SearchCondition
   */
  async photoDiscoverSearch({pageNum, pageSize}, {discoverSectionType, personalizedCategories, categories, excludeNude, excludePrivate, followersCount}) {
    const reqJson = {
      'page': pageNum,
      'rpp': pageSize,
      'feature': discoverSectionType,
      'personalizedCategories': personalizedCategories,
      'only': categories,
      'excludeNude': excludeNude,
      'excludePrivate': excludePrivate,
      'followersCount': followersCount,
    };

    const body = this.inputToBody(reqJson, {
      camelToSnakeMapping: [
        'page',
        'rpp',
        'feature',
        'personalizedCategories',
        'only',
        'excludeNude',
        'excludePrivate',
        'followersCount',
      ],
      convertedMapping: {
        only: {
          conversion: (categories) => {
            return categories.map((category) => (CATEGORIES[category.toUpperCase()])).join(',');
          },
        },
        feature: {
          conversion: FEATURE_REVERSE_MAPPING,
        },
      },
    });

    const response = await this.post('internal/graphql/photo/discover', body);

    return {
      __ids: response.ids,
      currentPage: response.current_page,
      totalPages: response.total_pages,
      totalCount: response.total_items,
    };
  }


  /**
   * Aysnc bulk fetch information of ContentStream resources
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadData(keys) {
    const qs = {
      ids: keys.join(','),
    };

    const response = await this.get(`internal/graphql/photos/findContentStreamsByIds`, qs);

    return keys.map((id) => {
      const streams = response[id];
      if (!streams) {
        return [];
      } else {
        return streams.map((obj) => {
          return {
            enteredAt: obj. start_at,
            __resolveType: RESOLVE_TYPE_MAPPING[obj.stream_type],
            __selectedByUserId: obj.editored_by,
          };
        });
      }
    });
  }

  /**
   * Aysnc bulk fetch information of ContentStream resources
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadCurrentContentStream(keys) {
    const qs = {
      ids: keys.join(','),
    };
    const response = await this.get(`internal/graphql/photos/findCurrentContentStreamsByIds`, qs);
    return keys.map((id) => {
      const obj = response[id];
      if (!obj) {
        return null;
      } else {
        return {
          enteredAt: obj. start_at,
          __resolveType: RESOLVE_TYPE_MAPPING[obj.stream_type],
          __selectedByUserId: obj.editored_by,
        };
      }
    });
  }

  /**
   * add photo to editor's choice
   * @param {Number} internalId Internal photo id
   */
  async editorsChoice(internalId) {
    await this.post(`internal/graphql/photos/${internalId}/editors_choice`);
  }

  /**
   * remove photo from editor's choice
   * @param {Number} internalId Internal photo id
   */
  async uneditorsChoice(internalId) {
    await this.delete(`internal/graphql/photos/${internalId}/editors_choice`);
  }
}
