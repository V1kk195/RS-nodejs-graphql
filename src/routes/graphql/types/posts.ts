import {
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
