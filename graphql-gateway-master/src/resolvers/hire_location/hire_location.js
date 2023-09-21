export const resolvers = {
  HireLocation: {
  },

  Mutation: {
    createUpdateLocationsForHire: async (_, {userId, input}, {dataSources}) => {
      return await dataSources.HireLocation.hireLocation.update(userId, input);
    },
  },

  Query: {
    getUserHireLocations: async (_, {userId}, {dataSources}) => {
      const {hireLocations} = await dataSources.HireLocation.hireLocation.getUserHireLocations(userId);
      return {
        hireLocations,
      };
    },

    getHireLocations: async (_, {latitude, longitude}, {dataSources}) => {
      const {hireLocations} = await dataSources.HireLocation.hireLocation.getHireLocations(latitude, longitude);
      return {
        hireLocations,
      };
    },
  },
};
