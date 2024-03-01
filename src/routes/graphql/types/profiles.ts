import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
} from 'graphql/type/index.js';
import { UUIDType } from './uuid.js';
import { Context } from './context.js';

export const profileObject = new GraphQLObjectType({
  name: 'profile',
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: UUIDType },
  }),
});

export const profilesQueryFields = {
  profiles: {
    type: new GraphQLList(profileObject),
    resolve: async (_source, _args, context: Context) => {
      return context.prisma.profile.findMany();
    },
  },
};
