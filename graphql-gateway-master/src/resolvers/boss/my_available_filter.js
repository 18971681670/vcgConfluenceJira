import {logger} from '../../utils/logger';

export const resolvers = {
  Query: {
    myAvailableFilterYear: async (_, {}, {dataSources}) => {
      const __filterYear = await dataSources.Boss.myAvailableFilter.queryAvailableFilterYear();
      return __filterYear;
    },
    myAvailableFilterSource: async (_, {year}, {dataSources}) => {
      const __filterSource = await dataSources.Boss.myAvailableFilter.queryAvailableFilterSource(year);
      return __filterSource;
    },
    myAvailableFilterTerritory: async (_, {year, source}, {dataSources}) => {
      const __filterTerritory = await dataSources.Boss.myAvailableFilter.queryAvailableFilterTerritory(year, source);
      return __filterTerritory;
    },
    myAvailableFilterPayoutStatus: async (_, {year, source, territory}, {dataSources}) => {
      const __filterPayoutStatus = await dataSources.Boss.myAvailableFilter.queryAvailableFilterPayoutStatus(year, source, territory);
      return __filterPayoutStatus;
    },
  },
};
