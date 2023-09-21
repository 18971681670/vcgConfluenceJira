import {reverseLookupTable} from '../../utils/misc';
import {Node} from '../base/node';


export const LOCALE_MAPPING = {
  'en': 'EN',
  'zh-CN': 'ZH_CN',
  'pt-BR': 'PT_BR',
  'tr': 'TR',
  'ru': 'RU',
  'ko': 'KO',
  'it': 'IT',
  'fr': 'fr',
  'es': 'ES',
  'de': 'DE',
  'ja': 'JA',
};

export const LOCALE_REVERSE_MAPPING = reverseLookupTable(LOCALE_MAPPING);

/**
 * API representing UserSetting from user_profile
 */
export class UserSetting extends Node {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'sitewide-setting';
  }

  /**
   * Get the unique resource type, which will be used for generate global
   * resource ID
   * @return {string} The name of microservice in K8
   */
  get resourceType() {
    return 'UserSetting';
  }


  /**
   * Map API response to UserSetting schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    return {
      ...super.reducer(obj),
      // from JSON fields to GraphQL schema fields
      showNude: obj.show_nude,
      isContactable: obj.is_contactable,
      analyticsCode: obj.analytics_code,
      onboardingCategories: obj.onboarding_categories,
      locale: LOCALE_MAPPING[obj.locale],
      firstnameVisible: obj.firstname_visible != null ? obj.firstname_visible : true,
      locationVisible: obj.location_visible != null ? obj.location_visible : true,
    };
  }

  /**
   * Update UserSetting resource
   * @param {Number} internalId Internal UserSetting ID
   * @param {UserSetting} input Update params
   */
  async update(internalId, input) {
    const body = this.inputToBody(input, {
      camelToSnakeMapping: [
        'id',
        'gdpr',
        'showNude',
        'isContactable',
        'analyticsCode',
        'onboardingCategories',
        'firstnameVisible',
        'locationVisible',
      ],
      convertedMapping: {
        locale: {
          conversion: LOCALE_REVERSE_MAPPING,
        },
      },
    });

    // eslint-disable-next-line max-len
    const response = await this.patch(`internal/graphql/sitewide-setting/${internalId}`, body);
    return this.reducer({
      ...response,
      id: internalId,
    });
  }

  /**
   * Get the user settings within the given id
   * @param {internalId} internalId Internal User ID
   * @return {UserSetting}
   */
  async loadData(internalId) {
    const response = await this.get(`internal/graphql/sitewide-setting/${internalId}`);
    return this.reducer({
      ...response,
      id: internalId,
    });
  }
}
