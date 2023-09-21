/* eslint-disable */
import {Node} from '../base/node';

export const NOTIFICATION_ACTION = {
  FOLLOW_USER: 'FOLLOW_USER',
  PHOTO_LIKE: 'PHOTO_LIKE',
  PHOTO_COMMENT: 'PHOTO_COMMENT',
  PHOTO_COMMENT_MENTION: 'PHOTO_COMMENT_MENTION',
  SELECTED_BY_EDITOR: 'SELECTED_BY_EDITOR',
  REACHED_UPCOMING: 'REACHED_UPCOMING',
  REACHED_POPULAR: 'REACHED_POPULAR',
  USER_INVITED_TO_GROUP: 'USER_INVITED_TO_GROUP',
  GROUP_DISCUSSION_CREATED: 'GROUP_DISCUSSION_CREATED',
  GROUP_DISCUSSION_COMMENT: 'GROUP_DISCUSSION_COMMENT',
  GROUP_COMMENT_REPLY: 'GROUP_COMMENT_REPLY',
  GROUP_CONTENT_FLAGGED: 'GROUP_CONTENT_FLAGGED',
  GROUP_MENTION: 'GROUP_MENTION',
  PHOTO_ADDED_TO_GALLERY: 'PHOTO_ADDED_TO_GALLERY',
  GALLERY_SELECTED_BY_EDITOR: 'GALLERY_SELECTED_BY_EDITOR',
  QUEST_STARTED: 'QUEST_STARTED',
  QUEST_LOSERS_SELECTED: 'QUEST_LOSERS_SELECTED',
  QUEST_WINNERS_SELECTED: 'QUEST_WINNERS_SELECTED',
  QUEST_7_DAY_UNLICENSED: 'QUEST_7_DAY_UNLICENSED',
  PHOTO_SELECTED_FOR_SHORTLIST: 'PHOTO_SELECTED_FOR_SHORTLIST',
  LICENSING_CHANGE_REQUIRED: 'LICENSING_CHANGE_REQUIRED',
  LICENSING_UNDER_REVIEW: 'LICENSING_UNDER_REVIEW',
  LICENSING_PENDING_MULTIPLE_PHOTOS: 'LICENSING_PENDING_MULTIPLE_PHOTOS',
  LICENSING_DECLINED: 'LICENSING_DECLINED',
  LICENSING_MODEL_RELEASE_SIGNED: 'LICENSING_MODEL_RELEASE_SIGNED',
  LICENSING_MODEL_RELEASE_REJECTED: 'LICENSING_MODEL_RELEASE_REJECTED',
  LICENSING_SUGGEST:'LICENSING_SUGGEST',
  LICENSING_SUGGEST_MULTIPLE:'LICENSING_SUGGEST_MULTIPLE',
  LICENSING_RELEASE_REQUIRED: 'LICENSING_RELEASE_REQUIRED',
  LICENSING_CR_TWO_WEEKS: 'LICENSING_CR_TWO_WEEKS',
  LICENSING_CR_THREE_MONTHS: 'LICENSING_CR_THREE_MONTHS',
  LICENSING_CR_SIX_MONTHS: 'LICENSING_CR_SIX_MONTHS',
  LICENSING_CR_REMAIN_TWO_WEEKS: 'LICENSING_CR_REMAIN_TWO_WEEKS',
  LICENSING_CR_EXPIRING_USER: 'LICENSING_CR_EXPIRING_USER',
  PHOTO_ACCEPTED_TO_LICENSING: 'PHOTO_ACCEPTED_TO_LICENSING',
  LICENSING_PHOTO_ACCEPTED: 'LICENSING_PHOTO_ACCEPTED',
  PURCHASED: 'PURCHASED',
  EARNINGS_REQUESTED: 'EARNINGS_REQUESTED',
  PHOTOGRAPHER_FEATURED: 'PHOTOGRAPHER_FEATURED',
  RESOURCE_FEATURED: 'RESOURCE_FEATURED',
  DOMAIN_CONNECTION_SUCCESS: 'DOMAIN_CONNECTION_SUCCESS',
  DOMAIN_VERIFICATION_STARTED: 'DOMAIN_VERIFICATION_STARTED',
  DOMAIN_DNS_ERRORS_FOUND: 'DOMAIN_DNS_ERRORS_FOUND',
  DOMAIN_CONNECTION_FAILING: 'DOMAIN_CONNECTION_FAILING',
  DOMAIN_CONNECTION_FAILED: 'DOMAIN_CONNECTION_FAILED',
};

export const DATA_TYPE = {
  USER: 'USER',
  PHOTO: 'PHOTO',
  QUEST: 'QUEST',
  COMMENT: 'COMMENT',
  GALLERY: 'GALLERY',
  LICENSING: 'LICENSING',
  DOMAIN: 'DOMAIN',
  PORTFOLIO: 'PORTFOLIO',
  TEXT: 'TEXT',
  MODELRELEASE: 'MODELRELEASE',
};

export const GROUPED_TYPE = {
  FOLLOW_USER_USERS: 'follow_user_users',
  PHOTO_LIKE_PHOTOS: 'photo_like_photos',
  PHOTO_LIKE_USERS: 'photo_like_users',
  PHOTO_ADD_TO_GALLERY_PHOTOS: 'photo_added_to_gallery_photos',
  PHOTO_ADD_TO_GALLERY_GALLERIES:'photo_added_to_gallery_galleries',
  LICENSING_SUGGEST_PHOTOS:'licensing_suggest_photos',
  LICENSING_CR_PHOTOS:'licensing_cr_photos',
  LICENSING_CR_REMAIN_PHOTOS:'licensing_cr_remain_photos',
};

/**
 * API representing grouped notifications
 */
export class Notification extends Node {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'notifications';
  }

  /**
   * Get the unique resource type, which will be used for generate global
   * resource ID
   * @return {string} The name of microservice in K8
   */
  get resourceType() {
    return 'Notification';
  }

  /**
   * Map API response to Notification schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    const action = obj.action && NOTIFICATION_ACTION[obj.action.toUpperCase()];
    if (!action) return {};

    return {
      ...super.reducer(obj),
      action,
      type: action,
      createdAt: obj.createDate,
      read: obj.read,
      grouped: obj.grouped,
      subNotificationInfo: obj.grouped ? obj.subNotificationResponse : null,
    };
  }

  /**
   * Extract Ids data from notification which can be either user, photo, quest,
   * comment, gallery, licensing or domain ids.
   * @param {Array} notification A list of notifcation objects
   * @param {Object} buckets Type buckets for different ids
   */
  extractIds(notification, buckets) {
    const actors = notification.actors || [];
    const actees = notification.actees || [];
    const all = [...actors, ...actees];

    all.forEach((item) => {
      switch (item.type) {
        case DATA_TYPE.USER:
          buckets.userIds.add(item.id);
            break;
        case DATA_TYPE.PHOTO:
          buckets.photoIds.add(item.id);
            break;
        case DATA_TYPE.GALLERY:
          buckets.galleryIds.add(item.id);
            break;
        case DATA_TYPE.COMMENT:
          buckets.commentIds.add(item.id);
            break;
        case DATA_TYPE.QUEST:
          buckets.questIds.add(item.id);
            break;
        case DATA_TYPE.DOMAIN:
          buckets.domainIds.add(item.id);
            break;
        case DATA_TYPE.LICENSING:
          buckets.licensingIds.add(item.id);
            break;
        case DATA_TYPE.MODELRELEASE:
          buckets.modelReleaseIds.add(item.id);
          break;
        default:
          break;
      }
    });
  }

  /**
   * Aysnc bulk fetch information of Notifications resources
   * @return {Object} reduced notifications and id buckets
   * to the exact sequence of requested keys
   */
  async paginatedNotificationList({rpp, from, grouped}) {
    const qs = {
      pageSize: rpp,
      cursor: from,
      grouped,
    };

    const notificationList = await this.get(`/internal/notifications/history`, this.tidyQuery(qs));

    return this.buildPaginatedNotificationsFromList(notificationList);
  }

  /**
   * Aysnc bulk fetch information of SubNotification resources
   * @return {Object} reduced notifications and id buckets
   * to the exact sequence of requested keys
   */
  async paginatedSubNotificationList({rpp, from, groupedType, endCursor}) {
    const qs = {
      pageSize: rpp,
      cursor: from,
      end: endCursor,
      groupedType,
    };

    const notificationList = await this.get(`/internal/notifications/history/sub`, this.tidyQuery(qs));

    return this.buildPaginatedNotificationsFromList(notificationList);
  }

  async buildPaginatedNotificationsFromList(notificationList) {
    if (!notificationList || !notificationList.notifications || notificationList.notifications.length === 0) {
      return {
        buckets: [],
        notifications: [],
        hasUnread: false,
        exclusiveStartCursor: null,
      };
    }

    const buckets = {
      photoIds: new Set(),
      userIds: new Set(),
      questIds: new Set(),
      commentIds: new Set(),
      galleryIds: new Set(),
      licensingIds: new Set(),
      domainIds: new Set(),
      modelReleaseIds: new Set(),
    };
    const notifications = [];

    notificationList.notifications.forEach((notification) => {
      if (!notification) return;
      this.extractIds(notification, buckets);

      const reducedNotification = this.reducer(notification);
      notifications.push(reducedNotification);
    });

    return {
      buckets,
      notifications,
      haveUnread: notificationList.hasUnread,
      exclusiveStartCursor: notificationList.exclusiveStartCursor,
    };
  };

  /**
   * Async fetch information of user has unread notifications
   * @return {Boolean} does user has unread notifications
   */
  async hasUnreadNotifications(userId) {
    const {hasUnread} = await this.get(`/internal/notifications/history/hasUnread`);
    return hasUnread;
  }
}
