import {logger} from '../../utils/logger';
import {
  generateToOneAssocationFieldResolver,
} from '../helpers';

export const resolvers = {
  Comment: {
    creator: generateToOneAssocationFieldResolver('creator', 'UserCenter', 'User'),

    replyTo: generateToOneAssocationFieldResolver('replyTo', 'Commenting', 'Comment'),

    replies: async ({__replies}, _, {dataSources}) => {
      const repliesList = __replies || [];
      return repliesList.map((reply) => dataSources.Commenting.comment.reducer(reply));
    },
  },
  Mutation: {
    // create comment on photo.
    addCommentOnPhoto: async (_, {input}, {dataSources}) => {
      const {
        clientMutationId,
      } = input;

      const {
        comment,
      } = await dataSources.Commenting.comment.create(input);

      return {
        clientMutationId,
        comment,
      };
    },
    // create comment on comment (comment reply)
    addCommentOnComment: async (_, {input}, {dataSources})=>{
      const {
        clientMutationId,
      } = input;

      const {
        comment,
      } = await dataSources.Commenting.comment.createOnComment(input);

      return {
        clientMutationId,
        comment,
      };
    },
    // delete comment by comment owner or photo owner.
    deleteComment: async (_, {input}, {dataSources}) => {
      const {
        clientMutationId,
      } = input;

      await dataSources.Commenting.comment.deleteComment(input);

      return {
        clientMutationId,
      };
    },
    // create comment on photo.
    addCommentOnStory: async (_, {input}, {dataSources}) => {
      const {
        clientMutationId,
      } = input;

      const {
        comment,
      } = await dataSources.Commenting.comment.createForStory(input);

      return {
        clientMutationId,
        comment,
      };
    },
    // create comment on comment (comment reply)
    addCommentOnStoryComment: async (_, {input}, {dataSources})=>{
      const {
        clientMutationId,
      } = input;

      const {
        comment,
      } = await dataSources.Commenting.comment.addCommentOnStoryComment(input);

      return {
        clientMutationId,
        comment,
      };
    },
  },
};
