import {reverseLookupTable} from '../../utils/misc';
import {Node} from '../base/node';

export const SEX_MAPPING = {
  0: 'GENDER_NOT_SPECIFIED',
  1: 'MALE',
  2: 'FEMALE',
};

export const SEX_REVERSE_MAPPING = reverseLookupTable(SEX_MAPPING);

/**
 * API representing PersonalAndProfile from user_profile
 */
export class PersonalAndProfile extends Node {
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
    return 'PersonalAndProfile';
  }

  /**
   * Map API response to PersonalAndProfile schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    return {
      ...super.reducer(obj),
      sex: SEX_MAPPING[obj.sex],
      username: obj.username,
      email: obj.email,
      firstname: obj.firstname,
      lastname: obj.lastname,
      birthday: obj.birthday,
      about: obj.about,
      city: obj.city,
      state: obj.state,
      country: obj.country,
      havePassword: this.judgeHavePassword(obj.encrypted_password),
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
   * Map API response to Auth schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducerAuth(obj) {
    return {
      ...super.reducer(obj),
      twitter: obj.twitter,
      facebook: obj.facebook,
      googleOauth2: obj.google_oauth2,
    };
  }

  /**
   * Get the user info within the given id
   * @param {int} __internalId
   * @return {PersonalAndProfile}
   */
  async loadData(__internalId) {
    const response = await this.get(`internal/graphql/userProfile/personalAndProfile`, {userid: __internalId});
    return this.reducer({
      ...response,
      id: __internalId,
    });
  }

  /**
   * Get the userAuthInfo within the given id
   * @param {int} __internalId
   * @return {Auth}
   */
  async loadAuthData(__internalId) {
    const response = await this.get(`internal/graphql/userProfile/auth`);
    return this.reducerAuth({
      ...response,
      id: __internalId,
    });
  }

  /**
   * Update user info
   * @param {PersonalAndProfile} personalAndProfile
   */
  async update(personalAndProfile) {
    const body = this.inputToBody(personalAndProfile, {
      camelToSnakeMapping: [
        'id',
        'username',
        'sex',
        'email',
        'firstname',
        'lastname',
        'birthday',
        'about',
        'city',
        'country',
        'state',
        'hireLocations',
      ],
      convertedMapping: {
        sex: {
          conversion: SEX_REVERSE_MAPPING,
        },
      },
    });

    // eslint-disable-next-line max-len
    const response = await this.patch(`internal/graphql/userProfile/personalAndProfile`, body);

    return this.reducer(response);
  }

  /**
   * get user by email. if user not exist return null.
   * @param {String!} email the email of user.
   * @return {Object} exist user or null.
   */
  async getByEmail(email) {
    return await this.get(`internal/graphql/userProfile/getByEmail?email=${email}`);
  }
}
