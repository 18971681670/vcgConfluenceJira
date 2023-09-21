import {API} from '../base/api';
import {internalToGlobalId} from '../../utils/global_id';

export const EXCLUSIVE_MAPPING = {
  '1': 'Exclusive',
  '0': 'Non-exclusive',
  'n': 'Non-exclusive',
  'e': 'Exclusive',
};

export const SALE_SOURCE_MAPPING = {
  'GETTY_IMAGES': '1',
  'VCG': '2',
  'OTHER': '3',
  'CONNECT_SALES': '4',
};


export const SALE_PAYOUT_STATUS_MAPPING = {
  'AVAILABLE_REQUEST': 'available_request',
  'REQUESTED': 'requested',
  'PAID': 'paid',
};


/**
 * Paginated API for Sales History resources belonging to current user
 */
export class MySalesHistorys extends API {
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
   * @param {number} year the sale history year for query
   * @param {string} source the sale history source for query
   * @param {string} territory the sale history territory area for query
   * @param {string} payoutStatus the sale history payoutStatus for query
   */
  async paginatedSalesHistorysList({pageNum, pageSize}, year, source, territory, payoutStatus) {
    /*
     * TODO: Temporary workaround for microservice auth issues
     * microservice returns all galleries for everyone if user is null
     */
    const userId = this.currentUserId;

    if (null == userId) {
      return {
        __salesHistorys: [],
        totalCount: 0,
      };
    }

    const qs = {
      page: pageNum,
      size: pageSize,
      year: year,
      source: SALE_SOURCE_MAPPING[source],
      territory: territory,
      payoutStatus: SALE_PAYOUT_STATUS_MAPPING[payoutStatus],
    };

    const response = await this.get(`/internal/graphql/boss/my/salehistory`, this.tidyQuery(qs));
    const __salesHistorys = response.data.data.map((obj) => {
      return {
        id: internalToGlobalId('boss.sales', obj.id),
        legacyId: obj.id,
        photoId: obj.resourceId,
        photoThumbnailUrl: obj.thumbnailUrl,
        saleDate: obj.transactionDate,
        source: obj.distributionPartnerName,
        salesTerritory: obj.salesTerritory,
        exclusived: EXCLUSIVE_MAPPING[obj.exclusive],
        sharePercentage: obj.sharePercentage,
        earning: obj.contributorShare,
        payStatus: obj.payoutStatus,
      };
    });
    return {
      __salesHistorys,
      totalCount: response.data.totalNum,
    };
  }

  // eslint-disable-next-line valid-jsdoc
  /**
   * Get a paginated list of Photo Sales Details resources belonging to current user
   * @param {Object} pagination The legacy page-base pagination
   * @param {number} pagination.pageNum The page number, starting from 1.
   * @param {number} pagination.pageSize The number of items in a page.
   * @param {ID} photoId the sale history payoutStatus for query
   */
  async paginatedSalesDetailsList({pageNum, pageSize}, photoId) {
    const userId = this.currentUserId;

    if (null == userId) {
      return {
        __salesDetails: [],
        totalCount: 0,
      };
    }

    const qs = {
      page: pageNum,
      size: pageSize,
      photoId: photoId,
    };

    const response = await this.get(`/internal/graphql/boss/my/saledetail`, this.tidyQuery(qs));
    const __salesDetails = response.data.data.map((obj) => {
      return {
        id: internalToGlobalId('boss.sales', obj.id),
        legacyId: obj.id,
        photoId: obj.resourceId,
        saleDate: obj.transactionDate,
        source: obj.source,
        sharePercentage: obj.sharePercentage,
        earning: obj.contributorShare,
        payStatus: obj.payoutStatus,
      };
    });
    return {
      __salesDetails,
      totalCount: response.data.totalNum,
    };
  }

  /**
   * Get a sum stat of Photo Sales Historys resources belonging to current user
   * @param {number} year the sale history year for query
   * @param {string} source the sale history source for query
   * @param {string} territory the sale history territory area for query
   * @param {string} payoutStatus the sale history payoutStatus for query
   */
  async sumSaleHistory(year, source, territory, payoutStatus) {
    /*
     * TODO: Temporary workaround for microservice auth issues
     * microservice returns all galleries for everyone if user is null
     */
    const userId = this.currentUserId;

    if (null == userId) {
      return {
        totalSum: 0,
      };
    }

    const qs = {
      year: year,
      source: SALE_SOURCE_MAPPING[source],
      territory: territory,
      payoutStatus: SALE_PAYOUT_STATUS_MAPPING[payoutStatus],
    };

    const response = await this.get(`/internal/graphql/boss/my/salesum`, this.tidyQuery(qs));
    const __totalSum = response.data;

    return __totalSum;
  }

  /**
   * Get a sum stat of Photo Sales Historys resources belonging to current user
   * @param {ID} photoId the sale history payoutStatus for query
   */
  async saleTotalEarnings(photoId) {
    /*
     * TODO: Temporary workaround for microservice auth issues
     * microservice returns all galleries for everyone if user is null
     */
    const userId = this.currentUserId;

    if (null == userId) {
      return {
        totalEarnings: 0,
      };
    }

    const qs = {
      photoId: photoId,
    };

    const response = await this.get(`/internal/graphql/boss/photo/totalearnings`, this.tidyQuery(qs));
    const __totalEarnings = response.data;

    return __totalEarnings;
  }
}
