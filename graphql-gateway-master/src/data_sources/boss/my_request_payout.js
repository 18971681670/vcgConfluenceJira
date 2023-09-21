import {API} from '../base/api';

/**
 * user send payout request.
 */
export class MyRequestPayout extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'boss';
  }

  /**
   * request payout.
   */
  async requestPayout() {
    const result = await this.post(`/internal/graphql/boss/my/requestPayout`);
    if (result.code == '0') {
      return 'success';
    } else {
      return result.message;
    }
  }
}
