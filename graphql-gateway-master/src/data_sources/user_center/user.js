import {Node} from '../base/node';
import {logger} from '../../utils/logger';
import {reverseLookupTable} from '../../utils/misc';

export const TYPE_MAPPING = {
  0: 'BASIC',
  1: 'STORE',
  3: 'PARTNER',
  6: 'MODERATOR',
  9: 'ADMIN',
  10: 'AMBASSADOR',
  11: 'VERIFIED',
  12: 'VCG',
  13: 'ALUMNUS',
};

export const TYPE_REVERSE_MAPPING = reverseLookupTable(TYPE_MAPPING);

/**
 * API representing User from user-center
 */
export class User extends Node {
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
    return 'User';
  }

  /**
   * Can be queried as nodeByLegacyId
   */
  get queryable() {
    return true;
  }

  /**
   * Compute the caching hint for a user
   * @param {*} obj The object
   * @return {*} Caching hint
   */
  cacheHint(obj) {
    if (!this.currentUserId) {
      // anonymous
      return {
        maxAge: 600,
        scope: 'PUBLIC',
      };
    } else if (this.currentUserId != obj.id) {
      // logged-in but not myself
      return {
        maxAge: 600,
        scope: 'PRIVATE',
      };
    } else {
      // logged-in and myself
      return {
        maxAge: 0,
        scope: 'PRIVATE',
      };
    }
  }

  /**
   * Map API response to User schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    const {username, firstname, lastname} = obj;
    const displayName = `${firstname} ${lastname}`.trim();

    return {
      ...super.reducer(obj),

      active: obj.active,
      city: obj.city,
      country: obj.country,
      username: obj.username,
      firstName: obj.firstname,
      lastName: obj.lastname,
      displayName: displayName ? displayName : username,
      registeredAt: obj.registration_date,
      type: TYPE_MAPPING[obj.usertype],
      hireLocations: obj.hireLocations,
      gdprAcceptanceTimestamp: obj.gdpr_acceptance_timestamp,
      havePassword: this.judgeHavePassword(obj.encrypted_password) ? true : false,

      __avatarS3Path: obj.s3_avatar,
      __avatarVersion: obj.avatar_ver,
    };
  }

  /**
   * 判读用户是否设置过密码，
   * 用google apple facebook等第三方注册时，后台会随机生成一个初始密码（长度为20的数字），且没有重置过随机密码的，逻辑上都认为没有密码.
   * @param {String} password 密码
   * @return {boolean} 是否设置过密码
   */
  judgeHavePassword(password) {
    if (!password || (password.length == 20 && !isNaN(Number(password, 10)))) {
      return false;
    }
    return true;
  }

  /**
   * Aysnc bulk fetch information of User resources
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadData(keys) {
    const qs = {
      ids: keys.join(','),
      withDeleted: true,
    };
    const response = await this.get(`internal/graphql/users/findByIds`, qs);
    return keys.map((id) => {
      return response[id];
    });
  }

  /**
   *
   * @param {*} username Username of a user
   */
  async findByUsername(username) {
    return this.reducer(await this.get(`internal/graphql/users/findByUsername`, {username}));
  }

  /**
   * Fetch the cover photo url for user
   * @param {String} userId id of a user
   */
  async getUserCoverPhotoUrl(userId) {
    return await this.get(`internal/graphql/users/${userId}/coverPhotoUrl`);
  }

  /**
   *
   * @param {*} internalId
   * @param {*} input
   */
  async update(internalId, input) {
    const body = this.inputToBody(input, {
      camelToSnakeMapping: [
        'username',
        'gdpr',
      ],
      convertedMapping: {
        firstName: {
          fieldName: 'firstname',
        },
        lastName: {
          fieldName: 'lastname',
        },
      },
    });

    const response = await this.patch(`internal/graphql/users/${internalId}`, body);
    return this.reducer(response);
  }
}
