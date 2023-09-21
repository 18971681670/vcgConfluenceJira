import {GraphQLScalarType} from 'graphql';
import {Kind} from 'graphql/language';

export const MIN_PAGINATION_AMOUNT = 1;
export const MAX_PAGINATION_AMOUNT = 200;

export const resolvers = {
  PaginationAmount: new GraphQLScalarType({
    name: 'PaginationAmount',
    // eslint-disable-next-line no-multi-str
    description: 'The `PaginationAmount` scalar type represents non-fractional whole numeric values, \
ranging from 1 to 100, inclusively.',
    parseValue(value) {
      if (Number.isInteger(value)) {
        return Math.min(Math.max(value, MIN_PAGINATION_AMOUNT), MAX_PAGINATION_AMOUNT);
      } else {
        return null;
      }
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return Math.min(Math.max(ast.value, MIN_PAGINATION_AMOUNT), MAX_PAGINATION_AMOUNT);
      } else {
        return null;
      }
    },
    serialize(value) {
      return value;
    },
  }),
};
