import {API} from '../base/api';

/**
 * Paginated API for Gear Stats Aggregation
 */
export class GearStatsAggregation extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'search';
  }

  /**
   * Get a gear photographer date histogram data point
   * @param {String} gearType The gear type
   * @param {String} gearId The gear legacyId
   * @return {Array} photographer date histogram data point
   */
  async dateHistogram(gearType, gearId) {
    const qs = {
      gear_type: gearType.toLowerCase(),
      gear_id: gearId,
    };
    return this.get(`/aggregation/equipment/photographer_date_histogram`, qs);
  }

  /**
   * Get top 100 photos according to gear Id
   * @param {gearType} gearType The gear type
   * @param {Int} gearId The gear legacyId
   * @return {Array} top 100 photo ids
   */
  async best100PhotoIds(gearType, gearId) {
    const qs = this.tidyQuery({
      gear_type: gearType.toLowerCase(),
      gear_id: gearId,
    });

    return this.get(`/aggregation/equipment/top/photos`, qs);
  }

  /**
   * Get top photographers according to gear Id
   * @param {gearType} gearType The gear type
   * @param {Int} gearId The gear legacyId
   * @param {Int} category The category id
   * @return {Array} top 10 photographers
   */
  async topPhotographers(gearType, gearId, category) {
    const qs = this.tidyQuery({
      gear_type: gearType.toLowerCase(),
      gear_id: gearId,
      category: category,
    });

    return this.get(`/aggregation/equipment/top_photographers`, qs);
  }

  /**
   * Get top categories according to gear Id
   * @param {String} gearType The gear type
   * @param {String} gearId The gear legacyId
   * @return {Array} top categories
   */
  async topCategories(gearType, gearId) {
    const qs = {
      gear_type: gearType.toLowerCase(),
      gear_id: gearId,
    };
    return this.get('/aggregation/equipment/top/categories', qs);
  }
}
