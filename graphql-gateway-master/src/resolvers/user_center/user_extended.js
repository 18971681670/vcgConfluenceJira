import {
  logger,
} from '../../utils/logger';

export const resolvers = {
  Mutation: {
    setUserOnboardingStep: async (_, {
      onboardingStep,
      legacyUserId,
    }, {
        dataSources,
      }) => {
      const userExtended = await dataSources.UserCenter.extendedUser.update(legacyUserId, {
        onboardingStep,
      });

      return userExtended.onboardingStep.toUpperCase();
    },
  },

};
