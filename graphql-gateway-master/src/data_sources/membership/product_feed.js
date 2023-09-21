import {API} from '../base/api';

/**
 * Paginated API for Product feed accessable by everyone
 */
export class ProductFeed extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'membership';
  }

  /**
   * Get a paginated list of Product resources for everyone
   * @param {String} period `ANNUAL`/`MONTHLY` filter
   */
  async paginatedProductList(period) {
    const qs = {
      period,
    };

    // const response = await this.get(`internal/graphql/products`, this.tidyQuery(qs));
    const response = await this.get(`v1/membership/product/index`, this.tidyQuery(qs));

    const fieldName = period == 'ANNUAL' ? 'yearly_product' : 'monthly_product';
    const __products = response[fieldName].map((obj) => {
      return this.siblingDataSources.product.reducer(obj);
    });

    const __productEdgePayloads = response[fieldName].map((obj) => {
      return {
        __promotionCode: response.promo_code,
        __promotionType: response.promo_type,
        __promotionDiscountedPriceInCents: obj.discount_price,
        __promotionDiscountInPercent: obj.discount_in_percent,
      };
    });

    return {
      __products,
      __productEdgePayloads,
      totalCount: __products.length,
    };
  }
}
