import {Node} from '../base/node';
import {logger} from '../../utils/logger';
import {reverseLookupTable} from '../../utils/misc';

export const PRIVACY_MAPPING = {
  0: 'PUBLIC',
  1: 'PRIVATE',
};

export const PRIVACY_REVERSE_MAPPING = reverseLookupTable(PRIVACY_MAPPING);

/**
 * API representing Gallery from gallery
 */
export class Gallery extends Node {
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
    return 'Gallery';
  }

  /**
   * Whether a resource is queryable through the `node` or `nodeByLegacyId` queries.
   * @return {Boolean} Whether the resource is queryable. `false` by default.
   */
  get queryable() {
    return true;
  }

  /**
   * Map API response to Gallery schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    return {
      ...super.reducer(obj),

      name: obj.name,
      description: obj.description,
      privacy: obj.privacy ? 'PRIVATE' : 'PUBLIC',

      notSafeForWork: obj.nsfw,
      ownPhotosOnly: obj.kind == 4,

      publicSlug: obj.privacy ? null: obj.custom_path,
      privateToken: obj.privacy ? obj.token : null,

      externalUrl: obj.external_url,
      buttonName: obj.button_name,

      lastPublishedAt: obj.published_date,

      __creatorUserId: obj.user_id,
      __coverPhotoId: obj.cover_photo_id,

      updatedAt: obj.updated_at,
      createdAt: obj.created_at,
      editorsChoiceFlag: null != obj.editors_choice,
      itemsCount: obj.items_count,

    };
  }

  /**
   * Get the count for profile.
   * @param {Number} userId
   * @param {Boolean} isAdmin
   */
  async countForProfile(userId, isAdmin) {
    const response = await this.get(`/internal/graphql/galleries/${userId}/count?isAdmin=` + isAdmin);
    return response;
  }

  /**
   * Aysnc bulk fetch information of Gallery resources
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadData(keys) {
    const qs = {
      ids: keys.join(','),
    };

    // eslint-disable-next-line max-len
    const response = await this.get(`internal/graphql/galleries/findByIds`, qs);

    return keys.map((id) => {
      return (response[id] || null);
    });
  }

  /**
   * Aysnc bulk fetch information of Gallery resources, except null.
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async getByIds(keys) {
    const qs = {
      ids: keys.join(','),
    };

    // eslint-disable-next-line max-len
    const response = await this.get(`internal/graphql/galleries/findByIds`, qs);

    const rets = [];
    keys.map((id) => {
      if (response[id]) {
        rets.push(this.reducer(response[id]));
      }
    });
    return rets;
  }

  /**
   * Get gallery by userId and customPath resource
   * @param {String} ownerLegacyId - the gallery owner legacy Id
   * @param {String} slug - the gallery customPath
   * @return {Object} Gallery resource
   */
  async getByOwnerIdAndSlug(ownerLegacyId, slug) {
    /*
     * CurrentUserId is required in the API, but if the user is not logged in
     * the header should be an empty string
     */
    const currentUserId = this.currentUserId || '';

    const response = await this.get(
        `internal/graphql/user/${ownerLegacyId}/galleries/${slug}`,
        null,
        {
          headers: {
            'x-500px-user-id': currentUserId,
          },
        },
    );
    return this.reducer(response);
  }

  /**
   * Get private gallery by token
   * @param {String} token - the gallery token
   * @return {Object} Gallery resource
   */
  async getByToken(token) {
    const currentUserId = this.currentUserId || '';

    const response = await this.get(
        `/internal/graphql/galleries/${token}`,
        null,
        {
          headers: {
            'x-500px-user-id': currentUserId,
          },
        },
    );
    return this.reducer(response);
  }

  /**
   * Create Gallery resource
   * @param {Object} input Creation params
   * @param {String} input.sampleFieldFromInput Sample input 1
   * @param {Boolean} input.anotherField Sample input 2
   * @param {String} input.thirdField Sample input 3
   * @return {Object} A newly created Gallery resource
   */
  async create(input) {
    const body = this.inputToBody(input, {
      camelToSnakeMapping: [
        'name',
        'description',
      ],
      convertedMapping: {
        publicSlug: {
          fieldName: 'custom_path',
        },
        privacy: {
          conversion: (value) => {
            return value.toLowerCase();
          },
        },
      },
    });

    // eslint-disable-next-line max-len
    const response = await this.post('internal/graphql/galleries', body);
    return this.reducer(response.gallery);
  }

  /**
   * Create Specialty Gallery resource
   * @param {String} name
   * @return {Object} A newly created Gallery resource
   */
  async createSpecialty(name) {
    return await this.post(`internal/api/galleries/simple?name=${name}&kind=6`);
  }

  /**
   * Update Gallery resource
   * @param {Number} internalId Internal Gallery ID
   * @param {Object} input Update params
   * @param {String} input.sampleFieldFromInput Sample input 1
   * @param {Boolean} input.anotherField Sample input 2
   * @param {String} input.thirdField Sample input 3
   * @return {Object} A newly updated Gallery resource
   */
  async update(internalId, input) {
    const body = this.inputToBody(input, {
      camelToSnakeMapping: [
        'name',
        'description',
        'coverPhotoId',
      ],
      convertedMapping: {
        publicSlug: {
          fieldName: 'custom_path',
        },
        privacy: {
          conversion: (value) => {
            return value.toLowerCase();
          },
        },
      },
    });

    // eslint-disable-next-line max-len
    const response = await this.patch(`internal/graphql/galleries/${internalId}`, body);
    return this.reducer(response);
  }

  /**
   * Delete Gallery resource
   * @param {Number} internalId Internal Gallery ID
   */
  async destroy(internalId) {
    // eslint-disable-next-line max-len
    await this.delete(`internal/graphql/galleries/${internalId}`);
  }

  /**
   * Delete Special Gallery resource
   * @param {Number} galleryId Internal Gallery id
   */
  async deleteSpecial(galleryId) {
    return await this.delete(`internal/api/galleries/special/${galleryId}`);
  }

  /**
   * Get a paginated list of Gallery resources belonging to specific user
   * @param {Object}  pagination The legacy page-base pagination
   * @param {number}  pagination.pageNum The page number, starting from 1.
   * @param {number}  pagination.pageSize The number of items in a page.
   * @param {ID}      userId the id of owner of galleries.
   * @param {String}  sort Sorting option
   * @param {String}  search Fuzzy name searching option
   * @param {Boolean} showNude Includes nsfw photos in response
   */
  async paginatedPublicGalleryList({pageNum, pageSize}, userId, sort, search, showNude = false) {
    const qs = {
      page: pageNum,
      size: pageSize,
      name: search,
      sort,
      showNude,
    };

    const response = await this.get(`internal/graphql/${userId}/galleries`, this.tidyQuery(qs));
    const __galleries = response.galleries.map((obj) => {
      return this.siblingDataSources.gallery.reducer(obj);
    });

    return {
      __galleries,
      totalCount: response.total_items,
    };
  }

  /**
   * get recommend gallery ids
   *
   * @param {Object} pagination The legacy page-base pagination
   * @param {number} pagination.pageNum The page number, starting from 1.
   * @param {number} pagination.pageSize The number of items in a page.
   */
  async recommendGalleries({pageNum, pageSize}) {
    const qs = {
      page: pageNum,
      rpp: pageSize,
    };
    const resp = await this.get(`/v1/user/gallery/recommend`, this.tidyQuery(qs));
    return {
      __ids: resp.ids,
      totalCount: resp.total_items,
    };
  }

  /**
   * upadte a gallery's externalUrl and buttonName.
   * @param {Object} input the update input parameter
   * @param {ID} input.galleryLegacyId the id of a gallery.
   * @param {String} input.externalUrl the external gallery url to update.
   * @param {String} input.buttonName the gallery button name to update.
   */
  async updateExternalUrl(input) {
    const body = this.inputToBody(input, {
      camelToSnakeMapping: [
        'externalUrl',
        'buttonName',
      ],
      convertedMapping: {
        galleryLegacyId: {
          fieldName: 'id',
        },
      },
    });
    await this.put(`/internal/graphql/gallery/externalUrl`, body);
  }

  /**
   * publish a gallery.
   * @param {ID} galleryLegacyId the id of a gallery to publish.
   */
  async publishGallery(galleryLegacyId) {
    await this.post(`/internal/graphql/gallery/publish?id=${galleryLegacyId}`);
  }
}
