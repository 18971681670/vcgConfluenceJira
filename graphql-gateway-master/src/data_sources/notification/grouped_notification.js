import {Node} from '../base/node';
import {logger} from '../../utils/logger';

const ITEM_TYPENAME_MAPPING = {
  photos: 'Photo',
  users: 'User',
  quests: 'Quest',
  resources: 'Resource',
  domains: 'CustomDomain',
};

/**
 * API representing GroupedNotification from notification
 */
export class GroupedNotification extends Node {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'notification';
  }

  /**
   * Get the unique resource type, which will be used for generate global
   * resource ID
   * @return {string} The name of microservice in K8
   */
  get resourceType() {
    return 'GroupedNotification';
  }

  /**
   * find typename
   * @param {Object} obj zzz
   * @return {String} xx
   */
  findTypename(obj) {
    switch (obj.actions[0]) {
      case 'photo_comment':
      case 'photo_comment_mention':
        return 'GroupedNotificationItemPhotoComment';
      case 'photo_added_to_gallery':
        return 'GroupedNotificationItemGalleryItem';
      case 'photo_selected_for_shortlist':
        return 'GroupedNotificationItemPhotoQuest';
      case 'quest_winners_selected':
        return 'GroupedNotificationItemQuestPhoto';
      default:
        return ITEM_TYPENAME_MAPPING[obj.items_type];
    }
  }
  /**
   * Map API response to GroupedNotification schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    obj.id = `${obj.date}--${obj.actions[0]}`;

    return {
      ...super.reducer(obj),

      actions: obj.actions.map((v) => v.toUpperCase()),
      timestamp: obj.date,
      read: obj.has_been_read,

      __actorUserIds: obj.actors,
      __itemInternalIds: obj.items,
      __itemTypename: this.findTypename(obj),
    };
  }

  /**
   * Aysnc bulk fetch information of GroupedNotification resources
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadData(keys) {
    // TODO Please add your code to call the microservice
    const qs = {
      ids: keys.join(','),
      queryOne: true,
    };

    const response = await this.get(`internal/graphql/groupedNotifications/findByIds`, qs);

    const lookupById = response.reduce(function(map, obj) {
      map[obj.id] = obj;
      return map;
    }, {});

    return keys.map((id) => {
      return (lookupById[id] || null);
    });
  }
}
