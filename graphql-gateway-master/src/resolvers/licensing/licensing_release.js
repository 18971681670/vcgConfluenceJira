export const resolvers = {
  LicensingRelease: {
    modelReleaseMetadata({__internalId}, __, {dataSources}) {
      return dataSources.Licensing.modelReleaseMetadata.findByInternalId(__internalId);
    },
  },
};
