import {API} from '../base/api';
import {reverseLookupTable} from '../../utils/misc';
import {internalToGlobalId} from '../../utils/global_id';

export const SALE_SOURCE_ID_MAPPING = {
  'GETTY_IMAGES': '1',
  'VCG': '2',
  'OTHER': '3',
  'CONNECT_SALES': '4',
};

export const SALE_SOURCE_ID_REVERSE_MAPPING = reverseLookupTable(SALE_SOURCE_ID_MAPPING);

export const SALE_SOURCE_VALUE_MAPPING = {
  '1': 'Getty Images',
  '2': 'VCG',
  '3': 'Other',
  '4': 'Connect Sales',
};

export const SALE_PAYOUT_STATUS_LIST_MAPPING = {
  'available_request': 'AVAILABLE_REQUEST',
  'requested': 'REQUESTED',
  'paid': 'PAID',
};

export const SALE_PAYOUT_STATUS_KEY_MAPPING = {
  'available_request': 'Available',
  'requested': 'Processing',
  'paid': 'Paid',
};

/**
 * User Dynamic Search Available Filter belonging to current user
 */
export class MyAvailableFilter extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'boss';
  }

  /**
   * Query current user avaiable year.
   */
  async queryAvailableFilterYear() {
    const userId = this.currentUserId;

    if (null == userId) {
      return [];
    }

    const response = await this.get(`/internal/graphql/boss/available/filter/year`);

    return response;
  }

  /**
   * Query current user available  Source
   * @param {*} year search year
   */
  async queryAvailableFilterSource(year) {
    const userId = this.currentUserId;

    if (null == userId) {
      return [];
    }

    const qs = {
      year: year,
    };

    const response = await this.get(`/internal/graphql/boss/available/filter/source`, this.tidyQuery(qs));
    if (!response) {
      return [];
    }

    const arrs = [];
    response.forEach((element) => {
      arrs.push({
        id: internalToGlobalId('boss.filter.source'+element, userId),
        value: SALE_SOURCE_ID_REVERSE_MAPPING[element],
        text: SALE_SOURCE_VALUE_MAPPING[element],
      });
    });

    return arrs;
  }

  /**
   * Query current user available Territory.
   *
   * @param {*} year     search year
   * @param {*} source   search source
   */
  async queryAvailableFilterTerritory(year, source) {
    const userId = this.currentUserId;

    if (null == userId) {
      return [];
    }

    const qs = {
      year: year,
      source: SALE_SOURCE_ID_MAPPING[source],
    };

    const response = await this.get(`/internal/graphql/boss/available/filter/territory`, this.tidyQuery(qs));

    // filter invalid address
    if (response) {
      const arr = [];
      response.forEach((element) => {
        if (element && element != 'NULL' && element != '' && element != 'null') {
          arr.push(element);
        }
      });

      return arr;
    }

    return response;
  }

  /**
   * Query current user available payout status.
   * @param {*} year      search year
   * @param {*} source    search source
   * @param {*} territory search territory
   */
  async queryAvailableFilterPayoutStatus(year, source, territory) {
    const userId = this.currentUserId;

    if (null == userId) {
      return [];
    }

    const qs = {
      year: year,
      source: SALE_SOURCE_ID_MAPPING[source],
      territory: territory,
    };

    const response = await this.get(`/internal/graphql/boss/available/filter/payoutstatus`, this.tidyQuery(qs));

    const resultResponse = [];

    if (response) {
      response.forEach((element) => {
        resultResponse.push(
            {
              id: internalToGlobalId('boss.filter.payout'+element, userId),
              text: SALE_PAYOUT_STATUS_KEY_MAPPING[element],
              value: SALE_PAYOUT_STATUS_LIST_MAPPING[element],
            },
        );
      });
    }

    return resultResponse;
  }
}
