import {logger} from '../../utils/logger';

export const resolvers = {
  UserAvatar: {
    images({__internalId, version, __s3Path}, {sizes}, {dataSources}) {
      return dataSources.Resize.userAvatarResizeImage.findByInternalId({
        userId: __internalId,
        version,
        s3Avatar: __s3Path,
        sizes,
      });
    },
  },
  Mutation: {
    deleteAvatar: async (_, {input}, {dataSources}) => {
      const {
        clientMutationId,
      } = input;

      // eslint-disable-next-line max-len
      await dataSources.UserAvatar.userAvatar.destroy();

      return {
        clientMutationId,
      };
    },
  },
};
