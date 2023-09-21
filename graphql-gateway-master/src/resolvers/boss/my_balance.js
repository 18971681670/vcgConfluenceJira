import {logger} from '../../utils/logger';

export const resolvers = {
  Query: {
    myBalance: async (_, {}, {dataSources}) => {
      const __myBalance = await dataSources.Boss.myBalance.queryBalance();
      return __myBalance;
    },
    myTipaltiIframeUrls: async (_, {}, {dataSources}) => {
      const __tipaltiUrls = await dataSources.Boss.myBalance.queryTipaltiIframeUrls();
      return __tipaltiUrls;
    },
    tipaltiPayable: async (_, {}, {dataSources}) => {
      const __tipaltiPayable = await dataSources.Boss.myBalance.tipaltiPayable();
      return __tipaltiPayable;
    },
    tipaltiSetup: async (_, {}, {dataSources}) => {
      const __tipaltiSetup = await dataSources.Boss.myBalance.tipaltiSetup();
      return __tipaltiSetup;
    },
    isFirstFillTipalti: async (_, {}, {dataSources}) => {
      const __isFirstFill = await dataSources.Boss.myBalance.isFirstFillTipalti();
      return __isFirstFill;
    },
  },
};
