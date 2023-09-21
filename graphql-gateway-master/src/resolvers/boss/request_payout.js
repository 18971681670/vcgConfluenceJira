import {logger} from '../../utils/logger';

export const resolvers = {
  Mutation: {
    userRequestPayout: async (_, {}, {dataSources}) => {
      const payoutRequestResult = await dataSources.Boss.myRequestPayout.requestPayout();
      return payoutRequestResult;
    },
  },
};
