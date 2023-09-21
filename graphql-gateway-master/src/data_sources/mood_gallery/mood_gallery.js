import {Node} from '../base/node';
import {reverseLookupTable} from '../../utils/misc';

export const PHOTO_SORT_TYPE = {
  0: 'RECENTLY_ADDED_DESC',
  1: 'RECENTLY_ADDED_ASC',
  2: 'IMPRESSIONS_DESC',
  3: 'IMPRESSIONS_ASC',
  4: 'HIGHEST_PULSE_DESC',
  5: 'HIGHEST_PULSE_ASC',
};

export const PHOTO_SORT_TYPE_MAPPING = reverseLookupTable(PHOTO_SORT_TYPE);

export const MOOD_STATUS = {0: 'CREATED', 1: 'PUBLISHED', 2: 'ARCHIVE'};

/**
 * API representing Gallery from gallery
 */
export class MoodGallery extends Node {
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
    return 'MoodGallery';
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
      title: obj.title,
      description: obj.description,
      photosNumber: obj.photo_number,
      keywords: obj.keywords ? obj.keywords.split(',') : [],
      photoSortType: obj.photo_sort_type ? PHOTO_SORT_TYPE[obj.photo_sort_type] : PHOTO_SORT_TYPE[0],
      createdAt: obj.created_at,
      updatedAt: obj.updated_at,
      lastPublishedAt: obj.latest_publish_date,
      firstPublishedAt: obj.publish_date,
      archiveSince: obj.archive_since,
      status: obj.status ? MOOD_STATUS[obj.status] : MOOD_STATUS[0],
      canonicalPath: obj.custom_path,
      __creatorUserId: obj.created_by,
    };
  }


  /**
   * moodInputToBody.
   * @param {Object} input An object under GraphQL schema
   * @return {Object} api requestDody
   */
  moodInputToBody(input) {
    if (input.photoSortType) {
      input.photoSortType = PHOTO_SORT_TYPE_MAPPING[input.photoSortType];
    }
    const mappingConfig = {
      camelToSnakeMapping: [
        'moodId',
        'title',
        'description',
        'photoNumber',
        'keywords',
        'photoSortType',
      ],
    };

    const body = this.inputToBody(input, mappingConfig);

    if (input && input.items) {
      const itemMappingConfig = {
        camelToSnakeMapping: [
          'moodId',
          'photoId',
          'photoPulse',
          'photoImpression',
          'createdAt',
          // 'changeStatus',
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
    return body;
  }

  /**
   * saveAsDraft or saveAndPublish.
   * @param {Object} input An object under GraphQL schema
   * @param {Boolean} isPublish saveAndPublish
   * @param {Boolean} isOverrideLastMood when isPublish=true and there is a mood with the same title, choose whether override last mood
   * @return {Object} An item from API response
   */
  async saveMood(input, isPublish, isOverrideLastMood) {
    const body = this.moodInputToBody(input);

    let response;
    if (isPublish) {
      // saveAndPublish
      response = await this.post(`/v1/admin/moodGallery/saveAndPublish?isOverride=` + isOverrideLastMood, body);
      if (response.status == 403) {
        response['hasLiveMoodWithSameTitle'] = true;
      }
    } else {
      // saveAsDraft
      response = await this.post(`/v1/admin/moodGallery/saveAsDraft`, body);
    }
    if (response && response.status == 200) {
      response['moodId'] = response.data;
    }
    return response;
  }

  /**
   * changeMoodToArchive.
   * @param {Array} moodIds moodIds
   * @return {Object} An item from API response
   */
  async changeMoodToArchive(moodIds) {
    const response = await this.post(`/v1/admin/moodGallery/batchChangeToArchive`, moodIds);
    return response;
  }


  /**
   *  getMoodDetailById.
   * @param {ID} moodId moodId
   * @return {Object} An object under GraphQL schema
   */
  async getMoodDetailById(moodId) {
    const response = await this.get(`/v1/user/moodGallery/getDetailById/` + moodId);
    if (response) {
      return this.reducer({...response});
    }
    return response;
  }


  /**
   *  getMoodDetailBySlug.
   * @param {String} customPath customPath
   * @return {Object} An object under GraphQL schema
   */
  async getMoodDetailBySlug(customPath) {
    const response = await this.get(`/v1/user/moodGallery/getDetailByCustomPath/` + customPath);
    if (response) {
      return this.reducer({...response});
    }
    return response;
  }


  /**
   * getMoodDetailByIdForAdmin.
   * @param {ID} moodId moodId
   * @return {Object} An object under GraphQL schema
   */
  async getMoodDetailByIdForAdmin(moodId) {
    const response = await this.get(`/v1/admin/moodGallery/getDetailById/`+ moodId);
    if (response) {
      return this.reducer({...response});
    }
    return response;
  }

  /**
   * pageMoodGalleryList
   * @param {String} status
   * @param {String} sort
   * @param {number} page
   * @param {number} size
   * @return {*} MoodGallery list
   */
  async pageMoodGalleryList(status, sort, page, size) {
    const qs = {
      page: page,
      size: size,
      sort,
      status,
    };
    const userId = this.currentUserId;
    if (null == userId) {
      return {
        __moodGalleries: [],
        totalCount: 0,
      };
    }
    const response = await this.get(`/v1/admin/moodGallery/page`, this.tidyQuery(qs));
    const __moodGalleries = response.mood_galleries.map((obj) => {
      return this.reducer(obj);
    });
    return {
      __moodGalleries,
      totalCount: response.total_items,
    };
  }


  /**
   * publishedMoodList.
   * @param {number} page
   * @param {number} size
   * @return {*} MoodGallery list
   */
  async publishedMoodList(page, size) {
    const qs = {
      page: page,
      size: size,
    };
    const response = await this.get(`/v1/user/moodGallery/publishedMoodList`, this.tidyQuery(qs));
    const __moodGalleries = response.mood_galleries.map((obj) => {
      return this.reducer(obj);
    });
    return {
      __moodGalleries,
      totalCount: response.total_items,
    };
  }

  // eslint-disable-next-line require-jsdoc
  async getByIds(mooIds) {
    const response = await this.post(`/v1/user/moodGallery/listMood`, mooIds);

    const responseMap = new Map(response.map((item) => [item.id, this.reducer(item)]));
    return mooIds.map((c) => {
      return responseMap.get(c);
    });
  }

  // eslint-disable-next-line require-jsdoc
  async bulkLoadData(keys) {
    const response = await this.post(`/v1/user/moodGallery/listMood`, keys);
    return this.processResponse(keys, response);
  }

  /**
   * aiGenerateTitle.
   * @param {String} uuid uuid
   * @return {object} An item from API response
   */
  async aiGenerateTitle(uuid) {
    const response = await this.get(`/v1/admin/moodGallery/aiGenerateTitle?uuid=` + uuid);
    return response;
  }

  // eslint-disable-next-line require-jsdoc
  async countPhotosAddedToGallery(id, resourceType) {
    const qs = {
      id: id,
      resourceType: resourceType,
    };
    const response = await this.get(`/v1/admin/moodGallery/stat/count`, this.tidyQuery(qs));
    return response;
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
}
