/* eslint-disable camelcase */
import {Node} from '../base/node';
import {ValidationError} from 'apollo-server-core';
/**
 * API representing Resource from workshop
 */
export class Resource extends Node {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'workshops';
  }

  /**
   * Resource is resource.
   */
  get resourceType() {
    return 'Resource';
  }

  /**
   * Map API response
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    let __resolveType;
    switch (obj.resourceType) {
      case 'WORKSHOP':
        __resolveType = 'WorkshopResource';
        break;
      case 'OTHER':
        __resolveType = 'OtherResource';
        break;
      case 'LIVESTREAM':
        __resolveType = 'LivestreamResource';
        break;
      case 'ARTICLE':
        __resolveType = 'ArticleResource';
        break;
      case 'VIDEO':
        __resolveType = 'VideoResource';
        break;
      default:
        __resolveType = 'WorkshopResource';
    }

    const {payment, schedule = {}, location = {}} = obj;
    const {startTime = null, timeZone = null} = schedule ? schedule : {};
    const {url, locationId} = location;

    return {
      ...super.reducer(obj),

      payment,
      title: obj.title,
      link: url,
      state: obj.resourceState,
      resourceScheduled: obj.resourceScheduled,
      description: obj.description,
      startTime: startTime,
      timeZone: timeZone,
      mixedDateCursor: obj.mixedDateCursor,
      customResourceType: obj.customResourceType,
      customResourceSlug: obj.customResourceSlug,
      coverVersion: obj.coverVersion,

      __creatorUserId: obj.userId,
      __coverPhotoId: obj.coverPhotoId || process.env.RESOURCE_COVER_PHOTO,
      __locationId: locationId,
      __resolveType,
    };
  }

  /**
   * Bulk load data.
   * @param {keys} keys
   */
  async bulkLoadData(keys) {
    const resources = [];
    return keys.map((key) => resources[key]);
  }

  /**
   * Get by slug.
   * @param {*} userid
   * @param {*} slug
   */
  // eslint-disable-next-line no-unused-vars,require-jsdoc
  async getResourceByUserIdAndSlug(userid, slug) {
    return null;
  }

  /**
   * Get by user id
   * @param {*} userid
   * @param {*} size
   * @param {*} cursor
   * @param {*} before
   * @param {*} upcomingOnly
   */
  // eslint-disable-next-line no-unused-vars,require-jsdoc
  async getResourcesByUserid(userid, size, cursor, before, upcomingOnly) {
    const resources = [];
    return resources.map((resource) => this.reducer(resource));
  }

  /**
   * Get the paging info.
   * @param {*} userid
   * @param {*} cursor
   * @param {*} size
   * @param {*} upcomingOnly
   */
  // eslint-disable-next-line no-unused-vars,require-jsdoc
  async getUserIdPageInfo(userid, cursor, size, upcomingOnly) {
    return {
      totalCount: 0,
      remaining: 0,
    };
  }
  /**
   * upload Presigned
   */
  async uploadPresignedResourceCover() {
    return {
      directUpload: {
        url: '',
        fields: JSON.stringify({}),
      },
      objectName: '',
    };
  }

  /**
   * Create resource.
   * @param {Object} resource
   */
  // eslint-disable-next-line no-unused-vars,require-jsdoc
  async createResource(resource) {
    return null;
  }

  /**
   * Create & Publish resource.
   * @param {Object} resource
   */
  // eslint-disable-next-line no-unused-vars,require-jsdoc
  async createAndPublishResource(resource) {
    return null;
  }

  /**
   * Update resource.
   * @param {Object} resource
   */
  async updateResource(resource) {
    if (!resource.legacyId) throw new ValidationError('legacyId is required for update');
    return null;
  }

  /**
   * Update & Publish resource.
   * @param {Object} resource
   */
  async updateAndPublishResource(resource) {
    if (!resource.legacyId) throw new ValidationError('legacyId is required for update & publish');
    return null;
  }

  /**
   * Publish resource by id.
   * @param {*} id
   */
  // eslint-disable-next-line no-unused-vars,require-jsdoc
  async publishResource(id) {
    return null;
  }

  /**
   * Unpublish resource by id.
   * @param {*} id
   */
  // eslint-disable-next-line no-unused-vars,require-jsdoc
  async unpublishResource(id) {
    return null;
  }

  /**
   * Delete resource by ids.
   * @param {*} ids
   */
  // eslint-disable-next-line no-unused-vars,require-jsdoc
  async deleteResources(ids) {
    return [];
  }

  /**
   * Get view stats for a resource
   * @param {*} legacyId
   */
  // eslint-disable-next-line no-unused-vars,require-jsdoc
  async getResourceViewStats(legacyId) {
    return null;
  }

  /**
   * Get user draft resource count.
   */
  async getUserDraftResourceCount() {
    return 0;
  }

  /**
   * Feature a resource
   * @param {*} legacyId
   */
  // eslint-disable-next-line no-unused-vars,require-jsdoc
  async featureResource(legacyId) {
    return null;
  }

  /**
   * Unfeature a resource
   * @param {*} legacyId
   */
  // eslint-disable-next-line no-unused-vars,require-jsdoc
  async unfeatureResource(legacyId) {
    return null;
  }

  /**
   * Get feature date
   * @param {*} legacyId
   */
  // eslint-disable-next-line no-unused-vars,require-jsdoc
  async getFeatureDate(legacyId) {
    return null;
  }
}
