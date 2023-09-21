import {API} from '../base/api';

/**
 * Contact Class
 */
export class Contact extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'portfolios';
  }

  /**
   * Send a portfolio contact
   * @param {Object} contactRequest
   */
  async sendContact(contactRequest) {
    const resp = await this.post(`internal/portfolios/contact/send`, contactRequest);
    return resp;
  }
};
