import {Node} from '../base/node';
import {logger} from '../../utils/logger';

export const MODEL_RELEASE_INVITATION_STATUS_MAPPING = {
  0: 'PENDING',
  1: 'SIGNED',
  2: 'REJECTED',
  3: 'REJECTED_PHOTO',
};

/**
 * API representing ModelRelease from licensing
 */
export class ModelReleaseMetadata extends Node {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'licensing';
  }

  /**
   * Get the unique resource type, which will be used for generate global
   * resource ID
   * @return {string} The name of microservice in K8
   */
  get resourceType() {
    return 'ModelReleaseMetadata';
  }

  /**
   * Map API response to ModelReleaseMetadata schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    return {
      ...super.reducer(obj),
      invitationLink: obj.sign_path,
      feedbacks: obj.feedback_list || [],
      __licensingPhotoId: obj.licensing_photo_id,
      firstName: obj.firstname,
      lastName: obj.lastname,
      status: MODEL_RELEASE_INVITATION_STATUS_MAPPING[obj.status],

      dateOfBirth: obj.birthday,
      gender: obj.gender,
      ethnicities: obj.ethnicity&&obj.ethnicity.split(','),
      email: obj.email,
      countryCode: obj.country_code,
      country: obj.country,
      phone: obj.phone,
      streetAddress: obj.street_address,
      city: obj.city,
      province: obj.province,
      zipCode: obj.zip_code,
      guardianFirstName: obj.guardian_firstname,
      guardianLastName: obj.guardian_lastname,

      takenCountry: obj.taken_country,
      takenProvince: obj.taken_province,
      takenCity: obj.taken_city,
      photographerFirstName: obj.photographer_firstname,
      photographerLastName: obj.photographer_lastname,
      shootDescription: obj.shoot_description,
      takenAt: obj.taken_at,
    };
  }


  /**
   * Aysnc bulk fetch information of ModelRelease resources
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadData(keys) {
    const qs = {
      ids: keys.join(','),
    };

    const response = await this.get(`internal/graphql/modelReleasesMetadata/findByIds`, qs);

    return keys.map((id) => {
      return (response[id] || null);
    });
  }


  /**
   * Aysnc fetch information of ModelRelease invitation
   * @param {String} token model release invitation token
   * @return {Promise<ModelReleaseMetadata>} A promise which will return ModelReleaseMetadata
   */
  async loadDataByToken(token) {
    const qs = {
      tokens: [token],
    };
    const response = await this.get(`internal/graphql/modelReleasesMetadata/findByTokens`, qs);
    return response[token] ? this.reducer(response[token]) : null;
  }

  /**
   * Aysnc fetch information of ModelRelease invitation
   * @param {String} token model release invitation token
   * @return {Promise<ModelReleaseMetadata>} A promise which will return ModelReleaseMetadata
   */
  async loadDataByTokenV2(token) {
    const qs = {
      tokens: [token],
    };
    const response = await this.get(`internal/graphql/modelReleases/findByTokens`, qs);
    return response[token] ? this.siblingDataSources.modelRelease.reducer(response[token]) : null;
  }


  /**
   * reject ModelRelease Invitation resource
   * @param {Object} input
   * @return {Object}  Model Release Invitation resource
   */
  async rejectModelReleaseInvitation(input) {
    const body = {
      feedback_list: input.feedbacks,
      feedback: input.otherMessage,
    };

    const response = await this.post(`internal/graphql/modelReleasesMetadata/${input.token}/reject`, body);
    return response ? this.reducer(response) : null;
  }


  /**
   * permission ModelRelease Invitation resource
   * @param {Object} input
   * @return {Object}  Model Release Invitation resource
   */
  async permissionModelReleaseInvitation(input) {
    const body = {
      firstname: input.firstName,
      lastname: input.lastName,
      birthday: input.dateOfBirth,
      gender: input.gender,
      ethnicity: input.ethnicities.join(','),
      email: input.email,
      country_code: input.countryCode,
      phone: input.phone,
      street_address: input.streetAddress,
      city: input.city,
      province: input.province,
      country: input.country,
      zip_code: input.zipCode,
      guardian_firstname: input.guardianFirstName,
      guardian_lastname: input.guardianLastName,


    };

    const response = await this.post(`internal/graphql/modelReleasesMetadata/${input.token}/sign`, body);
    return response ? this.reducer(response) : null;
  }
}
