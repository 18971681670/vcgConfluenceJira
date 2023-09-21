export const resolvers = {
  AutoLicensingPhoto: {
    exclusiveUsage: ({__licensingPhotoInfo}) => {
      return (__licensingPhotoInfo && __licensingPhotoInfo.exclusiveUse) || false;
    },
  },
  Mutation: {
    cancelAutoLicensingPhoto: async (_parent, _args, {dataSources}) => {
      const autoLicensingPhoto = dataSources.Licensing.autoLicensingPhoto.cancelAutoLicensing(_args.input.legacyId);
      return {
        autoLicensingPhoto,
      };
    },
  },
};
