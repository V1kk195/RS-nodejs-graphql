import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql/type/index.js';
import { MemberTypeId } from '../../member-types/schemas.js';
import { Context } from './context.js';

export const memberTypeEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  description: 'Member Type Id',
  values: {
    basic: {
      value: MemberTypeId.BASIC,
      description: 'basic member type',
    },
    business: {
      value: MemberTypeId.BUSINESS,
      description: 'business member type',
    },
  },
});

export const memberTypeObject = new GraphQLObjectType({
  name: 'memberType',
  fields: () => ({
    id: { type: memberTypeEnum },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  }),
});

export const memberTypeQueryFields = {
  memberType: {
    type: memberTypeObject,
    args: {
      id: {
        type: new GraphQLNonNull(memberTypeEnum),
      },
    },
    resolve: async (_source, { id }: { id: string }, { prisma }: Context) => {
      return prisma.memberType.findUnique({
        where: { id },
      });
    },
  },
  memberTypes: {
    type: new GraphQLList(memberTypeObject),
    resolve: async (_source, _args, context: Context) => {
      return context.prisma.memberType.findMany();
    },
  },
};
