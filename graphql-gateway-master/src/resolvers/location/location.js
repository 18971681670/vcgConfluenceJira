export const resolvers = {
  Query: {
    getLocation: async (_, placeId, {dataSources}) => {
      return await dataSources.Location.location.getLocation(placeId);
    },
  },
};
