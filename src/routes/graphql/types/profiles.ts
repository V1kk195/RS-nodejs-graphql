import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql/type/index.js';
import { UUIDType } from './uuid.js';
import { Context } from './context.js';
import { UUID } from 'node:crypto';
import { memberTypeObject } from './memberType.js';
import { Profile } from '@prisma/client';

export const profileObject = new GraphQLObjectType({
  name: 'profile',
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: UUIDType },
    memberType: {
      type: memberTypeObject,
      resolve: async (_source: Profile, _args, context: Context) => {
        return context.prisma.memberType.findUnique({
          where: { id: _source.memberTypeId },
        });
      },
    },
  }),
});

export const profilesQueryFields = {
  profiles: {
    type: new GraphQLList(profileObject),
    resolve: async (_source, _args, context: Context) => {
      return context.prisma.profile.findMany();
    },
  },
  profile: {
    type: profileObject,
    args: {
      id: {
        type: new GraphQLNonNull(UUIDType),
      },
    },
    resolve: async (_source, { id }: { id: UUID }, { prisma }: Context) => {
      return prisma.profile.findUnique({
        where: { id },
      });
    },
  },
};
