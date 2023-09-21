import {Node} from '../base/node';

const StoryFilterType = {
  FEATURE: 'feature',
  IS_NSFW: 'isNsfw',
};

/**
 * API representing Gallery from gallery
 */
export class Story extends Node {
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
    return 'Story';
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
      legacyId: obj.id,
      headline: obj.headline,
      fullStory: obj.description,
      privacy: obj.privacy,
      createdAt: obj.created_at,
      publishDate: obj.publish_date,
      featureDate: obj.feature_date,
      canonicalPath: obj.custom_path,
      __creatorUserId: obj.created_by,
      notSafeForWork: obj.is_nsfw,
    };
  }

  // eslint-disable-next-line require-jsdoc
  async bulkLoadData(keys) {
    const qs = {
      ids: keys.join(','),
    };

    const response = await this.get(`internal/graphql/stories/findByIds`, qs);
    return this.processResponse(keys, response);
  }

  /**
   * process bulk response
   * @param {Array} keys - internal photo ids
   * @param {Array} response - array of photo objects
   * @return {Array} intersection of keys and response objects
   */
  processResponse(keys, response) {
    const lookupById = response.reduce(function(map, obj) {
      map[obj.id] = obj;
      return map;
    }, {});

    return keys.map((id) => {
      return (lookupById[id] || null);
    });
  }

  /**
   * pageStoryList
   * @param {String} privacy
   * @param {String} sort
   * @param {Number} ownerId ownerId
   * @param {Array} filters The list of filter objects
   * @param {String} search search
   * @param {Boolean} realTime realTime
   * @param {Object} pagination The legacy page-base pagination
   * @param {number} pagination.pageNum The page number, starting from 1.
   * @param {number} pegination.pageSize The number of items in a page.
   * @return {*} story list
   */
  async pageStoryList(privacy, sort, ownerId, filters, search, realTime, {pageNum, pageSize}) {
    const serializedFilters = filters ? filters.map((filter) => ({
      key: StoryFilterType[filter.key],
      value: filter.value,
    })) : [];
    const qs = {
      page: pageNum,
      size: pageSize,
      sort,
      privacy,
      ownerId,
      filters: JSON.stringify(serializedFilters),
      search,
      realTime,
    };
    const response = await this.get(`/v1/user/story/list`, this.tidyQuery(qs));

    const __stories = response.stories.map((obj) => {
      return this.reducer(obj);
    });
    return {
      __stories,
      totalCount: response.total_items,
    };
  }

  /**
   * createStory.
   * @param {Object} input An object under GraphQL schema
   * @return {Object} An item from API response
   */
  async createStory(input) {
    const mappingConfig = {
      camelToSnakeMapping: [
        'storyId',
        'headline',
        'description',
        'privacy',
      ],
    };

    const body = this.inputToBody(input, mappingConfig);

    if (input && input.items) {
      const itemMappingConfig = {
        camelToSnakeMapping: [
          'storyId',
          'photoId',
          'sort',
        ],
      };

      const itemBodyArr = [];
      const items = input.items;
      items.forEach((item) => {
        const itemBody = this.inputToBody(item, itemMappingConfig);
        itemBodyArr.push(itemBody);
      });
      body['items'] = itemBodyArr;
    }
    const response = await this.post(`/v1/user/story/create`, body);
    return this.reducer(response.data.data);
  }

  /**
   * getStoryDetailById.
   * @param {ID} storyId storyId
   * @return {Object} An object under GraphQL schema
   */
  async getStoryDetailById(storyId) {
    const response = await this.get(`/v1/user/story/getDetailById/`+ storyId);
    if (response) {
      return this.reducer({...response});
    }
    return response;
  }

  // eslint-disable-next-line require-jsdoc
  async getByIds(storyIds) {
    const response = await this.post(`/v1/user/story/listStory`, storyIds);

    const responseMap = new Map(response.map((item) => [item.id, this.reducer(item)]));
    return storyIds.map((c) => {
      return responseMap.get(c);
    });
  }

  /**
   * getDetailBySlug.
   * @param {ID} slug slug
   * @return {Object} An object under GraphQL schema
   */
  async getDetailBySlug(slug) {
    const response = await this.get(`/v1/user/story/getDetailBySlug/`+ slug);
    if (response) {
      return this.reducer({...response});
    }
    return response;
  }

  /**
   * findByNsfw.
   * @param {ID} id id
   * @return {Boolean} An object under GraphQL schema
   */
  async findByNsfw(id) {
    return await this.get(`/v1/user/story/findByNsfw/`+ id);
  }

  /**
   * getRelateStoryByPhotoId.
   * @param {ID} photoIds photoIds
   * @return {Object} An object under GraphQL schema
   */
  async getRelateStoryByPhotoId(photoIds) {
    const qs = {
      photoIds: photoIds,
    };
    const response = await this.get(`/v1/user/story/getRelateStoryByPhotoId`, qs);
    if (response) {
      return response.map((obj) => {
        return this.reducer(obj);
      });
    }
  }

  /**
   * deleteStory.
   * @param {ID} storyIds storyId
   */
  async deleteStory(storyIds) {
    const qs = {
      storyIds: storyIds,
    };
    return await this.get(`v1/user/story/batchDelete`, qs);
  }

  /**
   * deleteStory.
   * @param {*} input
   */
  async updateStoryPrivacy(input) {
    const qs = {
      storyIds: input.storyIds,
      privacy: input.privacy,
    };
    return await this.get(`v1/user/story/batchUpdatePrivacy`, qs);
  }

  /**
   * feature a story.
   * @param {ID} storyId storyId
   */
  async featureStory(storyId) {
    const response = await this.put(`v1/admin/story/feature/${storyId}`);
    if (response) {
      return this.reducer({...response});
    }
    return response;
  }

  /**
   * unFeature a story.
   * @param {ID} storyId storyId
   */
  async unFeatureStory(storyId) {
    const response = await this.put(`v1/admin/story/unFeature/${storyId}`);
    if (response) {
      return this.reducer({...response});
    }
    return response;
  }

  /**
   * Get the count for profile.
   * @param {Number} userId
   * @param {Boolean} isAdmin
   */
  async countForProfile(userId, isAdmin) {
    const response = await this.get(`/internal/graphql/stories/${userId}/count?isAdmin=` + isAdmin);
    return response;
  }
}
