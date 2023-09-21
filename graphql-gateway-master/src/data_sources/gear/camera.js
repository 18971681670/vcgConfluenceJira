import {Node} from '../base/node';

export const CAMERA_TYPE_MAPPING = {
  0: 'DSLR',
  1: 'FILM',
  2: 'SMARTPHONE',
  3: 'MIRRORLESS',
  4: 'COMPACT',
  5: 'MEDIUM_FORMAT',
  6: 'FILM_SCANNER',
  7: 'ACTION_CAMERA',
  8: 'DRONE',
};

/**
 * API representing Camera from gear
 */
export class Camera extends Node {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'gear';
  }

  /**
   * Get the unique resource type, which will be used for generate global
   * resource ID
   * @return {string} The name of microservice in K8
   */
  get resourceType() {
    return 'Camera';
  }

  /**
   * Compute the caching hint
   * @return {*} Caching hint
   */
  cacheHint() {
    return {
      maxAge: 300,
      scope: 'PUBLIC',
    };
  }

  /**
   * Map API response to Camera schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    return {
      ...super.reducer(obj),
      type: CAMERA_TYPE_MAPPING[obj.camera_type],
      __name: obj.name,
      __slug: obj.slug,
      __brandId: obj.brand_id,
      features: obj.features,
      imageUrl: obj.image_url,
    };
  }

  /**
   * Aysnc bulk fetch information of Camera resources
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadData(keys) {
    const qs = {
      ids: keys.join(','),
    };

    // eslint-disable-next-line max-len
    const response = await this.get(`internal/graphql/cameras/findByIds`, qs);

    return keys.map((id) => {
      return (response[id] || null);
    });
  }

  /**
   * Aysnc fetch camera by model and brand
   * @param {String} model The gear's model name
   * @param {String} brand The gear's brand name
   * @return {Camera} The gear's ID
   */
  async getCameraIdByModelAndBrand({model, brand}) {
    const qs = {
      camera_slug: model,
      brand_slug: brand,
    };

    const {id} = await this.get(`v3/gear/cameras/findBy`, qs) || {};
    return id || null;
  }
}
