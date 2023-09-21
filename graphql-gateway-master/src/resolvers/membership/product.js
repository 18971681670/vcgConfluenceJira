import {logger} from '../../utils/logger';

export const resolvers = {
  Product: {
    __resolveType: ({__bundledMembershipId}) => {
      if (__bundledMembershipId) {
        return 'ProductAdobeBundle';
      } else {
        return 'ProductMembership';
      }
    },
  },

  ProductAdobeBundle: {
    outOfStock: async ({__internalId}, _, {dataSources}) => {
      return false;

      return dataSources.Membership.adobeAvailability.findByKey(__internalId);
    },

    bundledMembership: async ({__bundledMembershipId, subscriptionPeriod}, _, {dataSources}) => {
      return {
        ...dataSources.Membership.product.idReducer(__bundledMembershipId),
        subscriptionPeriod,
        priceInCents: null,
        name: '',
        tier: 'PRO',
      };
    },
  },

  ProductEdge: {
    eligible: async ({__internalId}, _, {dataSources}) => {
      return true;

      return dataSources.Membership.productEligibility.findByKey(__internalId);
    },

    discount: async (parent, _, {dataSources}) => {
      const {
        __internalId,
        __promotionDiscountedPriceInCents,
        __promotionDiscountInPercent,
        __promotionCode,
        __promotionType,
      } = parent;

      if (!__promotionCode) {
        return null;
      }

      return {
        ...dataSources.Membership.promotionDiscount.idReducer(__internalId + __promotionCode),
        priceInCents: __promotionDiscountedPriceInCents,
        percent: __promotionDiscountInPercent,
        code: __promotionCode,
        type: __promotionType,
      };

      return dataSources.Membership.bestProductPromotionDiscount.findByKey(__internalId);
    },
  },
};
