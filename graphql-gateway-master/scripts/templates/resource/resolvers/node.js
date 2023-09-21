import {logger} from '../../utils/logger';
import {
  generateToOneAssocationFieldResolver,
} from '../helpers';

export const resolvers = {
  __RESOURCE_TYPE_PASCALCASE__: {
    owner: generateToOneAssocationFieldResolver('owner', 'UserCenter', 'User'),
  },

  Mutation: {
    create__RESOURCE_TYPE_PASCALCASE__: async (_, {input}, {dataSources}) => {
      const {
        clientMutationId,
      } = input;

      // eslint-disable-next-line max-len
      const __RESOURCE_TYPE_CAMELCASE__ = await dataSources.__MICROSERVICE_PASCALCASE__.__RESOURCE_TYPE_CAMELCASE__.create(input);

      return {
        clientMutationId,
        __RESOURCE_TYPE_CAMELCASE__,
      };
    },

    update__RESOURCE_TYPE_PASCALCASE__: async (_, {input}, {dataSources}) => {
      const {
        clientMutationId,
        legacyId,
      } = input;

      // eslint-disable-next-line max-len
      const __RESOURCE_TYPE_CAMELCASE__ = await dataSources.__MICROSERVICE_PASCALCASE__.__RESOURCE_TYPE_CAMELCASE__.update(legacyId, input);

      return {
        clientMutationId,
        __RESOURCE_TYPE_CAMELCASE__,
      };
    },

    delete__RESOURCE_TYPE_PASCALCASE__: async (_, {input}, {dataSources}) => {
      const {
        clientMutationId,
        legacyId,
      } = input;

      // eslint-disable-next-line max-len
      await dataSources.__MICROSERVICE_PASCALCASE__.__RESOURCE_TYPE_CAMELCASE__.destroy(legacyId);

      return {
        clientMutationId,
      };
    },
  },
};
