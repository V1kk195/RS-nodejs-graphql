import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql/type/index.js';
import { UUIDType } from './uuid.js';
import { Context } from './context.js';
import { UUID } from 'node:crypto';
import { memberTypeEnum, memberTypeObject } from './memberType.js';
import { Profile } from '@prisma/client';

type CreateProfileArgs = {
  dto: {
    isMale: boolean;
    yearOfBirth: number;
    userId: string;
    memberTypeId: string;
  };
};

type ChangeProfileArgs = {
  id: string;
  dto: {
    isMale: boolean;
    yearOfBirth: number;
    memberTypeId: string;
  };
};

export const profileObject = new GraphQLObjectType({
  name: 'profile',
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: memberTypeEnum },
    memberType: {
      type: memberTypeObject,
      resolve: async (_source: Profile, _args, { loader }: Context) => {
        return loader.memberTypes.load(_source.memberTypeId);
      },
    },
  }),
});

const profileInputObject = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(memberTypeEnum) },
  }),
});

const changeProfileInputObject = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: memberTypeEnum },
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

export const profilesMutationFields = {
  createProfile: {
    type: profileObject as GraphQLObjectType,
    args: {
      dto: {
        type: new GraphQLNonNull(profileInputObject),
      },
    },
    resolve: async (_source, { dto }: CreateProfileArgs, { prisma }: Context) => {
      return prisma.profile.create({
        data: dto,
      });
    },
  },
  deleteProfile: {
    type: UUIDType,
    args: {
      id: {
        type: new GraphQLNonNull(UUIDType),
      },
    },
    resolve: async (_source, { id }: { id: string }, { prisma }: Context) => {
      await prisma.profile.delete({
        where: { id },
      });
    },
  },
  changeProfile: {
    type: profileObject as GraphQLObjectType,
    args: {
      id: {
        type: new GraphQLNonNull(UUIDType),
      },
      dto: {
        type: new GraphQLNonNull(changeProfileInputObject),
      },
    },
    resolve: async (_source, { id, dto }: ChangeProfileArgs, { prisma }: Context) => {
      return prisma.profile.update({
        where: { id },
        data: dto,
      });
    },
  },
};
