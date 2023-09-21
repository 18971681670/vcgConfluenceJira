import {logger} from '../../utils/logger';
import {ValidationError} from 'apollo-server-core';
/*
 * import {
 *   generateToOneAssocationFieldResolver,
 * } from '../helpers';
 */

export const resolvers = {
  Mutation: {
    // report a comment.
    flagComment: async (_, {input}, {dataSources}) => {
      const {
        clientMutationId,
        commentLegacyId,
      } = input;

      // get comment info to get comment lates comment status.
      const commentList = await dataSources.Commenting.comment.bulkLoadData([commentLegacyId]);
      logger.debug(`find flag commentList: ${commentList}`);
      if (!commentList || !commentList[0]) {
        logger.warn(`Cannot find the comment resource. commentLegacyId:${commentLegacyId}`);
        // there is no comment with that id found.
        throw new ValidationError(`Cannot find the comment resource. commentLegacyId:${commentLegacyId}`);
      }

      const body = {
        ...input,
        commentStatus: commentList[0].status,
      };

      await dataSources.Flagging.flagging.flagComment(body);

      return {
        clientMutationId,
      };
    },
    flagUser: async (_, {input}, {dataSources}) => {
      const _response = await dataSources.Flagging.flagging.flagUser(input);

      return {
        userLegacyId: input.userLegacyId,
      };
    },
    flagGallery: async (_, {input}, {dataSources}) => {
      const _response = await dataSources.Flagging.flagging.flagGallery(input);

      return {
        galleryLegacyId: input.galleryLegacyId,
      };
    },
    flagPhoto: async (_, {input}, {dataSources}) => {
      const _response = await dataSources.Flagging.flagging.flagPhoto(input);

      return {
        photoLegacyId: input.photoLegacyId,
      };
    },
    flagGroupPost: async (_, {input}, {dataSources}) => {
      const _response = await dataSources.Flagging.flagging.flagGroupPost(input);

      return {
        groupPostLegacyId: input.groupPostLegacyId,
      };
    },
    flagResource: async (_, {input}, {dataSources}) => {
      const _response = await dataSources.Flagging.flagging.flagResource(input);

      return {
        resourceLegacyId: input.resourceLegacyId,
      };
    },
  },
};
