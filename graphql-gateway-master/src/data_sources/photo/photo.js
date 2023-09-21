import {Node} from '../base/node';
import {reverseLookupTable} from '../../utils/misc';
import DataLoader from 'dataloader/index';
import {logger} from '../../utils/logger';

export const PRIVACY_MAPPING = {
  0: 'UNLISTED',
  1: 'LIMITED_ACCESS',
  2: 'PROFILE',
  3: 'VISIBLE',
  4: 'ALL',
};

export const PRIVACY_REVERSE_MAPPING = reverseLookupTable(PRIVACY_MAPPING);

export const CATEGORY_MAPPING = {
  10: 'ABSTRACT',
  29: 'AERIAL',
  11: 'ANIMALS',
  5: 'BLACK_AND_WHITE',
  31: 'BOUDOIR',
  1: 'CELEBRITIES',
  9: 'CITY_AND_ARCHITECTURE',
  15: 'COMMERCIAL',
  16: 'CONCERT',
  20: 'FAMILY',
  14: 'FASHION',
  2: 'FILM',
  24: 'FINE_ART',
  23: 'FOOD',
  3: 'JOURNALISM',
  8: 'LANDSCAPES',
  12: 'MACRO',
  18: 'NATURE',
  30: 'NIGHT',
  4: 'NUDE',
  7: 'PEOPLE',
  19: 'PERFORMING_ARTS',
  17: 'SPORT',
  6: 'STILL_LIFE',
  21: 'STREET',
  26: 'TRANSPORTATION',
  13: 'TRAVEL',
  22: 'UNDERWATER',
  27: 'URBAN_EXPLORATION',
  25: 'WEDDING',
  0: 'UNCATEGORIZED',
};


export const CATEGORY_REVERSE_MAPPING = reverseLookupTable(CATEGORY_MAPPING);

/**
 * API representing Photo from photo
 */
export class Photo extends Node {
  /**
   * Instantiate a data loader instance for the API to batch queries in the same event loop
   */
  constructor() {
    super();
    const that = this;

    this.dataLoaderForAdmin = new DataLoader(async (keys) => {
      const items = await that.bulkLoadDataForAdmin(keys);
      return items.map((item) => (item ? that.reducer(item) : null));
    }, {maxBatchSize: 100});

    // FIXME: This is kind of a roundabout way to do it
    this.dataLoaderInGallery = new DataLoader(async (keys) => {
      const items = await that.bulkLoadDataInGallery(keys);
      return items.map((item) => (item ? that.reducer(item) : null));
    }, {maxBatchSize: 100});

    this.dataLoaderAllActive = new DataLoader(async (keys) => {
      const items = await that.bulkLoadDataForAdminActiveOnly(keys);
      return items.map((item) => (item ? that.reducer(item) : null));
    }, {maxBatchSize: 100});

    this.dataLoaderExcludeNsfw = new DataLoader(async (keys) => {
      const items = await that.bulkLoadDataExcludeNsfw(keys);
      return items.map((item) => (item ? that.reducer(item) : null));
    }, {maxBatchSize: 100});

    this.dataLoaderResubmit = new DataLoader(async (keys) => {
      const items = await that.bulkLoadDataInGalleryAndResubmit(keys);
      return items.map((item) => (item ? that.reducer(item) : null));
    }, {maxBatchSize: 100});
  }

  /**
   * Find a node by ID
   * @param {Any} internalId The id of a GraphQL node
   * @return {Object} The API response for this GraphQL node
   */
  async findByInternalIdForAdmin(internalId) {
    logger.debug(`${this.resourceType}.findByInternalIdForAdmin is called`, {internalId});
    if (!!internalId) {
      return await this.dataLoaderForAdmin.load(internalId);
    } else {
      return null;
    }
  }

  /**
   * Find a set of nodes by a list of IDs
   * @param {Array} internalIds A list of IDs to query
   * @return {Array} An array of API response
   */
  async findByInternalIdsForAdmin(internalIds) {
    logger.debug(`${this.resourceType}.findByInternalIdsForAdmin is called`, {internalIds});
    return await this.dataLoaderForAdmin.loadMany(internalIds);
  }

  /**
   * Find anactive node by ID
   * @param {Any} internalId An ID to query
   * @return {Object} An array of API response
   */
  async findByInternalIdAllActive(internalId) {
    logger.debug(`${this.resourceType}.findByInternalIdAllActive is called`, {internalId});
    return await this.dataLoaderAllActive.load(internalId);
  }


  /**
   * Find a all active nodes by a list of IDs
   * @param {Array} internalIds A list of IDs to query
   * @return {Array} An array of API response
   */
  async findByInternalIdsAllActive(internalIds) {
    logger.debug(`${this.resourceType}.findByInternalIdsAllActive is called`, {internalIds});
    return await this.dataLoaderAllActive.loadMany(internalIds);
  }


  /**
   * Find a set of nodes by a list of legacy ids in a gallery
   * @param {Array} internalIds A list of IDs to query
   * @return {Array} An array of API response
   */
  async findByInternalIdsInGallery(internalIds) {
    logger.debug(`${this.resourceType}.findByInternalIdsInGallery is called`, {internalIds});
    return await this.dataLoaderInGallery.loadMany(internalIds);
  }

  /**
   * Find a set of nodes by a list of legacy ids excluding NSFW photos
   * @param {Array} internalIds A list of IDs to query
   * @return {Array} An array of API response
   */
  async findByInternalIdsExcludeNsfw(internalIds) {
    logger.debug(`${this.resourceType}.findByInternalIdsExcludeNsfw is called`, {internalIds});
    return await this.dataLoaderExcludeNsfw.loadMany(internalIds);
  }


  // eslint-disable-next-line require-jsdoc
  async findByInternalIdsInGalleryAndResubmit(internalIds) {
    logger.debug(`${this.resourceType}.findByInternalIdsInGalleryAndResubmit is called`, {internalIds});
    return await this.dataLoaderResubmit.loadMany(internalIds);
  }
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'photo';
  }

  /**
   * Get the unique resource type, which will be used for generate global
   * resource ID
   * @return {string} The name of microservice in K8
   */
  get resourceType() {
    return 'Photo';
  }

  /**
   * Whether a resource is queryable through the `node` or `nodeByLegacyId` queries.
   * @return {Boolean} Whether the resource is queryable. `false` by default.
   */
  get queryable() {
    return true;
  }

  /**
   * Compute the caching hint for a Photo resource.
   *
   * For resources owned by *individual community users*, make sure three different kinds traffic are differentiated:
   * 1) Anonymous visitors: make use `scope: PUBLIC` is used;
   * 2) Logged-in visitors who are not the resource owner: make use `scope: PRIVATE` is used;
   * 3) Logged-in resource owner: make use `scope: PRIVATE` is used.
   *
   * For resources not owned by individual users (i.e., *created by 500px operational team*), such as Quests,
   * Membership Subscriptions, and etc, we can set `scope: PUBLIC`. For some draft resources, you may want to set
   * `scope: PRIVATE`.
   *
   * @param {*} obj The object
   * @return {CacheHint} Caching hint
   */
  cacheHint(obj) {
    if (!this.currentUserId) {
      // anonymous
      return {
        maxAge: 600,
        scope: 'PUBLIC',
      };
    } else if (this.currentUserId != obj.user_id) {
      // logged-in but not the owner
      return {
        maxAge: 600,
        scope: 'PRIVATE',
      };
    } else {
      // logged-in and the owner
      return {
        maxAge: 0,
        scope: 'PRIVATE',
      };
    }
  }

  /**
   * Map API response to Photo schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    return {
      ...super.reducer(obj),

      name: obj.name,
      category: CATEGORY_MAPPING[obj.category],
      description: obj.description,
      uploadedAt: obj.created_at,
      longitude: obj.longitude,
      latitude: obj.latitude,
      location: obj.location,

      width: obj.width,
      height: obj.height,

      takenAt: obj.taken_at,
      aperture: obj.aperture,
      shutterSpeed: obj.shutter_speed,
      focalLength: obj.focal_length,
      iso: obj.iso,
      showExifData: obj.show_exif_data,

      notSafeForWork: (obj.nsfw || obj.category == CATEGORY_REVERSE_MAPPING.NUDE ||
          obj.category == CATEGORY_REVERSE_MAPPING.BOUDOIR),
      watermark: !!obj.watermark,
      privacy: PRIVACY_MAPPING[obj.privacy_level],

      __uploaderUserId: obj.user_id,
      __lensInExif: obj.lens,
      __lensId: obj.lens_id,
      __cameraInExif: obj.camera,
      __cameraId: obj.camera_id,
      __location: obj.location,
    };
  }

  /**
   * Aysnc bulk fetch information of Photo resources
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadData(keys) {
    const qs = {
      ids: keys.join(','),
    };

    const response = await this.get(`internal/graphql/photos/findByIds`, qs);
    return this.processResponse(keys, response);
  }


  /**
   * Aysnc bulk fetch information of Photo resources for admin
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadDataForAdmin(keys) {
    const qs = {
      ids: keys.join(','),
      isAdmin: true,
    };

    const response = await this.get(`internal/graphql/photos/findByIds`, qs);
    return this.processResponse(keys, response);
  }

  /**
   * Aysnc bulk fetch information of Photo resources for admin
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadDataForAdminActiveOnly(keys) {
    const qs = {
      ids: keys.join(','),
      isAdmin: true,
      excludeNonActive: true,
    };

    const response = await this.get(`internal/graphql/photos/findByIds`, qs);
    return this.processResponse(keys, response);
  }

  /**
   * Async bulk fetch information of Photo resources excluding NSFW photos
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadDataExcludeNsfw(keys) {
    const qs = {
      ids: keys.join(','),
      excludeNsfw: true,
    };

    const response = await this.get(`internal/graphql/photos/findByIds`, qs);
    return this.processResponse(keys, response);
  }

  /**
   * Aysnc bulk fetch information of Photo resources in gallery
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadDataInGallery(keys) {
    const qs = {
      ids: keys.join(','),
      inGallery: true,
    };

    const response = await this.get(`internal/graphql/photos/findByIds`, qs);
    return this.processResponse(keys, response);
  }

  // eslint-disable-next-line require-jsdoc
  async bulkLoadDataInGalleryAndResubmit(keys) {
    const qs = {
      ids: keys.join(','),
      inGallery: true,
      resubmit: true,
    };

    const response = await this.get(`internal/graphql/photos/findByIds`, qs);
    return this.processResponse(keys, response);
  }
  /**
   * Create photo resource
   * @param {Object} input Creation params
   * @param {String} input.privacy photo privacy
   * @param {Boolean} input.autoPublish photo privacy
   */
  async create(input) {
    const mappingConfig = {
      convertedMapping: {
        privacy: {
          conversion: PRIVACY_REVERSE_MAPPING,
        },
        autoPublish: {
          fieldName: 'auto_activate',
        },
      },
    };

    const body = this.inputToBody(input, mappingConfig);
    const response = await this.post('internal/graphql/photos', body);

    return {
      photo: this.reducer(response.graphql_photo),
      directUpload: {
        url: response.presigned_post.url,
        fields: JSON.stringify(response.presigned_post.fields),
      },
      keywordKey: response.keyword_key,
    };
  }

  /**
   * Update photo resource
   * @param {Number} internalId Internal photo id
   * @param {Object} input Creation params
   */
  async update(internalId, input, {autoPublish}) {
    const mappingConfig = {
      camelToSnakeMapping: [
        'name',
        'description',
        'longitude',
        'latitude',
        'location',
        'takenAt',
        'aperture',
        'shutterSpeed',
        'focalLength',
        'iso',
        'camera',
        'lens',
        'width',
        'height',
        'watermark',
        'showExifData',
      ],
      convertedMapping: {
        notSafeForWork: {
          fieldName: 'nsfw',
        },
        privacy: {
          conversion: PRIVACY_REVERSE_MAPPING,
        },
        category: {
          conversion: CATEGORY_REVERSE_MAPPING,
        },
      },
    };

    const body = this.inputToBody(input, mappingConfig);

    if (autoPublish) {
      body.publish = true;
    }

    const response = await this.patch(`internal/graphql/photos/${internalId}`, body);
    return this.reducer(response);
  }

  /**
   * Update photo resource
   * @param {Number} internalId Internal photo id
   * @param {Object} input Creation params
   * @param {Object} createLicensingPhoto Creation params
   */
  async updateExPrivacy(internalId, input, {autoPublish}, createLicensingPhoto) {
    let mappingConfig;
    if (createLicensingPhoto) {
      mappingConfig = {
        camelToSnakeMapping: [
          'name',
          'description',
          'longitude',
          'latitude',
          'location',
          'takenAt',
          'aperture',
          'shutterSpeed',
          'focalLength',
          'iso',
          'camera',
          'lens',
          'width',
          'height',
          'watermark',
          'showExifData',
        ],
        convertedMapping: {
          notSafeForWork: {
            fieldName: 'nsfw',
          },
          privacy: {
            conversion: PRIVACY_REVERSE_MAPPING,
          },
          category: {
            conversion: CATEGORY_REVERSE_MAPPING,
          },
        },
      };
    } else {
      mappingConfig = {
        camelToSnakeMapping: [
          'name',
          'description',
          'longitude',
          'latitude',
          'location',
          'takenAt',
          'aperture',
          'shutterSpeed',
          'focalLength',
          'iso',
          'camera',
          'lens',
          'width',
          'height',
          'watermark',
          'showExifData',
        ],
        convertedMapping: {
          notSafeForWork: {
            fieldName: 'nsfw',
          },
          privacy: {
            conversion: PRIVACY_REVERSE_MAPPING,
          },
          category: {
            conversion: CATEGORY_REVERSE_MAPPING,
          },
        },
      };
    }

    const body = this.inputToBody(input, mappingConfig);

    if (autoPublish) {
      body.publish = true;
    }

    const response = await this.patch(`internal/graphql/photos/${internalId}`, body);
    return this.reducer(response);
  }

  /**
   * Delete photo resource
   * @param {Number} internalId Internal photo id
   */
  async destroy(internalId) {
    await this.delete(`internal/graphql/photos/${internalId}`);
  }

  /**
   * mark photo nsfw
   * @param {Number} internalId Internal photo id
   * @param {Object} input nsfw params
   */
  async updatePhotoNsfw(internalId, input) {
    const body = {nsfw: input.nsfw};
    await this.post(`internal/graphql/photos/${internalId}/nsfw`, body);
  }

  /**
   * mark photo private
   * @param {Number} internalId Internal photo id
   * @param {Object} input privacy level params
   */
  async updatePhotoPrivacy(internalId, input) {
    const mappingConfig = {
      convertedMapping: {
        privacy: {
          conversion: PRIVACY_REVERSE_MAPPING,
        },
      },
    };

    const body = this.inputToBody(input, mappingConfig);
    await this.post(`internal/graphql/photos/${internalId}/privacy`, body);
  }

  /**
   * mark photo private
   * @param {Number} internalId Internal photo id
   * @param {Object} input categorize params
   */
  async updatePhotoCategory(internalId, input) {
    const mappingConfig = {
      convertedMapping: {
        category: {
          conversion: CATEGORY_REVERSE_MAPPING,
        },
      },
    };
    const body = this.inputToBody(input, mappingConfig);
    await this.post(`internal/graphql/photos/${internalId}/category`, body);
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
