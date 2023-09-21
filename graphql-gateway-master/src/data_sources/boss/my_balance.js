import {API} from '../base/api';
import {internalToGlobalId} from '../../utils/global_id';

/**
 * User earnings and sales data belonging to current user
 */
export class MyBalance extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'boss';
  }

  /**
   * Query current user balance.
   */
  async queryBalance() {
    const userId = this.currentUserId;

    if (null == userId) {
      return {};
    }

    const response = await this.get(`/internal/graphql/boss/my/balance`);

    const obj = response.data;

    const __myBalance = {
      id: internalToGlobalId('boss.balance', userId),
      totalEarnings: obj.allTimesSalesTotalSum,
      totalSales: obj.allTimesSalesTotalCnt,
      availableEarnings: obj.availabeToRequestPayoutSum,
      availableSales: obj.availabeToRequestPayoutCnt,
      pendingEarnings: obj.pendingPayoutSum,
      pendingSales: obj.pendingPayoutCnt,
    };

    return __myBalance;
  }

  /**
   * Query tipalti Iframe Url.
   */
  async queryTipaltiIframeUrls() {
    const userId = this.currentUserId;

    if (null == userId) {
      return {};
    }

    const response = await this.get(`/internal/graphql/boss/my/getTipaltiIframeUrls`);

    const obj = response.data;
    const __tipaltiUrls = {
      id: internalToGlobalId('boss.tipalti', userId),
      setupUrl: obj.setupUrl,
      invoiceHistoryUrl: obj.invoiceHistoryUrl,
      paymentHistoryUrl: obj.paymentHistoryUrl,
    };

    return __tipaltiUrls;
  }

  /**
   * tipalti payable.
   */
  async tipaltiPayable() {
    const userId = this.currentUserId;

    if (null == userId) {
      return {};
    }

    const response = await this.get(`/internal/graphql/boss/my/getTipaltiPayable`);

    const obj = response.data;
    const __tipaltiPayable = {
      id: internalToGlobalId('boss.tipaltipayable', userId),
      payable: obj.payable,
      reason: obj.reason,
    };

    return __tipaltiPayable;
  }

  /**
   * is first fill tipalti form.
   */
  async isFirstFillTipalti() {
    const userId = this.currentUserId;

    if (null == userId) {
      return true;
    }

    const response = await this.get(`/royalty/isfirstfilltipaltiform`);

    const __isFirstFill = {
      id: internalToGlobalId('boss.isfirstfill', userId),
      isFirstFill: response,
    };

    return __isFirstFill;
  }

  /**
   * tipalti setup
   */
  async tipaltiSetup() {
    const userId = this.currentUserId;

    if (null == userId) {
      return {};
    }

    const response = await this.get(`/internal/graphql/boss/my/getTipaltiSetup`);

    const obj = response.data;
    const __tipaltiSetup = {
      id: internalToGlobalId('boss.tipaltisetup', userId),
      setup: obj.payable,
      reason: obj.reason,
    };

    return __tipaltiSetup;
  }
}
