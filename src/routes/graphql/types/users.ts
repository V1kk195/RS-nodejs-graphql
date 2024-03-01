import {
  GraphQLFloat,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql/type/index.js';
import { UUIDType } from './uuid.js';
import { Context } from './context.js';

export const userObject = new GraphQLObjectType({
  name: 'user',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});

export const usersQueryFields = {
  users: {
    type: new GraphQLList(userObject),
    resolve: async (_source, _args, context: Context) => {
      return context.prisma.user.findMany();
    },
  },
};
