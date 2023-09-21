import {API} from '../base/api';

/**
 * CampaignSignup API
 */
export class CampaignSignup extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'contest';
  }

  /**
   * Map API response to Campaign schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    return {
      userId: obj.user_id,
      signupEmail: obj.signup_email,
      campaignName: obj.campaign_name,
      subscribed: obj.subscribed,
      token: obj.token,
    };
  }

  /**
   * Subscribe to campaign emails
   * @param {String} signupEmail - email that may or may not belong to a user
   * @param {String} campaignName - name of the campaign
   * @return {Object} subscription data
   */
  async subscribe(signupEmail, campaignName) {
    const body = {
      signup_email: signupEmail,
      campaign_name: campaignName,
    };
    const response = await this.post('/campaign/subscribe', body);
    return this.reducer(response);
  }

  /**
   * Unsubscribe from campaign emails
   * @param {String} token - a uuid token
   * @return {Object} subscription data
   */
  async unsubscribe(token) {
    const response = await this.post('/campaign/unsubscribe', {token});
    return this.reducer(response);
  }
}
