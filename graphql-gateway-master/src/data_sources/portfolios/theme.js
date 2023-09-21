import {Node} from '../base/node';

/**
 * API representing Theme from portfolios
 *
 * @typedef {{url: string, size: string}} ImageUrl
 *
 * @typedef {Object} ThemeAPIResponse
 * @property {string} name
 * @property {string} description
 * @property {string} defaultFont
 * @property {string} defaultColour
 * @property {string} defaultAppearance
 * @property {ImageUrl[]} imageUrls
 *
 * @typedef {Object} Theme
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} defaultFont
 * @property {string} defaultColour
 * @property {string} defaultAppearance
 * @property {ImageUrl[]} imageUrls
 */
export class Theme extends Node {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'portfolios';
  }

  /**
   * Theme type
   */
  get resourceType() {
    return 'Theme';
  }

  /**
   * Map API response
   * @param {ThemeAPIResponse} obj An item from API response
   * @return {Theme} An object under GraphQL schema
   */
  reducer(obj) {
    obj.id = obj.name;
    return {
      ...super.reducer(obj),
      name: obj.name,
      description: obj.description,
      defaultFont: obj.defaultFont,
      defaultColour: obj.defaultColour,
      defaultAppearance: obj.defaultAppearance,
      imageUrls: obj.imageUrls,
    };
  }

  /**
   * Bulk load data.
   * @param {string[]} keys
   * @return {Object<string, ThemeAPIResponse>} Non-reduced theme responses
   */
  async bulkLoadData(keys) {
    const themes = await this.get(`internal/themes/getByNames`, this.tidyQuery({names: keys}));
    return keys.map((key) => themes.themes[key]);
  }

  /**
   * List all themes.
   *
   * @param {string[]} sizes
   * @return {Theme[]} list of all themes
   */
  async listThemes(sizes) {
    const qs = this.tidyQuery({
      sizes: sizes,
    });
    const themes = await this.get('internal/themes/', qs);
    return themes.themes.map((theme) => this.reducer(theme));
  }
}
