import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql/type/index.js';
import { UUIDType } from './uuid.js';
import { Context } from './context.js';
import { UUID } from 'node:crypto';
import { profileObject } from './profiles.js';
import { postsListType } from './posts.js';
import { User } from '@prisma/client';

export const userObject = new GraphQLObjectType({
  name: 'user',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: profileObject,
      resolve: async (_source: User, _args, context: Context) => {
        return context.prisma.profile.findUnique({ where: { userId: _source.id } });
      },
    },
    posts: {
      type: postsListType,
      resolve: async (_source: User, _args, context: Context) => {
        return context.prisma.post.findMany({ where: { authorId: _source.id } });
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(userObject),
      resolve: async (_source: User, _args, context: Context) => {
        return context.prisma.user.findMany({
          where: { subscribedToUser: { some: { subscriberId: _source.id } } },
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLList(userObject),
      resolve: async (_source: User, _args, context: Context) => {
        return context.prisma.user.findMany({
          where: { userSubscribedTo: { some: { authorId: _source.id } } },
        });
      },
    },
  }),
});

export const userInputObject = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
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
    type: userObject as GraphQLObjectType,
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

type CreateUserArgs = {
  dto: {
    name: string;
    balance: number;
  };
};

export const usersMutationFields = {
  createUser: {
    type: userObject as GraphQLObjectType,
    args: {
      dto: {
        type: new GraphQLNonNull(userInputObject),
      },
    },
    resolve: async (_source, { dto }: CreateUserArgs, { prisma }: Context) => {
      return prisma.user.create({
        data: dto,
      });
    },
  },
};
