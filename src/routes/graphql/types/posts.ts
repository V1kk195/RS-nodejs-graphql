import {
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql/type/index.js';
import { UUIDType } from './uuid.js';
import { Context } from './context.js';
import { UUID } from 'node:crypto';

export const postObject = new GraphQLObjectType({
  name: 'post',
  fields: () => ({
    id: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
  }),
});

export const postInputObject = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  }),
});

export const postsListType = new GraphQLList(postObject);

export const postsQueryFields = {
  posts: {
    type: postsListType,
    resolve: async (_source, _args, context: Context) => {
      return context.prisma.post.findMany();
    },
  },
  post: {
    type: postObject,
    args: {
      id: {
        type: new GraphQLNonNull(UUIDType),
      },
    },
    resolve: async (_source, { id }: { id: UUID }, { prisma }: Context) => {
      return prisma.post.findUnique({
        where: { id },
      });
    },
  },
};

type CreatePostArgs = {
  dto: {
    title: string;
    content: string;
    authorId: string;
  };
};

export const postsMutationFields = {
  createPost: {
    type: postObject,
    args: {
      dto: {
        type: new GraphQLNonNull(postInputObject),
      },
    },
    resolve: async (_source, { dto }: CreatePostArgs, { prisma }: Context) => {
      return prisma.post.create({
        data: dto,
      });
    },
  },
};
