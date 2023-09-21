import {Node} from '../base/node';
import {logger} from '../../utils/logger';

/**
 * API representing ExtendedUser from user-center
 */
export class ExtendedUser extends Node {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'userprofile';
  }

  /**
   * Get the unique resource type, which will be used for generate global
   * resource ID
   * @return {string} The name of microservice in K8
   */
  get resourceType() {
    return 'ExtendedUser';
  }

  /**
   * Map API response to User schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    obj.id = obj.user_id;
    return {
      ...super.reducer(obj),

      onboardingStep: obj.onboarding_step,
      tfaEnabled: obj.tfa_enabled,
      coverPhotoId: obj.cover_photoId,
      coverUploadedAt: obj.cover_uploaded_at,
    };
  }


  /**
   * Aysnc bulk fetch information of ExtendedUser resources
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadData(keys) {
    const qs = {
      ids: keys.join(','),
    };

    const response = await this.get(`internal/graphql/extendedUsers/findByIds`, qs);

    return keys.map((id) => {
      if (response[id]) {
        return {
          ...response[id],
          id: response[id].user_id,
        };
      }
      return null;
    });
  }

  /**
   * Update ExtendedUser resource
   * @param {Number} internalId Internal ExtendedUser ID
   * @param {Object} input Update params
   * @param {String} input.sampleFieldFromInput Sample input 1
   * @param {Boolean} input.anotherField Sample input 2
   * @param {String} input.thirdField Sample input 3
   * @return {Object} A newly updated ExtendedUser resource
   */
  async update(internalId, input) {
    const body = this.inputToBody(input, {
      /*
       * camelToSnakeMapping: [
       *   'sampleFieldFromInput',
       * ],
       */
      convertedMapping: {
        /*
         * anotherField: {
         *   fieldName: 'example_one',
         * },
         * thirdField: {
         *   conversion: SAMPLE_REVERSE_MAPPING,
         * },
         */
        onboardingStep: {
          fieldName: 'onboarding_step',
          conversion: (value) => {
            return value.toLowerCase();
          },
        },
      },
    });
    const response = await this.patch(`internal/graphql/extendedUsers/${internalId}`, body);
    return this.reducer(response);
  }
}
