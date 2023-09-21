import {logger} from '../../utils/logger';
import {
  generateToOneAssocationFieldResolver,
} from '../helpers';
import {
  dateHistogram,
  best100Photos,
  topPhotographers,
  topCategories,
} from './gear_stats_aggregation_helpers';

export const resolvers = {
  LensInfo: {
    __resolveType({__resolveType}) {
      return __resolveType;
    },
  },

  LensOption: {
    __resolveType({__resolveType}) {
      return __resolveType;
    },
  },

  UnverifiedLens: {},

  Lens: {
    brand: generateToOneAssocationFieldResolver('brand', 'Gear', 'GearBrand', '__brandId'),

    canonicalPath: async ({__brandId, __slug}, _, {dataSources}) => {
      let brandSlug = 'unverified';
      if (__brandId) {
        const brand = await dataSources.Gear.gearBrand.findByInternalId(__brandId);
        brandSlug = brand.__slug;
      }
      return `/gear/lenses/${brandSlug}/${__slug}`;
    },

    displayName: async ({__brandId, __name}, _, {dataSources}) => {
      if (__brandId) {
        const brand = await dataSources.Gear.gearBrand.findByInternalId(__brandId);
        return `${brand.name} ${__name}`;
      } else {
        return __name;
      }
    },
    dateHistogram,
    best100Photos,
    topPhotographers,
    topCategories,
  },
};
