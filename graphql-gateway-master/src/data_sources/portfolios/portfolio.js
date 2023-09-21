import {Node} from '../base/node';

/**
 * API representing Portfolio objects from portfolios
 *
 * @typedef {Object} VisibilityOptions
 * @property {boolean} location
 * @property {boolean} pxProfile
 * @property {boolean} facebook
 * @property {boolean} instagram
 * @property {boolean} twitter
 *
 * @typedef {Object} PortfolioLocation
 * @property {string} city
 * @property {string} country
 *
 * @typedef {Object} PortfolioSocialMedia
 * @property {string} twitter
 * @property {string} instagram
 * @property {string} facebook
 *
 * @typedef {Object} PortfolioAPIResponse
 * @property {string} userId
 * @property {string} status
 * @property {string} title
 * @property {string} description
 * @property {string} deactivatedMessage
 * @property {string} coverPhotoId
 * @property {string} coverVersion
 * @property {string} themeName
 * @property {string} font
 * @property {string} colour
 * @property {string} appearance
 * @property {string} termsOfUseType
 * @property {string} termsOfUseUrl
 * @property {string} privacyPolicyType
 * @property {string} privacyPolicyUrl
 * @property {boolean} userBanned
 * @property {boolean} userLostPermission
 * @property {VisibilityOptions} visibilityOptions
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {PortfolioLocation} location
 * @property {PortfolioSocialMedia} socialMedia
 * @property {string} email
 *
 * @typedef {Object} Portfolio
 * @property {string} id
 * @property {string} status
 * @property {string} title
 * @property {string} description
 * @property {string} deactivatedMessage
 * @property {string} font
 * @property {string} colour
 * @property {string} appearance
 * @property {VisibilityOptions} visibilityOptions
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {PortfolioLocation} location
 * @property {PortfolioSocialMedia} socialMedia
 * @property {string} email
 * @property {{legacyId: number}} coverPhoto
 * @property {number} __userId
 * @property {string} __themeName
 * @property {string} __termsOfUseType
 * @property {string} __termsOfUseUrl
 * @property {string} __privacyPolicyType
 * @property {string} __privacyPolicyUrl
 * @property {string} __coverVersion
 * @property {boolean} __userBanned
 * @property {boolean} __userLostPermission
 */
export class Portfolio extends Node {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'portfolios';
  }

  /**
   * Portfolio type
   */
  get resourceType() {
    return 'Portfolio';
  }

  /**
   * Map API response
   * @param {PortfolioAPIResponse} obj An item from API response
   * @return {Portfolio} An object under GraphQL schema
   */
  reducer(obj) {
    obj.id = obj.userId;
    return {
      ...super.reducer(obj),
      legacyId: obj.userId,
      status: obj.status,
      title: obj.title,
      description: obj.description,
      deactivatedMessage: obj.deactivatedMessage,
      font: obj.font,
      colour: obj.colour,
      appearance: obj.appearance,
      visibilityOptions: obj.visibilityOptions,
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt,
      analyticsCode: obj.analyticsCode,
      location: obj.location,
      socialMedia: obj.socialMedia,
      email: obj.email,
      __coverPhotoId: obj.coverPhotoId,
      __coverVersion: obj.coverVersion,
      __themeName: obj.themeName,
      __userId: obj.userId,
      __termsOfUseType: obj.termsOfUseType,
      __termsOfUseUrl: obj.termsOfUseUrl,
      __privacyPolicyType: obj.privacyPolicyType,
      __privacyPolicyUrl: obj.privacyPolicyUrl,
      __folderIds: obj.folders,
      __userBanned: obj.userBanned,
      __userLostPermission: obj.userLostPermission,
    };
  }

  /**
   * Bulk load data.
   * @param {string[]} keys
   * @return {PortfolioAPIResponse[]} Non-reduced theme responses
   */
  async bulkLoadData(keys) {
    const resp = await this.get(`internal/portfolios/getByIds`, this.tidyQuery({ids: keys}));
    return keys.map((key) => resp.portfolios[key]);
  }


  /**
   * upload Presigned
   */
  async uploadPresignedPortfolioCover() {
    const response = await this.post('internal/portfolios/upload/presigned', {});
    return {
      directUpload: {
        url: response.presigned_post.url,
        fields: JSON.stringify(response.presigned_post.fields),
      },
      objectName: response.object_name,
    };
  }


  /**
   * Create a new portfolio.
   *
   * @typedef {Object} PortfolioCreateBody
   * @property {string} title
   * @property {string} description
   * @property {string} themeName
   *
   * @param {number} portfolioId
   * @param {PortfolioCreateBody} createBody
   * @return {Portfolio} The newly created portfolio
   */
  async create(portfolioId, createBody) {
    const resp = await this.post(`internal/portfolios/${portfolioId}`, createBody);
    return this.reducer(resp.portfolio);
  }

  /**
   * Updates an existing portfolio.
   *
   * @typedef {Object} PortfolioUpdateBody
   * @property {string} title
   * @property {string} description
   * @property {string} deactivatedMessage
   * @property {string} coverPhotoId
   * @property {string} themeName
   * @property {VisibilityOptions} visibilityOptions
   *
   * @param {string} portfolioId
   * @param {PortfolioUpdateBody} updateBody
   * @return {Portfolio} The updated portfolio
   */
  async update(portfolioId, updateBody) {
    const resp = await this.patch(`internal/portfolios/${portfolioId}`, updateBody);
    return this.reducer(resp.portfolio);
  }

  /**
   * Deletes an existing portfolio.
   *
   * @param {string} portfolioId
   * @return {Portfolio} The updated portfolio
   */
  async del(portfolioId) {
    const resp = await this.delete(`internal/portfolios/${portfolioId}`);
    return this.reducer(resp.portfolio);
  }

  /**
   * Activates a portfolio.
   *
   * @param {string} portfolioId
   * @return {Portfolio} The activated portfolio
   */
  async activate(portfolioId) {
    const resp = await this.post(`internal/portfolios/${portfolioId}/activate`);
    return this.reducer(resp.portfolio);
  }

  /**
   * Deactivates a portfolio.
   *
   * @typedef {{deactivatedMessage: string}} DeactivateBody
   *
   * @param {string} portfolioId
   * @param {DeactivateBody} body
   * @return {Portfolio} The deactivated portfolio
   */
  async deactivate(portfolioId, body) {
    const resp = await this.post(`internal/portfolios/${portfolioId}/deactivate`, body);
    return this.reducer(resp.portfolio);
  }

  /**
   * Reorder folders within a portfolio.
   *
   * @param {*} portfolioId
   * @param {*} folderId
   * @param {*} afterId
   */
  async reorderFoldersInPortfolio(portfolioId, folderId, afterId=null) {
    const resp = await this.post(`internal/portfolios/${portfolioId}/folders/reorder?folderId=${folderId}${afterId ? `&afterId=${afterId}` : ''}`);
    return this.reducer(resp.portfolio);
  }
};
