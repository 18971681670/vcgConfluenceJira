/* eslint-disable */
import {Node} from '../base/node';

/**
 * CustomDomain Class
 */
export class CustomDomain extends Node {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'domains';
  }

  /**
   * Folder type
   */
  get resourceType() {
    return 'CustomDomain';
  }

  /**
   * Map API response
   * @param {DomainResponse} obj An item from API response
   * @return {Domain} An object under GraphQL schema
   */
  reducer(obj) {
    return {
      ...super.reducer(obj),
      legacyId: obj.id,
      fqdn: obj.hostName,
      status: obj.status,
      resourceId: obj.resourceId,
      invalidationDate: obj.status === "PENDING" ? obj.invalidationDate : null,
      __parentId: obj.parentId,
      __validationRecordId: obj.validationRecordId,
    };
  }

  validationRecordReducer(obj) {
    return {
      host: obj.recordHost,
      type: obj.recordType,
      data: obj.recordValue,
      status: obj.validationStatus,
    }
  }

  /**
   * Get by FQDN.
   * @param {*} fqdn
   */
  async getCustomDomainByFQDN(fqdn) {
    const {domain} = await this.get(`internal/domains/getByHostname`, this.tidyQuery({hostname: fqdn}));
    return this.reducer(domain);
  }

  /**
   * Get custom domains.
   * @param {*} portfolioId
   */
  async getByPortfolioId(portfolioId) {
    const {domain} = await this.get(`internal/domains/getByPortfolioId`, this.tidyQuery({id: portfolioId}));
    return this.reducer(domain);
  }

  /**
   * Bulk load data.
   * @param {*} keys
   */
  async bulkLoadData(keys) {
    const {domains} = await this.get(`internal/domains/getByIds`, this.tidyQuery({ids: keys}));
    return keys.map(key => domains[key]);
  }

  /**
   * Create custom domain.
   * @param {*} customDomainInput
   * @param {*} portfolioId
   */
  async createCustomDomain(hostName, resourceId, validationToken, fromHover=false) {
    const body = {
      hostName,
      resourceId,
    };

    if (validationToken !== null) {
      body['validationToken'] = validationToken;
    }

    const {domain} = await this.post(`internal/domains/?fromHover=${fromHover}`, body);
    return this.reducer(domain);
  }

  /**
   * Create custom domain from Hover.
   * @param {*} customDomainInput
   * @param {*} portfolioId
   */
  async createCustomDomainForHover(hostName, resourceId, validationToken) {
    return this.createCustomDomain(hostName, resourceId, validationToken, true);
  }

  /**
   * Submit for verification.
   * @param {*} legacyId
   */
  async submitDomainForVerification(legacyId) {
    const {domain} = await this.post(`internal/domains/${legacyId}/status?status=PENDING`);
    return this.reducer(domain);
  }

  /**
   * Delete custom domain.
   * @param {*} legacyId
   */
  async deleteCustomDomain(legacyId) {
    const {domain} = await this.delete(`internal/domains/${legacyId}`);
    return this.reducer(domain);
  }

  /**
   * Get the validation records for a domain
   * @param {string} legacyId
   */
  async getValidationRecordsForDomain(legacyId) {
    const {domainValidationRecords} = await this.get(`/internal/validation/records/${legacyId}`);
    return domainValidationRecords.map((record) => this.validationRecordReducer(record));
  }

  /**
   * Create a new validation token for the portfolio
   * @param {string} portfolioId
   */
  async createCustomDomainValidationToken(portfolioId) {
    return await this.post(`/internal/validation/token?resourceId=${portfolioId}`);
  }
}
