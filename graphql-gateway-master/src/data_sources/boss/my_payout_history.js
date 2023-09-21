import {API} from '../base/api';
import {internalToGlobalId} from '../../utils/global_id';

/**
 * Paginated API for Payout History resources belonging to current user
 */
export class MyPayoutHistorys extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'boss';
  }

  /**
   * Get a paginated list of Photo Sales Historys resources belonging to current user
   * @param {Object} pagination The legacy page-base pagination
   * @param {number} pagination.pageNum The page number, starting from 1.
   * @param {number} pagination.pageSize The number of items in a page.
   */
  async paginatedPayoutHistorysList({pageNum, pageSize}) {
    /*
     * TODO: Temporary workaround for microservice auth issues
     * microservice returns all galleries for everyone if user is null
     */
    const userId = this.currentUserId;

    if (null == userId) {
      return {
        __payoutHistorys: [],
        totalCount: 0,
      };
    }

    const qs = {
      page: pageNum,
      size: pageSize,
    };

    const response = await this.get(`/internal/graphql/boss/my/payouthistory`, this.tidyQuery(qs));
    const __payoutHistorys = response.data.data.map((obj) => {
      return {
        id: internalToGlobalId('boss.payout', obj.id),
        legacyId: obj.id,
        reference: obj.reference,
        amount: obj.amount,
        payoutStatus: obj.state,
        paidDate: obj.paidDate,
        payoutDate: obj.payoutDate,
        salesCount: obj.salesCount,
      };
    });
    return {
      __payoutHistorys,
      totalCount: response.data.totalNum,
    };
  }

  /**
   * Get a paginated list of Photo Sales Historys resources belonging to current user
   * @param {Object} pagination The legacy page-base pagination
   * @param {number} pagination.pageNum The page number, starting from 1.
   * @param {number} pagination.pageSize The number of items in a page.
   */
  async paginatedPayoutHistorysListV2({pageNum, pageSize}) {
    /*
     * TODO: Temporary workaround for microservice auth issues
     * microservice returns all galleries for everyone if user is null
     */
    const userId = this.currentUserId;

    if (null == userId) {
      return {
        __payoutHistorys: [],
        totalCount: 0,
      };
    }

    const qs = {
      page: pageNum,
      size: pageSize,
    };

    const response = await this.get(`/internal/graphql/boss/my/payouthistoryV2`, this.tidyQuery(qs));
    const __payoutHistorys = response.data.data.map((obj) => {
      return {
        id: internalToGlobalId('boss.payout', obj.id),
        legacyId: obj.id,
        reference: obj.reference,
        amount: obj.amount,
        payoutStatus: obj.state,
        paidDate: obj.paidDate,
        payoutDate: obj.payoutDate,
        salesCount: obj.salesCount,
      };
    });
    return {
      __payoutHistorys,
      totalCount: response.data.totalNum,
    };
  }
}
