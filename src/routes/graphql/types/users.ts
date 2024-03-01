import {
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql/type/index.js';
import { UUIDType } from './uuid.js';
import { Context } from './context.js';
import { UUID } from 'node:crypto';
import { profileObject } from './profiles.js';

export const userObject = new GraphQLObjectType({
  name: 'user',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: { type: profileObject },
  }),
});

export const usersQueryFields = {
  users: {
    type: new GraphQLList(userObject),
    resolve: async (_source, _args, context: Context) => {
      return context.prisma.user.findMany();
    },
  },
  user: {
    type: userObject,
    args: {
      id: {
        type: new GraphQLNonNull(UUIDType),
      },
    },
    resolve: async (_source, { id }: { id: UUID }, { prisma }: Context) => {
      return prisma.user.findUnique({
        where: { id },
      });
    },
  },
};
