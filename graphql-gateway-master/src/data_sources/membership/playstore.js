import {Node} from '../base/node';
import {logger} from '../../utils/logger';

/**
 * API representing Verifying playstore purchase from membership
 */
export class Playstore extends Node {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'membership';
  }

  /**
   * Get the unique resource type, which will be used for generate global
   * resource ID
   * @return {string} The name of microservice in K8
   */
  get resourceType() {
    return 'Playstore';
  }

  /**
   * Verify playstore purchase.
   * @param {String} subscriptionId
   * @param {String} packageName
   * @param {String} playstoreToken
   * @return {Boolean} isVerified
   */
  async verifyPlaystorePurchase(subscriptionId, packageName, playstoreToken) {
    const body = {
      subscriptionid: subscriptionId,
      packagename: packageName,
      playstoretoken: playstoreToken,
    };

    try {
      // The response data doesn't matter. If it's a 200, the purchase is verified.
      await this.post(`v1/membership/product/playStorePurchase`, body);
      return {isVerified: true, errorCode: null};
    } catch (e) {
      const errorCode = e.extensions && e.extensions.response && e.extensions.response.body && e.extensions.response.body.error_code;
      return {isVerified: false, errorCode: errorCode};
    }
  }

  /**
   * verify apple app store endpoint.
   * @param {String} receiptData
   */
  async verifyIOSAppStorePurchase(receiptData) {
    const body = {
      receipt_data: receiptData,
    };
    try {
      const verifyResp = await this.post(`v1/membership/product/verifyReceipt`, body);
      return {isVerified: verifyResp.success, errorCode: verifyResp.status, message: verifyResp.message};
    } catch (e) {
      const errorCode = e.extensions && e.extensions.response && e.extensions.response.body && e.extensions.response.body.status;
      const message = e.extensions && e.extensions.response && e.extensions.response.body && e.extensions.response.body.message;
      return {isVerified: false, errorCode: errorCode, message: message};
    }
  }
}
