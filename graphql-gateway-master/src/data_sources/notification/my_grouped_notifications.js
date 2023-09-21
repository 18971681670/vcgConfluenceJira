import {API} from '../base/api';

/**
 * Logged-in user's licensing photo candidates
 */
export class MyGroupedNotifications extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'grouped-notifications-service';
  }

  /**
   * Get a paginated list of items in the given gallery, identified by the
   * private token
   * @param {Object} pagination The page number, starting from 1.
   * @param {String} pagination.to The backward cursor
   * @param {Number} pagination.rpp The page size
   */
  async paginatedGroupedNotificationsList({to, rpp}) {
    const qs = {
      to,
      rpp,
    };

    return await this.get(`/users/${this.currentUserId}/grouped_notifications`, this.tidyQuery(qs));
  }

  /**
   * Mark as read
   */
  async markAsRead() {
    await this.post(`/users/${this.currentUserId}/grouped_notifications/read`);
  }

  /**
   * If there is any unread notifications
   * @return {Boolean} If there is any unread notification
   */
  async haveUnreadNotifications() {
    const response = await this.get(`/users/${this.currentUserId}/unread_notifications`);
    return {
      unreadCount: response.unread ? 1 : 0,
      haveUnread: response.unread,
      unreadSince: response.unread_since,
    };
  }
}
